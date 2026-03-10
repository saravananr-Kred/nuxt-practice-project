<template>
  <!-- Left: Logo + Title -->
  <NuxtLink to="/" class="header-brand">
    <div class="brand-icon">
      <IconDocumentation />
    </div>
    <span class="brand-title">Nuxt<span class="brand-accent">Learn</span></span>
  </NuxtLink>

  <!-- Center: Navbar -->
  <Navbar />

  <GlobalSearch />
  <!-- Right: Profile dropdown -->
  <Profile />
</template>

<style scoped lang="scss">
.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  min-width: 170px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, $btn-bg-primary, $btn-bg-primary-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba($btn-bg-primary, 0.3);

  :deep(svg) {
    width: 20px;
    height: 20px;
    fill: $navy-text;
  }
}

.brand-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: $navy-text;
  letter-spacing: -0.02em;
}

.brand-accent {
  color: $btn-bg-primary-hover;
}
</style>
