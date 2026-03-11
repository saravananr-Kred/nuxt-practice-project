<template>
  <div
    class="flex w-screen min-h-screen overflow-y-auto overflow-x-hidden items-center justify-center bg-gradient-to-br from-green-500 to-navy-text"
  >
    <ErrorBoundary>
      <slot />
    </ErrorBoundary>
    <Toast />
  </div>
</template>

<script lang="ts" setup>
import ErrorBoundary from "@/components/ErrorBoundary.vue";
</script>

<style scoped lang="scss">
div.flex.w-screen.h-screen {
  background-color: $background-primary;
}
</style>
