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
      class="ml-4"
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
input:focus {
  outline: none;
}
.v-input {
  height: 36px;
}
</style>
