<script setup>
import { ref, onMounted, watch } from "vue";

const ToastStore = useToastStore();
const { show, message, type, duration } = storeToRefs(ToastStore);
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

const closeToast = () => {
  ToastStore.show = false;
};

const showProgress = ref(false);
watch(show, (newVal) => {
  if (newVal) {
    // Reset and start draining
    showProgress.value = false;
    setTimeout(() => {
      showProgress.value = true;
    }, 10);
  } else {
    showProgress.value = false;
  }
});
</script>

<template>
  <Teleport to="body" v-if="isMounted">
    <Transition name="toast-move">
      <div
        v-if="show"
        class="fixed top-6 right-6 z-[10000] flex items-center min-w-[320px] max-w-md overflow-hidden rounded-xl border border-white/20 bg-white/70 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:bg-gray-900/70"
      >
        <!-- Icon section -->
        <div class="mr-4 flex-shrink-0">
          <div
            v-if="type === 'success'"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
          <div
            v-else
            class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-grow">
          <h3
            class="text-sm font-bold text-gray-900 dark:text-white capitalize"
          >
            {{ type }}
          </h3>
          <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
            {{ message }}
          </p>
        </div>

        <!-- Close button -->
        <button
          @click="closeToast"
          class="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Progress bar -->
        <div
          class="absolute bottom-0 left-0 h-1 w-full bg-gray-100/50 dark:bg-gray-800/50"
        >
          <div
            class="h-full bg-gradient-to-r from-transparent via-white/30 to-white/50 transition-all ease-linear"
            :class="[
              {
                'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]':
                  type === 'success',
              },
              {
                'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]':
                  type === 'error',
              },
            ]"
            :style="{
              width: showProgress ? '0%' : '100%',
              transitionDuration: duration + 'ms',
            }"
          ></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-move-enter-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-move-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-move-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-move-leave-to {
  opacity: 0;
  transform: translateX(50%) scale(0.9);
}

/* Ensure glassmorphism looks good even without Tailwind blur support */
@supports not (backdrop-filter: blur(1px)) {
  .backdrop-blur-xl {
    background-color: rgba(255, 255, 255, 0.95);
  }
}
</style>
