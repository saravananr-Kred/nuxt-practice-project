<script setup lang="ts">
import { storeToRefs } from "pinia";
import { debounce } from "@/utils/debounce";

const userStore = useUsersStore();
const { search, users } = storeToRefs(userStore);

const headers = ref([
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Age", key: "age" },
  { label: "DOB", key: "dob" },
  { label: "Gender", key: "gender" },
]);
const AddUserData = ref({
  id: "",
  firstName: "",
  lastName: "",
  age: 0,
  gender: "",
  email: "",
  phone: "",
  dob: "",
});

const { can } = usePermis();
const route = useRoute();
const openModal = ref<boolean>(false);
const userId = ref<number>(0);
const currentPage = ref<number>(1);
const totalUsers = ref<number>(0);
const perPage = ref<number>(10);
const lastPage = ref<number>(1);
const sortBy = ref<string>("name");
const sortOrder = ref<"asc" | "desc">("asc");

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

// Fetch all users
const cacheKey = computed(
  () =>
    `users-${search.value}-${currentPage.value}-${perPage.value}-${sortBy.value}-${sortOrder.value}`,
);

const {
  data: apiResponse,
  pending: loadingUsers,
  error,
  refresh,
} = await useAsyncData(
  cacheKey,
  async () => {
    let url = "/api/user-details";

    if (search.value !== "") {
      url += "?search=" + search.value;
    }

    url.includes("?")
      ? (url += "&page=" + currentPage.value + "&limit=" + perPage.value)
      : (url += "?page=" + currentPage.value + "&limit=" + perPage.value);

    url += "&sort_by=" + sortBy.value + "&sort_order=" + sortOrder.value;

    const { $api } = useNuxtApp();
    try {
      const data = await $api(url);

      return data ?? {};
    } catch (err) {
      console.error(err);
      return {};
    }
  },
  {
    watch: [currentPage, perPage, sortBy, sortOrder],
  },
);

watch(error, (error) => {
  const toastStore = useToastStore();

  const errorMsg = error?.message || "Something went wrong";
  toastStore.showError(errorMsg);
});

// ================= DEBOUNCED FETCH ================= //

const debouncedRefresh = debounce(() => refresh(), 500);

watch([search], (value) => {
  const [search] = value;
  if (!search || search.trim() === "") {
    refresh();
  } else {
    debouncedRefresh();
  }
});
function HandleRowClick(data: number) {
  navigateTo(`/users/${data}`);
}

function handleOpenModal(value: boolean) {
  AddUserData.value = {
    id: "",
    firstName: "",
    lastName: "",
    age: 0,
    gender: "",
    email: "",
    phone: "",
    dob: "",
  };
  openModal.value = true;
}

async function HandleUserEdit(data: number) {
  userId.value = data;
  await userStore.fetchSingleUser(data);
  openModal.value = true;
}

function HandleUserDelete(id: number) {
  userStore.DeleteUser(id);
}

watch(
  apiResponse,
  (newData) => {
    if (newData) {
      lastPage.value = newData.last_page ?? 1;
      totalUsers.value = newData.total ?? 0;
      userStore.users = newData.data ?? [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
    <h1 class="font-semibold text-2xl">Users List</h1>
    <hr class="border-1 border-[#c0e5c9] mt-2" />
    <div class="flex items-center justify-between m-4">
      <div class="sm:w-80">
        <Input
          label="Search User"
          placeholder="Search users..."
          type="text"
          v-model="search"
        />
      </div>

      <div class="mt-4 sm:mt-0 flex items-center gap-3">
        <Button
          v-if="can('add-user')"
          @button-click="handleOpenModal(true)"
          additionalClasses="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold "
        >
          <PlusIcon class="h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>
    <Table
      :loading="loadingUsers"
      :headerConfig="headers"
      :tableData="users"
      :sortBy="sortBy"
      :sortOrder="sortOrder"
      @row-click="HandleRowClick"
      @edit-user="HandleUserEdit"
      @delete-user="HandleUserDelete"
      @sort="handleSort"
    />

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
          <nav
            class="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
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

    <AddUser
      v-model="openModal"
      @refresh-data="refresh"
      :userId="userId"
      :data="AddUserData"
    />
  </div>
</template>
