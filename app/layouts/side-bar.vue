<script setup lang="ts">
import { Icons } from "~/assets/icons";

const route = useRoute();
const userId = computed(() => route.params.id);

const navLinks = computed(() => [
  {
    name: "Dashboard",
    path: `/users/${userId.value}`,
    icon: "📊",
    isEmoji: true,
  },
  {
    name: "License",
    path: `/users/${userId.value}/license`,
    icon: Icons.License,
    isEmoji: false,
  },
  {
    name: "Task Report",
    path: `/users/${userId.value}/TaskChart`,
    icon: Icons.barChart,
    isEmoji: false,
  },
]);
</script>

<template>
  <div class="flex flex-col h-screen">
    <header class="app-header">
      <TopNavbar />
    </header>
    <div class="sidebar-container flex" style="background-color: #f5f5f5">
      <aside
        class="w-72 flex-shrink-0 h-full sticky top-0 transition-all duration-300 shadow-xl"
        style="
          background-color: #ecf0e9;
          border-right: 1px solid #c0e5c9;
          box-shadow: 4px 0px 15px -3px #4c4c6e29;
        "
      >
        <div class="p-8">
          <h2 class="text-2xl font-bold tracking-tight" style="color: #010145">
            User <span style="color: #04a004">Detail</span>
          </h2>
        </div>

        <nav class="mt-2 px-4 space-y-3">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200"
            style="color: #010145"
            active-class="active-link"
          >
            <div
              class="flex items-center justify-center w-8 h-8 transition-transform group-hover:scale-110"
            >
              <template v-if="link.isEmoji">
                <span class="text-xl">{{ link.icon }}</span>
              </template>
              <template v-else>
                <img
                  :src="link.icon"
                  class="h-6 w-6 object-contain icon-filter"
                />
              </template>
            </div>

            <span class="tracking-wide">{{ link.name }}</span>
          </NuxtLink>
        </nav>
      </aside>

      <main class="flex-1 overflow-y-auto">
        <div class="p-10">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.active-link {
  background-color: #7bf37b !important;
  color: #f1f8f8 !important;
  box-shadow: 0 10px 15px -3px rgba(123, 243, 123, 0.4);
  transform: translateX(4px);
}
.sidebar-container {
  height: calc(100vh - 64px);
}
.active-link:hover {
  background-color: #26d326c9 !important;
}
nav a:not(.active-link):hover {
  background-color: #fafafa;
  color: #04a004;
}
</style>
