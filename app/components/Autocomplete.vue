<script lang="ts" setup>
const props = defineProps<{
  label: string;
  options?: string[];
  items?: Option[];
  layout: string;
  error?: string;
  loading?: boolean;
  searchFn?: (search: string) => void;
}>();
const emit = defineEmits<{
  (e: "search", search: string): void;
}>();
const model = defineModel<number | null>();
</script>

<template>
  <div
    :class="[
      {
        'grid grid-cols-[1fr_2fr]': layout === 'default',
        'grid grid-cols-[1fr]': layout === 'form',
      },
      'w-full items-center h-9',
    ]"
  >
    <label :for="label" class="text-sm">{{ label }}</label>
    <v-autocomplete
      density="compact"
      :id="label"
      v-model="model"
      :items="options?.length ? options : items"
      item-title="label"
      item-value="value"
      variant="outlined"
      :loading="loading"
      :error="!!error"
      :error-messages="error"
      @update:search="(val) => emit('search', val)"
    />
  </div>
</template>

<style scoped lang="scss">
.v-input__control {
  border: 1px solid $input-border;
}
.v-input__control:hover {
  box-shadow: 4px 4px 8px 1px $input-border;
}
.v-input.v-autocomplete {
  height: 36px !important;
}
:deep(.v-autocomplete .v-field) {
  border: 1px solid $input-border;
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.v-autocomplete:hover .v-field) {
  box-shadow: 4px 4px 8px 1px $input-border;
}
:deep(.v-autocomplete) {
  --v-input-control-height: 36px;

  .v-field {
    min-height: 36px !important;
    height: 36px !important;
    align-items: center;
    border-radius: 8px;
    transition: all 0.2s ease;

    .v-field__input {
      min-height: 36px !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      height: 36px !important;
    }

    .v-field__append-inner,
    .v-field__clearable {
      padding-top: 0;
      align-items: center;
      height: 36px;
    }
  }
}

:deep(.v-autocomplete.v-input .v-field__input) {
  display: flex;
  align-items: center;
}

:deep(.v-autocomplete .v-field__outline) {
  color: $input-border !important;
}
</style>
