<script setup lang="ts">
import { ref } from "vue";
import { useForm, useField, configure } from "vee-validate";
import * as yup from "yup";

const openTasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);
const schema = yup.object({
  userName: yup
    .string()
    .trim()
    .min(3, "password must be atleast 3 characters")
    .label("Username")
    .required(),
  description: yup.string().label("Description").required(),
  endDate: yup.date().required().label("End Date"),
  priority: yup.string().required(),
});

// To get multiple errors
configure({
  bails: false,
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const { value: name, errors: nameError } = useField<string>("userName");
const { value: description, errors: descriptionError } =
  useField<string>("description");
const { value: endDate, errors: endDateError } = useField<string>("endDate");
const { value: status, errors: statusError } = useField<string>("priority");

const openTask = ref<boolean>(false);

const statusOptions = [
  { label: "Very High", value: "Very High" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

function markCompleted(item: Task) {
  if (item.isCompleted) {
    openTasks.value.push({ ...item, isCompleted: false });
    completedTasks.value = completedTasks.value.filter(
      (task: Task) => task.id !== item.id,
    );
  } else {
    completedTasks.value.push({ ...item, isCompleted: true });
    openTasks.value = openTasks.value.filter(
      (task: Task) => task.id !== item.id,
    );
  }
}

const addTask = handleSubmit((values, { resetForm }) => {
  const readable = new Date(values.endDate).toLocaleString();

  openTasks.value.push({
    id: Date.now(),
    name: values.userName,
    description: values.description,
    status: values.priority,
    endDate: readable,
    isCompleted: false,
  });

  resetForm();
});

const openAddTask = (value: boolean) => {
  resetForm();
  openTask.value = value;
};

function deleteTask(item: Task) {
  openTasks.value = openTasks.value.filter((task: Task) => task.id !== item.id);
}
</script>

<template>
  <main>
    <div class="flex justify-end w-full">
      <Button
        @button-click="openAddTask(true)"
        additionalClasses="font-semibold"
        >Add Todo</Button
      >
    </div>

    <Modal :isOpen="openTask" title="Add Todo" @close="openAddTask(false)">
      <form @submit.prevent="addTask" id="taskForm">
        <div class="flex w-full items-center justify-start">
          <div class="flex flex-col column gap-[20px]">
            <Input
              v-model="name"
              :error="nameError"
              :type="'text'"
              :label="'Task Name'"
            />
            <Input
              v-model="description"
              :error="descriptionError"
              :type="'text'"
              :label="'Task Description'"
            />
            <Input
              v-model="endDate"
              :error="endDateError"
              :type="'datetime-local'"
              :label="'Task End Date'"
            />
            <Select
              v-model="status"
              :error="statusError"
              :options="statusOptions"
              label="Task Priority"
            />
          </div>
        </div>
      </form>
      <template #footer>
        <Button
          type="submit"
          form="taskForm"
          additionalClasses="font-semibold"
        />
      </template>
    </Modal>

    <div class="grid gap-[24px] mt-[16px] grid-cols-2">
      <!-- Open box -->
      <TaskList
        :title="'Open'"
        :Tasks="openTasks"
        @delete-task="deleteTask"
        @mark-completed="markCompleted"
      />

      <!-- Completed box -->
      <TaskList :title="'Completed'" :Tasks="completedTasks" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.container {
  @include flexCenter;
  flex-direction: column;
}
</style>
