<template>
  <NuxtErrorBoundary @error="handleError">
    <slot />
    <template #error="{ error }">
      <div class="error-wrapper">
        <div class="error-card">
          <div class="icon">⚠️</div>

          <h1 class="title">Something went wrong</h1>

          <p class="description">
            We encountered an unexpected error. Please try again or refresh the
            page.
          </p>

          <div class="actions">
            <button class="btn primary" @click="reloadPage">Reload Page</button>

            <button class="btn secondary" @click="goHome">Go Home</button>
          </div>

          <details v-if="error">
            <summary>Technical details</summary>
            <pre>{{ error }}</pre>
          </details>
        </div>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
const { showError } = useToastStore();
const handleError = (error: any) => {
  console.error("[Boundary Log]:", error);
  showError("A component error occurred.");
};
const props = defineProps<{
  error?: any;
}>();

const reloadPage = () => {
  window.location.reload();
};

const goHome = () => {
  navigateTo("/");
};
</script>

<style scoped lang="scss">
$background-primary: #f5f5f5;
$background-secondary: #ecf0e9;
$btn-bg-primary: #7bf37b;

.error-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $background-primary;
  padding: 20px;
}

.error-card {
  background: $background-secondary;
  border-radius: 16px;
  padding: 40px 32px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.4s ease;
}

.icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.title {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
}

.description {
  font-size: 15px;
  color: #5f6c72;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 10px;
}

.btn {
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.btn.primary {
  background: $btn-bg-primary;
  color: #1f3d1f;
  font-weight: 600;
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(123, 243, 123, 0.4);
}

.btn.secondary {
  background: white;
  color: #34495e;
}

details {
  margin-top: 15px;
  text-align: left;
  font-size: 12px;
  color: #444;
}

pre {
  white-space: pre-wrap;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
  margin-top: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
