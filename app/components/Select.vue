<script setup lang="ts">
import { ref } from "vue";
import type { SelectProps } from "@/Types/Data.ts";

const props = withDefaults(defineProps<SelectProps>(), {
  layout: "default",
});

const selectRef = ref<HTMLDivElement | null>(null);

const model = defineModel<string | number>(); // v-model

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}

function selectOption(option: Option) {
  model.value = option.value;
  isOpen.value = false;
}

onClickOutside(selectRef, () => {
  isOpen.value = false;
});
</script>

<template>
  <div
    :class="[
      {
        'grid grid-cols-[1fr_2fr]': layout === 'default',
        'grid grid-cols-[1fr]': layout === 'form',
      },
      'relative min-h-9 w-full items-center',
    ]"
  >
    <label
      v-if="label"
      v-show="layout !== 'auth'"
      class="block mb-1 font-medium text-sm"
    >
      {{ label }}
    </label>

    <!-- Selected Display -->
    <div
      :class="[
        {
          'ml-4': layout === 'default',
          'mt-1': layout === 'form',
        },
        'border rounded-md h-9 custom_select p-2 cursor-pointer bg-white flex justify-between items-center',
      ]"
      @click="toggle"
    >
      <span>
        {{ options.find((o) => o.value === model)?.label || "Select option" }}
      </span>
      <span>▼</span>
    </div>
    <div></div>
    <p class="text-red-500 ml-4 font-medium text-sm">{{ error }}</p>
    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute left-0 right-0 mt-1 border rounded-md bg-white shadow-md z-10"
      ref="selectRef"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom_select {
  border: 1px solid $input-border;
}
.custom_select:hover {
  box-shadow: 4px 4px 8px 1px $input-border;
}
.custom_select:focus {
  outline: none;
}
</style>
