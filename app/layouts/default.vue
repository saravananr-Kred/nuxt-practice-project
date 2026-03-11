<template>
  <div class="app-shell">
    <!-- Header -->

    <header class="app-header">
      <TopNavbar />
    </header>
    <!-- Main content -->
    <main class="app-main">
      <ErrorBoundary>
        <slot />
      </ErrorBoundary>
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
  background: $background-primary;
}

.app-main {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
