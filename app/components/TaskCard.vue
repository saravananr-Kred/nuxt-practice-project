<script setup lang="ts">
const props = defineProps<{
  items: Task;
}>();
const emit = defineEmits<{
  (e: "delete-task", item: Task): void;
  (e: "mark-completed", item: Task): void;
}>();
</script>

<template>
  <div class="task_card flex items-center justify-between rounded-lg p-[12px]">
    <div class="flex gap-y-3 flex-col">
      <div class="flex item-center justify-start gap-[24px]">
        <h4 class="text-lg font-medium">{{ props.items.name }}</h4>
        <span class="px-3 py-1 text-sm rounded-full status_pill">{{
          props.items.status
        }}</span>
      </div>
      <p>{{ props.items.description }}</p>
      <p>{{ props.items.endDate }}</p>
      <div class="flex items-center justify-center gap-x-4">
        <Button
          @button-click="emit('mark-completed', props.items)"
          :label="props.items.isCompleted ? 'Open' : 'Completed'"
          colorClasses="text-btn_bg-primary hover:text-btn_bg-primary--hover bg-navy-text"
          paddingClasses="p-2"
          additionalClasses="text-sm font-base"
        />

        <div v-if="!props.items.isCompleted">
          <Button
            @button-click="emit('delete-task', props.items)"
            label="Delete"
            colorClasses="text-btn_bg-primary hover:text-btn_bg-primary--hover bg-navy-text"
            paddingClasses="p-2"
            additionalClasses="text-sm font-base"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task_card {
  border: 1px solid $card-border;
  background-color: $card-background;
}
.status_pill {
  color: $card-background-text;
  background-color: #f4f4f4;
}
button.mark_btn {
  background-color: $card-background;
  color: $navy-text;
}
</style>
