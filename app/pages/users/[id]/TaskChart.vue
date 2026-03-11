<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  type ChartOptions,
  type ChartData,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

definePageMeta({
  layout: "side-bar",
});

const route = useRoute();

const statusConfig = {
  Open: { color: "#3b82f6", icon: "📋" },
  "In Progress": { color: "#f59e0b", icon: "⚙️" },
  Completed: { color: "#10b981", icon: "✅" },
  "On Hold": { color: "#6b7280", icon: "⏸️" },
};

const timeOut = async (delay: number) => {
  return new Promise((r) => setTimeout(r, delay));
};

const {
  data: tasks,
  pending,
  error,
} = await useAsyncData<TaskData[]>(
  `task-report-${route.params.id}`,
  async () => {
    const { $api } = useNuxtApp();

    await timeOut(1500);
    const res = await $api<{ data: TaskData[] }>(
      `/api/users/${route.params.id}/task`,
    );

    console.log(res, "data");

    return res.data;
  },
  {
    lazy: true,
  },
);

const statusCounts = computed(() => {
  const counts = { Open: 0, "In Progress": 0, Completed: 0, "On Hold": 0 };
  let data = tasks.value || [];
  console.log(data, "data");

  data.forEach((task: TaskData) => {
    if (counts.hasOwnProperty(task.status)) {
      counts[task.status as keyof typeof counts]++;
    }
  });
  return counts;
});

const chartData = computed<ChartData<"doughnut">>(() => ({
  labels: Object.keys(statusConfig),
  datasets: [
    {
      data: Object.values(statusCounts.value),
      backgroundColor: Object.values(statusConfig).map((c) => c.color),
      borderWidth: 0,
      hoverOffset: 10,
      cutout: "75%",
    },
  ],
}));

const chartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
};
console.log(pending, "pending");
</script>

<template>
  <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <h3 class="text-lg font-bold text-gray-900 mb-6">Task Distribution</h3>

    <Transition name="fade" mode="out-in">
      <div v-if="pending" key="pending">
        <div class="relative h-64 w-full mb-6">
          <div class="flex items-center justify-center h-full">
            <div class="animate-pulse bg-gray-300 rounded-full h-48 w-48"></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(config, status) in statusConfig"
            :key="status"
            class="flex items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100"
          >
            <span class="mr-2 text-lg">{{ config.icon }}</span>
            <div class="flex flex-col">
              <span
                class="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1"
              >
                {{ status }}
              </span>
              <span
                class="text-sm font-bold text-gray-900 animate-pulse bg-gray-300 rounded-full leading-none h-6 w-6"
              >
              </span>
            </div>
          </div>
        </div>
      </div>
      <div key="content" v-else-if="!pending">
        <div class="relative h-64 w-full mb-6">
          <!-- Loading skeleton -->

          <!-- Chart -->
          <Doughnut
            v-if="(tasks || []).length > 0"
            :data="chartData"
            :options="chartOptions"
          />

          <!-- Empty state -->
          <div
            v-else
            class="flex items-center justify-center h-full text-gray-400"
          >
            No tasks available
          </div>

          <!-- Center text -->
          <div
            v-if="!pending && (tasks || []).length > 0"
            class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <span class="text-3xl font-bold text-gray-900">
              {{ (tasks || []).length }}
            </span>
            <span class="text-xs text-gray-400 uppercase font-semibold">
              Total Tasks
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(config, status) in statusConfig"
            :key="status"
            class="flex items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100"
          >
            <span class="mr-2 text-lg">{{ config.icon }}</span>
            <div class="flex flex-col">
              <span
                class="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1"
              >
                {{ status }}
              </span>
              <span class="text-sm font-bold text-gray-900 leading-none">
                {{ statusCounts[status as keyof typeof statusCounts] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
