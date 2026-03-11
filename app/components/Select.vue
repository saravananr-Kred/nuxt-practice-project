<script setup lang="ts">
import type { SelectProps } from "@/Types/Data.ts";

const props = withDefaults(defineProps<SelectProps>(), {
  layout: "default",
  placeholder: "Select a value",
  variant: "outlined",
  density: "default",
  height: "36px",
});

const emits = defineEmits(["handle-update"]);
const model = defineModel<string | number>(); // v-model

function handleStateChange() {
  emits("handle-update", model.value);
}
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
      class="block font-medium text-sm"
    >
      {{ label }}
    </label>

    <!-- Selected Display -->
    <v-select
      v-model="model"
      :items="options"
      item-title="label"
      item-value="value"
      :placeholder="placeholder"
      :variant="variant"
      :density="density"
      hide-details
      :style="{ '--v-select-height': height }"
      @update:model-value="handleStateChange()"
      :menu-props="{ contentClass: 'custom-dropdown-menu' }"
      class="custom-v-select"
    ></v-select>
    <span v-if="error && !model" class="text-red-500 text-xs"
      >Please select state</span
    >
  </div>
</template>

<style scoped lang="scss">
:deep(.custom-v-select .v-field) {
  border-radius: 8px !important;
  font-size: 14px;
  color: #010145;
  transition: all 0.2s ease;
}

:deep(.custom-v-select:hover .v-field) {
  box-shadow: 4px 4px 8px 1px $input-border;
}

:deep(.custom-v-select .v-outline__separator),
:deep(.custom-v-select .v-field__outline) {
  --v-field-border-opacity: 1;
  color: #c0e5c9 !important;
}
:deep(.custom-v-select .v-field--error .v-outline__separator),
:deep(.custom-v-select .v-field--error .v-field__outline) {
  --v-field-border-opacity: 1;
  color: red !important;
}
:deep(.custom-v-select .v-field--focused) {
  background-color: #ffffff !important;
  box-shadow: 0 0 0 4px rgba(123, 243, 123, 0.15);
}
:deep(.custom-v-select .v-field--focused .v-field__outline) {
  color: $input-border !important;
}

/* Dropdown (Options) Styling */
:deep(.custom-dropdown-menu) {
  background-color: #ffffff !important;
  border-radius: 12px !important;
  border: 1px solid #c0e5c9 !important;
  margin-top: 8px;
}

:deep(.custom-dropdown-menu .v-list-item--active) {
  background-color: #f5f5f5 !important;
  color: #010145 !important;
}
:deep(.custom-v-select .v-field),
:deep(.custom-v-select .v-field__field) {
  height: var(--v-select-height);
  min-height: var(--v-select-height);
}

:deep(.custom-v-select .v-field__input) {
  min-height: var(--v-select-height);
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 12px;
}
</style>
