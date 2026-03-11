<script setup lang="ts">
import { Icons } from "~/assets/icons";
const { can } = usePermis();

const props = withDefaults(
  defineProps<{
    task: TaskData;
    mode?: "kanban" | "display";
  }>(),
  {
    mode: "kanban",
  },
);

defineEmits<{
  (e: "edit-task", id: number): void;
  (e: "delete-task", id: number): void;
  (e: "view-task", id: number): void;
}>();

const priorityColor: Record<string, string> = {
  "Very High": "bg-red-500",
  High: "bg-orange-400",
  Medium: "bg-yellow-400",
  Low: "bg-emerald-400",
};

const priorityClass = computed(
  () => priorityColor[props.task.priority] || "bg-gray-400",
);

// Generate initials from assigned user name
const userInitials = computed(() => {
  const name = props.task.assigned_to_user_name;
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const formattedDate = computed(() => {
  if (!props.task.end_date) return "—";
  return new Date(props.task.end_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});
</script>

<template>
  <div
    class="task-card"
    @click="$emit('view-task', task.id)"
    style="cursor: pointer"
  >
    <div class="flex items-start justify-between gap-2 mb-2">
      <h4 class="font-semibold text-gray-800 text-sm leading-snug break-words">
        {{ task.name }}
      </h4>
      <span
        :class="priorityClass"
        class="shrink-0 text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase"
      >
        {{ task.priority }}
      </span>
    </div>

    <p
      v-if="task.notes"
      class="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed"
    >
      {{ task.notes }}
    </p>

    <div
      class="flex items-center justify-between mt-auto pt-2 border-t border-gray-100"
    >
      <span class="flex items-center gap-1 text-[11px] text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3.5 h-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
            clip-rule="evenodd"
          />
        </svg>
        {{ formattedDate }}
      </span>

      <div class="flex items-center gap-2">
        <div class="flex gap-1 relative" v-if="task.fileCount > 0">
          <img :src="Icons.Document" class="w-5 h-5" />
          <span
            class="absolute -top-2 -right-2 bg-red-500 rounded-full text-[10px] text-white size-4 flex items-center justify-center"
            >{{ task.fileCount }}</span
          >
        </div>
        <div
          v-if="task.assigned_to"
          class="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-[10px] font-bold"
          :title="task.assigned_to_user_name || 'Assigned'"
        >
          {{ userInitials }}
        </div>

        <EditIcon
          v-if="can('edit-tasks')"
          v-show="mode"
          class="w-5 h-5 cursor-pointer text-gray-400 hover:text-teal-600 transition"
          @click.stop="$emit('edit-task', task.id)"
        />
        <DeleteIcon
          v-if="can('delete-tasks')"
          v-show="mode"
          class="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-500 transition"
          @click.stop="$emit('delete-task', task.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task-card {
  background: white;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}
</style>
