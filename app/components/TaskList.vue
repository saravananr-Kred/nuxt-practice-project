<script setup lang="ts">
const props = defineProps<{
  Tasks: Task[];
  title: string;
}>();

const emit = defineEmits<{
  (e: "delete-task", item: Task): void;
  (e: "mark-completed", item: Task): void;
}>();
</script>

<template>
  <div class="flex gap-[12px] mt-[12px] w-full flex-col">
    <span class="font-semibold w-100 text-center">{{ title }}</span>
    <div class="task_list rounded-lg">
      <div
        class="p-[12px]"
        v-for="(items, index) in props.Tasks"
        :key="'c' + index"
      >
        <TaskCard
          :items="items"
          @delete-task="emit('delete-task', items)"
          @mark-completed="emit('mark-completed', items)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task_list {
  border: 1px solid $input-border;
  min-height: 300px;
  height: max-content;
}
</style>
