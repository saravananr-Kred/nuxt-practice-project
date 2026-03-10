<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    needClose?: boolean;
    title: string;
  }>(),
  {
    needClose: true,
  },
);
const emit = defineEmits<{ (e: "close"): void }>();
</script>

<template>
  <div>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
          <Transition name="slide-left">
            <div class="modal-content rounded-xl shadow-lg" @click.stop>
              <header
                class="flex items-center justify-between py-[16px] px-4 border-b"
              >
                <h4 class="font-semibold">{{ title }}</h4>
                <svg
                  v-if="needClose"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-black-500 cursor-pointer"
                  viewBox="0 0 640 640"
                  @click.stop="$emit('close')"
                >
                  <path
                    d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"
                  />
                </svg>
              </header>
              <main class="p-4">
                <slot></slot>
              </main>
              <footer class="mt-4 border-t p-4">
                <slot name="footer"></slot>
              </footer>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.modal-overlay {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 50;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.modal-content {
  position: absolute;
  right: 20px;
  top: 40px;
  width: 500px;
  height: max-content;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}
main {
  max-height: 420px;
  overflow-y: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}
</style>
