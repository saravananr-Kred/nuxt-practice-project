<script setup lang="ts">
let emit = defineEmits<{ (e: "button-click"): void }>();

interface props {
  colorClasses?: string;
  paddingClasses?: string;
  radiusClasses?: string;
  additionalClasses?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
}

const props = withDefaults(defineProps<props>(), {
  label: "Submit",
  colorClasses:
    "bg-btn_bg-primary transition delay-200 ease-in text-navy-text hover:shadow-[2px_6px_6px_-2px_#4c4c6e69] ",
  paddingClasses: "px-4 py-2",
  radiusClasses: "rounded-lg",
  additionalClasses: "",
  type: "button",
  disabled: false,
});

function addTask() {
  emit("button-click");
}
</script>

<template>
  <button
    :class="[
      props.colorClasses,
      props.paddingClasses,
      props.radiusClasses,
      props.additionalClasses,
      ' cursor-pointer',
    ]"
    v-on="props.type !== 'submit' ? { click: addTask } : {}"
    :type="props.type"
    v-bind="$attrs"
    :disabled="props.disabled"
  >
    <slot>Submit</slot>
  </button>
</template>
<style scoped lang="scss">
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
