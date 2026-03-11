<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    error?: boolean;
    errorMessage?: string;
    height?: string;
    density?: "default" | "comfortable" | "compact";
    layout?: string;
    name?: string;
    onBlur?: (e: Event) => void;
    onChange?: (e: Event) => void;
  }>(),
  {
    height: "36px",
    density: "default",
    layout: "default",
  },
);
const model = defineModel<string>();

const activeMenu = ref(false);

const toYMD = (date: any) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const formattedDate = computed(() => {
  if (!model.value) return "";
  return new Date(model.value).toLocaleDateString("en-GB");
});

const updateDate = (date: any) => {
  model.value = toYMD(date);
  activeMenu.value = false;
};
</script>

<template>
  <div
    :class="[
      {
        'grid grid-cols-[1fr_2fr]': layout === 'default',
        'grid grid-cols-[1fr]': layout === 'form',
      },
      'min-h-9 w-full items-center',
    ]"
  >
    <label
      v-show="layout === 'default' || layout === 'form'"
      class="label-style text-sm"
      >{{ label }}</label
    >

    <v-menu
      :close-on-content-click="false"
      :model-value="activeMenu"
      @update:model-value="(val) => (activeMenu = val ? true : false)"
    >
      <template v-slot:activator="{ props }">
        <v-text-field
          :model-value="formattedDate"
          v-bind="props"
          readonly
          format="dd-MM-yyyy"
          variant="outlined"
          :density="density"
          class="custom-v-select"
          prepend-inner-icon="mdi-calendar"
          :style="{ '--v-text-field-details-height': height }"
          hide-details
          :error="error"
        ></v-text-field>
        <span v-if="error && errorMessage" class="text-red-500 text-xs">{{
          errorMessage
        }}</span>
      </template>

      <v-date-picker
        :model-value="model"
        @update:model-value="updateDate"
        color="#7bf37b"
        elevation="10"
      ></v-date-picker>
    </v-menu>
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
  display: $input-border !important;
}
:deep(.custom-v-select .v-field),
:deep(.custom-v-select .v-field__field) {
  height: var(--v-text-field-details-height);
  min-height: var(--v-text-field-details-height);
}
:deep(.custom-v-select .v-field__input) {
  min-height: var(--v-text-field-details-height);
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 12px;
}
</style>
