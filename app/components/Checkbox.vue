<script setup lang="ts">
const props = defineProps<{
  label?: string
}>()
const emit = defineEmits<{
  (e: 'mark-completed'): void
}>()
const model = defineModel<boolean>()
</script>

<template>
  <label class="flex flex-col items-center gap-2 cursor-pointer select-none">
    <!-- Hidden Native Checkbox -->
    <input type="checkbox" v-model="model" @click="emit('mark-completed')" class="hidden" />

    <span v-if="label" class="text-sm">
      {{ label }}
    </span>

    <!-- Custom Box -->
    <div
      class="w-5 h-5 rounded border check_box flex items-center justify-center transition"
      :class="model ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'"
    >
      <!-- Check Icon -->
      <svg
        v-if="model"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-3 h-3 text-white"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M20.285 6.709a1 1 0 010 1.414l-9.192 9.192a1 1 0 01-1.414 0L3.715 11.35a1 1 0 011.414-1.414l4.243 4.243 8.485-8.485a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </label>
</template>

<style scoped lang="scss">
.check_box {
  border: 1px solid #f4f4f4;
}
</style>
