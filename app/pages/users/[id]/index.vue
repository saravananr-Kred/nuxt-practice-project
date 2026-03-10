<script setup lang="ts">
import { storeToRefs } from "pinia";

definePageMeta({
  title: "User Dashboard",
  description: "Dashboard for user details and tasks",
  layout: "side-bar",
});

// Assuming you have these auto-imported or defined elsewhere
const config = useRuntimeConfig();
const publicPath = config.public.fileUrl;

const route = useRoute();
const userStore = useUsersStore();
const { singleUser } = storeToRefs(userStore);

const { data, pending, error } = await useAsyncData(
  `user-profile-${route.params.id}`,
  async () => {
    const { $api } = useNuxtApp();

    const [userData, tasks] = await Promise.all([
      $api<AllUsersDetailsData>(`/api/user-details/${route.params.id}`),
      $api<{ data: TaskData[] }>(`/api/users/${route.params.id}/task`),
    ]);

    userStore.singleUser = userData;

    return {
      user: userData,
      tasks: tasks,
    };
  },
);

const userTask = computed(() => data.value?.tasks.data || []);
const completedTasksCount = computed(
  () => userTask.value.filter((task) => task.status === "Completed").length,
);

if (error.value && !singleUser.value) {
  throw createError({ statusCode: 404, statusMessage: "User Not Found" });
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <div class="mb-8">
        <NuxtLink
          to="/"
          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-2"
        >
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Users
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
          User Dashboard
        </h1>
      </div>

      <div
        v-if="pending"
        class="flex flex-col items-center justify-center py-20"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"
        ></div>
        <p class="text-gray-500 font-medium animate-pulse">
          Loading user profile...
        </p>
      </div>

      <div v-else-if="singleUser" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <div
            class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center sticky top-8"
          >
            <div class="relative mb-5">
              <img
                v-if="singleUser.profile_image"
                :src="`${publicPath}${singleUser.profile_image}`"
                alt="Profile photo"
                class="w-28 h-28 rounded-full object-cover ring-4 ring-gray-50 shadow-sm"
              />
              <div
                v-else
                class="w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 ring-4 ring-gray-50 shadow-sm"
              >
                <span class="text-4xl font-bold text-blue-700">
                  {{ singleUser.name.charAt(0).toUpperCase() }}
                </span>
              </div>

              <span
                class="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"
              ></span>
            </div>

            <h2 class="text-xl font-bold text-gray-900">
              {{ singleUser.name }}
            </h2>
            <p class="text-sm text-gray-500 mb-4">{{ singleUser.email }}</p>

            <div class="flex flex-wrap justify-center gap-2 mb-8">
              <span
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wide"
              >
                {{ singleUser.role === 1 ? "Admin" : "User" }}
              </span>
              <span
                class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide"
              >
                {{ singleUser.gender }}
              </span>
            </div>

            <div
              class="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-6"
            >
              <div class="flex flex-col">
                <span
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                  >Assigned</span
                >
                <span class="text-2xl font-bold text-gray-900">{{
                  userTask.length
                }}</span>
              </div>
              <div class="flex flex-col border-l border-gray-100">
                <span
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                  >Completed</span
                >
                <span class="text-2xl font-bold text-emerald-600">{{
                  completedTasksCount
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-8">
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 class="text-lg font-bold text-gray-900 mb-5">
              Personal Information
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-xl">
                <p
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1"
                >
                  Phone Number
                </p>
                <p class="font-medium text-gray-900">
                  {{ singleUser.phone || "Not provided" }}
                </p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1"
                >
                  Age
                </p>
                <p class="font-medium text-gray-900">
                  {{ singleUser.age ? `${singleUser.age} years old` : "-" }}
                </p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1"
                >
                  Date of Birth
                </p>
                <p class="font-medium text-gray-900">
                  {{ singleUser.dob || "-" }}
                </p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1"
                >
                  User ID
                </p>
                <p class="font-mono font-medium text-gray-900">
                  #{{ singleUser.id }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-900">User Tasks</h3>
              <span
                v-if="userTask.length > 0"
                class="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
              >
                {{ userTask.length }} Total
              </span>
            </div>

            <div
              v-if="userTask.length > 0"
              class="grid grid-cols-2 border-1 border-gray-600 border-dashed rounded-2xl p-4 gap-4"
            >
              <TaskKanbanCard
                v-for="task in userTask"
                :key="task.id"
                :task="task"
                @edit-task="() => {}"
                @delete-task="() => {}"
                mode="display"
              />
            </div>

            <div
              v-else
              class="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-12 px-6 flex flex-col items-center justify-center text-center"
            >
              <div class="bg-gray-50 p-4 rounded-full mb-4">
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h4 class="text-base font-semibold text-gray-900 mb-1">
                No tasks assigned
              </h4>
              <p class="text-sm text-gray-500 max-w-sm">
                This user currently has no active tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
