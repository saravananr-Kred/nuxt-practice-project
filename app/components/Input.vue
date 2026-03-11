<script setup lang="ts">
import { computed } from "vue";
import type { InputProps } from "@/Types/Data.ts";
import { Icons } from "@/assets/icons";

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  layout: "default",
  error: "",
});
const value = defineModel<string | number | undefined>();

const isPasswordField = computed(() =>
  props.label?.toLowerCase().includes("password"),
);

const showPassword = ref(false);

const inputType = computed(() => {
  if (isPasswordField.value) {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

let errorArray = computed(() => {
  if (!props.error) return [];
  if (typeof props.error === "string") {
    return props.error.trim().length !== 0 ? [props.error] : [];
  }

  if (Array.isArray(props.error)) {
    return props.error.filter(
      (msg) => typeof msg === "string" && msg.trim() !== "",
    );
  }

  return [];
});
</script>

<template>
  <div
    :class="[
      { 'grid-cols-[1fr] w-full grid items-center': layout === 'form' },
      { 'grid-cols-[1fr_2fr] w-full grid items-center': layout === 'default' },
    ]"
  >
    <label
      v-show="['default', 'form'].includes(layout)"
      for="input-field"
      class="text-sm"
      >{{ label }}</label
    >
    <div class="relative flex items-center">
      <input
        :id="label"
        :type="inputType"
        class="rounded-lg h-9 p-[4px] text-sm w-full"
        v-model="value"
        v-bind="$attrs"
      />

      <button
        v-if="isPasswordField"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-3 text-gray-500 hover:text-indigo-600 focus:outline-none"
      >
        <span v-if="showPassword"
          ><img
            :src="Icons.eyeClose"
            class="w-[18px] h-[18px]"
            alt="eye_closed"
        /></span>
        <span v-else>👁️‍🗨️</span>
      </button>
    </div>
    <div></div>
    <div v-if="errorArray.length > 0" class="ml-4 grow">
      <p
        v-for="(msg, ind) in errorArray"
        :key="ind"
        class="text-red-500 mt-1 text-xs font-medium"
      >
        {{ msg }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
input {
  border: 1px solid $input-border;
  padding-left: 12px;
  font-size: 14px;
}
input:focus {
  outline: none;
}
input:hover {
  box-shadow: 4px 4px 8px 1px $input-border;
}
input::placeholder {
  font-size: 14px;
}
</style>
