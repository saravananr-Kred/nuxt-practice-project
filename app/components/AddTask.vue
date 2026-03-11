<template>
  <Modal
    :isOpen="open"
    :title="id === 0 ? 'Add Task' : 'Edit Task'"
    @close="openAddTask(false)"
  >
    <form @submit.prevent="submitTask" id="addTaskForm">
      <div class="flex flex-col gap-y-2 w-full items-center justify-start">
        <FileInput
          @handle-file-upload="handleFileUpload"
          @clear-image="clearDocument"
          :imagePreview="documentPreview"
          :selectedFile="selectedFile"
          type="document"
        />
        <Input
          v-model="taskData.name"
          placeholder="Task Name"
          type="text"
          label="Task Name"
        />
        <Select
          v-model="taskData.status"
          :options="statusOptions"
          label="Status"
          placeholder="Select Status"
          variant="outlined"
          height="36px"
        />
        <Datepicker
          v-model="taskData.end_date"
          label="End Date"
          height="36px"
        />
        <Input
          v-model="taskData.notes"
          placeholder="Note"
          type="text"
          label="Note"
        />
        <Select
          v-model="taskData.priority"
          :options="priorityOptions"
          label="Priority"
          placeholder="Select Priority"
          variant="outlined"
          height="36px"
        />
        <Autocomplete
          v-model="assignedTo"
          :items="userOptions"
          :loading="isSearching"
          label="Assign To"
          layout="default"
          @search="searchUsers"
        />
      </div>
    </form>
    <template #footer>
      <Button
        type="submit"
        form="addTaskForm"
        additionalClasses="font-semibold"
      >
        <span class="flex gap-x-2 justify-center">
          <Spinner :loading="loadingTasks" />
          {{
            id === 0
              ? loadingTasks
                ? "Submitting..."
                : "Submit"
              : loadingTasks
                ? "Updating..."
                : "Update"
          }}
        </span>
      </Button>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { debounce } from "@/utils/debounce";

type SearchUser = {
  type: string;
  id: number;
  name: string;
};
const tasksStore = useTasksStore();
const usersStore = useUsersStore();
const open = defineModel<boolean>({ required: true });
const { singleTask, loadingTasks } = storeToRefs(tasksStore);
const { users } = storeToRefs(usersStore);
const emit = defineEmits<{
  (e: "refresh-task"): void;
}>();

const selectedFile = ref<FileList | null>(null);
const documentPreview = ref<string[] | null>(null);
const { $api } = useNuxtApp();
let isSearching = ref<boolean>(false);

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files;
    documentPreview.value = Array.from(target.files).map((file) =>
      URL.createObjectURL(file),
    );
  }
}

function clearDocument() {
  selectedFile.value = null;
  documentPreview.value = null;
}

const statusOptions = [
  { label: "Open", value: "Open" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "On Hold", value: "On Hold" },
];

const priorityOptions = [
  { label: "Very High", value: "Very High" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

let userOptions = ref<Option[]>([]);

const filePreview = (files: string[]) => {
  if (!files) {
    documentPreview.value = null;
    return;
  }

  documentPreview.value = files.map((file) => {
    return file.replace("task_documents/", "");
  });
};

// Build user dropdown options from filteredUsers
watch(
  users,
  (newUsers) => {
    userOptions.value = newUsers.map((user) => ({
      label: user.name,
      value: user.user_id,
    }));
  },
  { immediate: true },
);

const id = ref<number>(0);
const assignedTo = ref<number | null>(null);

const taskData = ref<TaskFormData>({
  name: "",
  status: "Open",
  end_date: "",
  notes: "",
  priority: "Medium",
  assigned_to: null,
});

// Keep assigned_to in sync with the string dropdown value
watch(assignedTo, (val) => {
  taskData.value.assigned_to = val ? Number(val) : null;
});
console.log(assignedTo, "assignedTo");
function openAddTask(value: boolean) {
  resetForm();
  open.value = value;
}

function resetForm() {
  id.value = 0;
  assignedTo.value = null;
  taskData.value = {
    name: "",
    status: "Open",
    end_date: "",
    notes: "",
    priority: "Medium",
    assigned_to: null,
  };
  clearDocument();
}

async function submitTask() {
  const formData = new FormData();

  Object.entries(taskData.value).forEach(([key, value]) => {
    if (key === "end_date") {
      if (value !== null && value !== undefined) {
        let data = String(value).split("T")[0] || "";
        formData.append(key, data);
      }
    }
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (selectedFile.value) {
    Array.from(selectedFile.value).forEach((file) => {
      formData.append("documents[]", file);
    });
  }
  try {
    if (id.value === 0) {
      await tasksStore.addTask(formData);
    } else {
      formData.append("_method", "PUT");
      await tasksStore.updateTask(formData, id.value);
    }

    open.value = false;
    emit("refresh-task");
    resetForm();
  } catch (error) {
    console.error("API failed:", error);
  }
}

const searchUsers = debounce(async (search: string) => {
  if (!search) {
    isSearching.value = false;
    return;
  }
  isSearching.value = true;
  try {
    let response = await $api("/api/search-user-task", {
      method: "POST",
      body: {
        search,
      },
    });

    userOptions.value = response
      .filter((x: SearchUser) => x.type === "user")
      .map((user: SearchUser) => ({
        label: user.name,
        value: user.id,
      }));
  } catch (error) {
    console.error(error);
  } finally {
    isSearching.value = false;
  }
}, 500);

watch(
  () => singleTask.value,
  (newData) => {
    if (newData?.id) {
      console.log(newData, "newData");

      id.value = newData.id;
      assignedTo.value = newData.assigned_to ? newData.assigned_to.id : null;
      taskData.value = {
        name: newData.name || "",
        status: newData.status || "Open",
        end_date: newData.end_date || "",
        notes: newData.notes || "",
        priority: newData.priority || "Medium",
        assigned_to: newData.assigned_to?.id || null,
      };
      filePreview(newData.file_url);
    } else {
      resetForm();
    }
  },
  { immediate: true, deep: true },
);
</script>

<style></style>
