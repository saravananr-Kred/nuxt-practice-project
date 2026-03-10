<template>
  <ErrorBoundary :error="error" />
</template>

<script setup>
import ErrorBoundary from "@/components/ErrorBoundary.vue";
defineProps({
  error: Object,
});
</script>
