<template>
  <div class="relative w-[200px] h-8 max-w-lg">
    <input
      v-model="query"
      class="w-full p-2 pl-4 text-sm h-8 rounded-xl border shadow-sm focus:ring-2"
      placeholder="Search users or tasks..."
    />

    <div
      v-if="results.length > 0"
      class="absolute w-full mt-2 bg-white rounded-xl shadow-2xl border overflow-hidden z-50"
    >
      <div
        v-for="item in results"
        :key="item.type + item.id"
        @click="handleSelect(item)"
        class="p-3 hover:bg-gray-50 cursor-pointer flex items-center border-b last:border-0"
      >
        <template v-if="item.type === 'user'">
          <div
            class="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden mr-3"
          >
            <span class="text-xs">{{ item.title.charAt(0) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-sm text-gray-900">{{
              item.title
            }}</span>
          </div>
          <span
            class="ml-auto text-[10px] uppercase tracking-widest text-gray-400 font-bold"
            >User</span
          >
        </template>

        <template v-else-if="item.type === 'task'">
          <div class="flex flex-col">
            <span class="font-medium text-sm text-gray-800">{{
              item.title
            }}</span>
          </div>
          <span
            class="ml-auto text-[10px] uppercase tracking-widest text-gray-400 font-bold"
            >Task</span
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SearchResult {
  id: number;
  title: string;
  type: "user" | "task";
  status_color?: string;
}

const query = ref("");
const results = ref<SearchResult[]>([]);

const { $api } = useNuxtApp();

const handleSelect = (item: SearchResult) => {
  if (item.type === "task") {
    navigateTo("/Task");
  } else {
    navigateTo(`/users/${item.id}`);
  }

  query.value = "";
  results.value = [];
};

const searchFunction = async (newVal: string) => {
  const data = await $api<any[]>("/api/search-user-task", {
    params: { q: newVal },
  });

  results.value = data.map((item) => ({
    id: item.id,
    title: item.name,
    type: item.type as "user" | "task",
    status_color: item.type === "task" ? "bg-blue-500" : "",
  }));
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(query, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer);

  if (newVal.trim().length === 0) {
    results.value = [];
    return;
  }

  debounceTimer = setTimeout(() => {
    searchFunction(newVal);
  }, 300);
});
</script>
