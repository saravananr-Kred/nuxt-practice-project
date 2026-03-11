<script setup lang="ts">
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";

const { can } = usePermis();
interface DraggableEvent {
  added?: {
    element: any;
    newIndex: number;
  };
  removed?: {
    element: any;
    oldIndex: number;
  };
  moved?: {
    element: any;
    newIndex: number;
    oldIndex: number;
  };
}

const tasksStore = useTasksStore();
const { search, tasksByStatus, tasks, singleTask } = storeToRefs(tasksStore);
const openModal = ref<boolean>(false);
const showDetailPanel = ref<boolean>(false);
const { $api } = useNuxtApp();
const userStore = useUsersStore();
const { users } = storeToRefs(userStore);
const currentPage = ref<number>(1);
const perPage = ref<number>(10);
const sortBy = ref<string>("id");
const sortOrder = ref<"asc" | "desc">("asc");

const columnMeta: Record<string, { color: string; icon: string }> = {
  Open: { color: "#3b82f6", icon: "📋" },
  "In Progress": { color: "#f59e0b", icon: "⚙️" },
  Completed: { color: "#10b981", icon: "✅" },
  "On Hold": { color: "#6b7280", icon: "⏸️" },
};

const handleMove = async (event: DraggableEvent, newStatus: string) => {
  isLoading.value = true;
  if (event.added) {
    const movedTask = event.added.element;
    console.log(movedTask, "data");
    try {
      await $api(`/api/tasks/status/${movedTask.id}`, {
        method: "put",
        body: {
          status: newStatus,
        },
      });
      await refresh();
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  }
};

async function handleViewTask(id: number) {
  await tasksStore.fetchSingleTask(id);
  showDetailPanel.value = true;
}

function handleOpenModal() {
  tasksStore.singleTask = null;
  openModal.value = true;
}

async function handleEditTask(id: number) {
  await tasksStore.fetchSingleTask(id);
  showDetailPanel.value = false;
  openModal.value = true;
}

function handleEditFromPanel(id: number) {
  showDetailPanel.value = false;
  openModal.value = true;
}

async function handleDeleteFromPanel(id: number) {
  await tasksStore.deleteTask(id);
  showDetailPanel.value = false;
  await refresh();
}

const {
  error,
  pending: isLoading,
  refresh,
} = await useAsyncData(
  "user-details",
  async () => {
    const [usersData, tasksData] = await Promise.all([
      $api<{ data: AllUsersDetailsData[] }>(
        "/api/user-details?page=" +
          currentPage.value +
          "&limit=" +
          perPage.value +
          "&sort_by=" +
          sortBy.value +
          "&sort_order=" +
          sortOrder.value,
      ),
      $api<TaskData[]>("/api/tasks"),
    ]);
    users.value = usersData.data;
    tasks.value = tasksData;

    return { users, tasks };
  },
  {
    lazy: true,
  },
);

watch(error, (error) => {
  const toastStore = useToastStore();

  const errorMsg = error?.message || "Something went wrong";
  toastStore.showError(errorMsg);
});

function handleDeleteTask(id: number) {
  tasksStore.deleteTask(id);
  refresh();
}
</script>

<template>
  <main class="task-page">
    <!-- Header -->
    <h1 class="font-semibold text-2xl">Tasks List</h1>
    <hr class="border-1 border-[#c0e5c9] mt-2 mb-4" />
    <div class="task-header">
      <div class="w-max">
        <Input
          label="Search Tasks"
          error=""
          type="text"
          v-model="search"
          placeholder="Search by name..."
        />
      </div>
      <Button
        v-if="can('add-tasks')"
        @button-click="handleOpenModal"
        additionalClasses="font-semibold"
      >
        + Add Task
      </Button>
    </div>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-full rounded-md grid grid-cols-4 gap-8">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-gray-100 h-64 gap-2 grid grid-row-4 animate-pulse"
        >
          <div v-for="j in 4" :key="j" class="bg-gray-400 h-12"></div>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div v-else class="kanban-board">
      <div
        v-for="(tasks, status) in tasksByStatus"
        :key="status"
        class="kanban-column"
      >
        <!-- Column Header -->
        <div class="column-header">
          <div class="flex items-center gap-2">
            <span
              class="column-dot"
              :style="{ background: columnMeta[status]?.color || '#999' }"
            ></span>
            <h3 class="font-semibold text-gray-700 text-sm">{{ status }}</h3>
            <span class="task-count">{{ tasks.length }}</span>
          </div>
        </div>

        <!-- Cards -->
        <div class="column-body">
          <draggable
            v-model="tasksByStatus[status]"
            group="kanban-tasks"
            item-key="id"
            class="min-h-[100px] space-y-3"
            ghost-class="opacity-40"
            @change="(event: DraggableEvent) => handleMove(event, status)"
          >
            <template #item="{ element: task }">
              <div>
                <TaskKanbanCard
                  :task="task"
                  @view-task="handleViewTask"
                  @edit-task="handleEditTask"
                  @delete-task="handleDeleteTask"
                />
              </div>
            </template>
          </draggable>

          <div v-if="tasksByStatus[status].length === 0" class="empty-state">
            <p>No tasks</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <AddTask v-model="openModal" @refresh-task="refresh" />

    <Toast />
    <!-- Task Detail Panel -->
    <TaskDetailPanel
      :isOpen="showDetailPanel"
      :task="singleTask"
      @close="showDetailPanel = false"
      @edit="handleEditFromPanel"
      @delete="handleDeleteFromPanel"
    />
  </main>
</template>

<style scoped lang="scss">
.task-page {
  padding: 4px;
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: start;
}

.kanban-column {
  background: #f3f4f6;
  border-radius: 12px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  border: 2px dashed #c5c7c9;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
}

.column-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.task-count {
  background: #e5e7eb;
  color: #6b7280;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 10px;
}

.column-body {
  padding: 0 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 100px;
  color: #9ca3af;
  font-size: 13px;
}
</style>
