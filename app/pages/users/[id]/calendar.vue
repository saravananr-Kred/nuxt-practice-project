<script setup lang="ts">
import { computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

definePageMeta({
  title: "User Calendar",
  description: "Calendar view of user tasks",
  layout: "side-bar",
});
const tasksStore = useTasksStore();
const openModal = ref<boolean>(false);
const eventDate = ref<string>("");
const route = useRoute();

function handleOpenModal(arg: any) {
  eventDate.value = arg.dateStr; // Use dateStr for dateClick
  openModal.value = true;
}

// Fetch tasks
const { data, pending, refresh } = await useAsyncData(
  `user-tasks-${route.params.id}`,
  async () => {
    const { $api } = useNuxtApp();
    const response = await $api<{ data: any[] }>(
      `/api/users/${route.params.id}/task`,
    );
    return response.data;
  },
  { lazy: true },
);

const handleEventClick = async (arg: any) => {
  const taskId = Number(arg.event.id);
  if (!isNaN(taskId)) {
    await tasksStore.fetchSingleTask(taskId);
    openModal.value = true;
  }
};

const tasks = computed(() => data.value || []);

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return { bg: "#10b981", border: "#059669" }; // emerald
    case "in progress":
      return { bg: "#3b82f6", border: "#2563eb" }; // blue
    case "pending":
      return { bg: "#f59e0b", border: "#d97706" }; // amber
    default:
      return { bg: "#9ca3af", border: "#6b7280" }; // gray
  }
};

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  height: "auto",
  eventClick: handleEventClick,
  dateClick: handleOpenModal,

  events: tasks.value.map((task) => {
    const colors = getStatusColor(task.status);
    return {
      id: task.id.toString(),
      title: task.name,
      // Fallback to task.created_at or a specific date format if start/end fields are named differently
      start: task.end_date
        ? task.end_date.split(" ")[0]
        : new Date().toISOString().split("T")[0],
      allDay: true,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: "#ffffff",
      extendedProps: {
        status: task.status,
        assignedTo: task.assigned_to_user_name || "Unassigned",
        notes: task.notes,
      },
    };
  }),
  eventContent: (arg: any) => {
    return {
      html: `
        <div class="px-2 py-1 flex flex-col items-start justify-center w-full overflow-hidden text-xs truncate" title="${arg.event.title} - ${arg.event.extendedProps.status}">
          <div class="font-medium truncate w-full text-left">${arg.event.title}</div>
          <div class="text-[10px] opacity-90 mt-0.5 truncate w-full text-left">${arg.event.extendedProps.notes ? arg.event.extendedProps.notes : "-"}</div>
        </div>
      `,
    };
  },
}));
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div
        class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
          Task Calendar
        </h1>
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div v-if="pending" class="p-12 flex justify-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
        </div>

        <div v-else class="p-4 sm:p-6 lg:p-8">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>

      <!-- Edit Task Modal -->
      <AddTask
        v-model="openModal"
        @refresh-task="refresh"
        :eventDate="eventDate"
        :userId="Number(route.params.id)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
/* FullCalendar Customizations */
:deep(.fc) {
  --fc-border-color: #e5e7eb;
  --fc-button-text-color: #374151;
  --fc-button-bg-color: #ffffff;
  --fc-button-border-color: #d1d5db;
  --fc-button-hover-bg-color: #f3f4f6;
  --fc-button-hover-border-color: #d1d5db;
  --fc-button-active-bg-color: #f3f4f6;
  --fc-button-active-border-color: #d1d5db;
  --fc-today-bg-color: #eff6ff;
  --fc-neutral-bg-color: #f9fafb;
}

:deep(.fc-theme-standard th) {
  padding: 0.75rem 0;
  background-color: #f9fafb;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #6b7280;
}

:deep(.fc-header-toolbar) {
  margin-bottom: 1.5rem !important;
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: #111827;
}

:deep(.fc-button) {
  text-transform: capitalize !important;
  font-weight: 500 !important;
  padding: 0.5rem 1rem !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

:deep(.fc-button:focus) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
}

:deep(.fc-event) {
  border-radius: 0.375rem;
  margin: 2px;
  border-width: 1px;
  cursor: pointer;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}

:deep(.fc-event:hover) {
  transform: translateY(-1px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.fc-daygrid-day-number) {
  padding: 0.5rem !important;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  background-color: #2563eb;
  color: white;
  border-radius: 9999px;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.25rem;
  padding: 0 !important;
}
</style>
