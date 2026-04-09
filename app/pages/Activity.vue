<script setup lang="ts">
import { storeToRefs } from "pinia";
import { debounce } from "@/utils/debounce";

const activityStore = useActivityStore();
const { search, filterModule, filterAction, activities, loadingActivities } =
  storeToRefs(activityStore);

useSeo("Activity Logs", "Display application activity logs");

const headers = ref([
  { label: "User Name", key: "user_name" },
  { label: "IP Address", key: "ip_address" },
  { label: "Module", key: "module" },
  { label: "Action", key: "action" },
  { label: "Time", key: "created_at" },
]);

const route = useRoute();
const currentPage = ref<number>(1);
const totalActivities = ref<number>(0);
const perPage = ref<number>(10);
const lastPage = ref<number>(1);
const sortBy = ref<string>("created_at");
const sortOrder = ref<"asc" | "desc">("desc");

const moduleOptions = [
  { label: "Module Filter", value: "" },
  { label: "Auth", value: "Auth" },
  { label: "User", value: "User" },
  { label: "Task", value: "Task" },
  { label: "License", value: "License" },
];

const actionOptions = [
  { label: "Action Filter", value: "" },
  { label: "Login", value: "Login" },
  { label: "Logout", value: "Logout" },
  { label: "Create", value: "Create" },
  { label: "Update", value: "Update" },
  { label: "Delete", value: "Delete" },
];

function handleSort(column: string) {
  if (sortBy.value === column) {
    sortBy.value = column;
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = column;
    sortOrder.value = "asc";
  }
  currentPage.value = 1;
}

// Fetch activities using our mocked store method
const fetchActivitiesAsync = async () => {
  try {
    const response = await activityStore.fetchActivitiesMock({
      page: currentPage.value,
      limit: perPage.value,
      search: search.value,
      module: filterModule.value,
      action: filterAction.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    });
    
    activityStore.activities = response.data;
    lastPage.value = response.last_page;
    totalActivities.value = response.total;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchActivitiesAsync();
});

watch(
  [currentPage, perPage, sortBy, sortOrder, filterModule, filterAction],
  () => {
    fetchActivitiesAsync();
  }
);

const debouncedRefresh = debounce(() => fetchActivitiesAsync(), 500);

watch([search], (value) => {
  const [searchVal] = value;
  if (!searchVal) {
    fetchActivitiesAsync();
  } else {
    debouncedRefresh();
  }
});

function formatTime(isoString: string) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getActionColor(action: string) {
  switch (action) {
    case "Create":
      return "bg-green-100 text-green-800 ring-green-600/20";
    case "Update":
      return "bg-blue-100 text-blue-800 ring-blue-600/20";
    case "Delete":
      return "bg-red-100 text-red-800 ring-red-600/20";
    case "Login":
    case "Logout":
      return "bg-gray-100 text-gray-800 ring-gray-600/20";
    default:
      return "bg-gray-100 text-gray-800 ring-gray-600/20";
  }
}

// Since we are overriding some styling for the generic Table component
const tableDataFormatted = computed(() => {
  return activities.value.map((activity) => {
    return {
      ...activity,
      // Adding `name` field temporarily so the generic Table component renders the avatar automatically if we look at `Table.vue` line 93 logic
      name: activity.user_name,
      created_at_formatted: formatTime(activity.created_at),
    };
  });
});
</script>

<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-semibold text-2xl text-gray-900">Activity Logs</h1>
        <p class="text-sm text-gray-500 mt-1">Track all system activities including logins, user management, and task updates.</p>
      </div>
    </div>
    <hr class="border-1 border-[#c0e5c9] mt-2" />
    
    <!-- Filters -->
    <div class="flex items-center flex-wrap gap-4 my-4">
      <div class="w-full sm:flex-1 sm:min-w-[200px]">
        <Input
          label="Search Logs"
          placeholder="Search by user name, module, action or IP..."
          type="text"
          v-model="search"
        />
      </div>

      <div class="w-full sm:w-48">
        <Select
          label="Module"
          :options="moduleOptions"
          v-model="filterModule"
          layout="auth"
        />
      </div>

      <div class="w-full sm:w-48">
        <Select
          v-model="filterAction"
          :options="actionOptions"
          label="Action"
          layout="auth"
        />
      </div>
    </div>

    <!-- Table content replacement -->
    <div class="w-full bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-xl overflow-hidden mt-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="(header, index) in headers"
                :key="index"
                class="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
                @click="handleSort(header.key)"
              >
                <div class="flex items-center gap-2">
                  {{ header.label }}
                  <div
                    class="flex transition-opacity duration-200"
                    :class="[
                      sortBy === header.key
                        ? 'opacity-100 text-indigo-600'
                        : 'opacity-0 group-hover:opacity-100 text-gray-400',
                    ]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5 transition-transform duration-200 text-indigo-600"
                      :class="{ 'rotate-180': sortBy === header.key && sortOrder === 'desc' }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 bg-white">
            <template v-if="loadingActivities">
              <tr v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
                <td v-for="j in headers.length" :key="'cell-' + j" class="px-4 py-4 whitespace-nowrap">
                  <div class="h-4 bg-gray-100 rounded" :class="j === 1 ? 'w-3/4' : 'w-1/2'"></div>
                </td>
              </tr>
            </template>

            <template v-else-if="tableDataFormatted.length > 0">
              <tr
                v-for="(row, rowIndex) in tableDataFormatted"
                :key="rowIndex"
                class="hover:bg-gray-50 transition-colors duration-150 group"
              >
                <!-- User Name Column with Avatar -->
                <td class="px-4 py-4 text-gray-700 whitespace-nowrap">
                  <div class="flex items-center justify-start gap-x-3">
                    <NuxtImg
                      v-if="row.profile_image"
                      :src="row.profile_image"
                      class="h-8 w-8 rounded-full object-cover shadow-sm"
                    />
                    <div v-else class="h-8 w-8 rounded-full bg-gradient-to-br from-[#7bf37b] to-[#26d326] flex items-center justify-center shadow-sm">
                      <span class="text-[#010145] font-bold text-sm">{{ row.user_name?.charAt(0) || 'U' }}</span>
                    </div>
                    <span class="font-medium text-gray-900">{{ row.user_name }}</span>
                  </div>
                </td>
                
                <!-- IP Address -->
                <td class="px-4 py-4 text-gray-600 whitespace-nowrap font-mono text-xs">
                  {{ row.ip_address }}
                </td>

                <!-- Module -->
                <td class="px-4 py-4 text-gray-700 whitespace-nowrap">
                  <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    {{ row.module }}
                  </span>
                </td>

                <!-- Action Badge -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="getActionColor(row.action)"
                  >
                    {{ row.action }}
                  </span>
                </td>

                <!-- Time -->
                <td class="px-4 py-4 text-gray-500 whitespace-nowrap text-sm">
                  {{ row.created_at_formatted }}
                </td>
              </tr>
            </template>
            
            <template v-else>
              <tr>
                <td :colspan="headers.length" class="px-4 py-12">
                  <div class="flex flex-col items-center justify-center text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-semibold text-gray-900">No activities found</h3>
                    <p class="mt-1 text-sm text-gray-500">We couldn't find any logs matching your current filters.</p>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="lastPage > 1"
      class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl ring-1 ring-gray-200 shadow-sm mt-4"
    >
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing page
            <span class="font-medium text-gray-900">{{ currentPage }}</span> of
            <span class="font-medium text-gray-900">{{ lastPage }}</span>
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              :disabled="currentPage === lastPage"
              @click="currentPage++"
              class="relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
