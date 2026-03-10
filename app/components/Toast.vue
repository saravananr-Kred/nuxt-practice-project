<script setup>
const Toast = useToastStore();
const { show, message, type } = storeToRefs(Toast);
</script>
<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="show"
        :class="[
          {
            'text-green-500 border border-green-500': type === 'success',
            'text-red-500 border border-red-500': type === 'error',
          },
          'fixed top-5 bg-[#f4f4f4] right-5 px-4 py-2 rounded toast',
        ]"
      >
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>
