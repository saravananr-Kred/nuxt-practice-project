<template>
  <div
    class="flex items-center justify-center h-screen w-screen absolute inset-0"
  >
    <svg
      v-if="loading"
      class="mr-3 size-10 animate-spin text-blue-500"
      viewBox="0 0 48 48"
    >
      <circle
        class="opacity-15"
        cx="24"
        cy="24"
        r="20"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-100"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
