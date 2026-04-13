<script setup lang="ts">
import { storeToRefs } from "pinia";
import { debounce } from "@/utils/debounce";

const userStore = useUsersStore();
const { search, filterGender, filterCity, filterState, users, onlineUsers } =
  storeToRefs(userStore);

useSeo("Users List", "Display Users List in a table");

const headers = ref([
  { label: "Status", key: "status" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Address", key: "address" },
  { label: "DOB", key: "dob" },
  { label: "Gender", key: "gender" },
]);
const AddUserData = ref({
  id: "",
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
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
const { $api, $echo } = useNuxtApp();

const locations = {
  California: [
    "Los Angeles",
    "San Diego",
    "San Jose",
    "San Francisco",
    "Sacramento",
  ],
  Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
  Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
  Illinois: ["Chicago", "Aurora", "Naperville", "Springfield", "Rockford"],
  Pennsylvania: [
    "Philadelphia",
    "Pittsburgh",
    "Allentown",
    "Erie",
    "Harrisburg",
  ],
  Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
  Georgia: ["Atlanta", "Augusta", "Savannah", "Athens", "Columbus"],
  Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Olympia"],
  Arizona: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
  Colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder"],
  Michigan: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Flint"],
  Massachusetts: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  Nevada: ["Las Vegas", "Reno", "Henderson", "North Las Vegas", "Carson City"],
  "North Carolina": [
    "Charlotte",
    "Raleigh",
    "Greensboro",
    "Durham",
    "Winston-Salem",
  ],
};

const stateOptions = computed(() => {
  return [
    { label: "State filter", value: "" },
    ...Object.keys(locations).map((l: string) => ({ label: l, value: l })),
  ];
});

const isUserOnline = (id: number | string) => {
  return onlineUsers.value.some((u) => String(u.id) === String(id));
};

const cityOptions = computed(() => {
  return filterState.value
    ? [
        { label: "City filter", value: "" },
        ...locations[filterState.value as keyof typeof locations].map(
          (l: string) => ({
            label: l,
            value: l,
          }),
        ),
      ]
    : [{ label: "Select a state first", value: "" }];
});

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
    `users-${search.value}-${filterGender.value}-${filterCity.value}-${filterState.value}-${currentPage.value}-${perPage.value}-${sortBy.value}-${sortOrder.value}`,
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

    if (filterGender.value) {
      url += url.includes("?") ? "&" : "?";
      url += `gender=${encodeURIComponent(filterGender.value)}`;
    }
    if (filterCity.value) {
      url += url.includes("?") ? "&" : "?";
      url += `city=${encodeURIComponent(filterCity.value)}`;
    }
    if (filterState.value) {
      url += url.includes("?") ? "&" : "?";
      url += `state=${encodeURIComponent(filterState.value)}`;
    }

    try {
      const data = await $api(url);

      return data ?? {};
    } catch (err) {
      console.error(err);
      return {};
    }
  },
  {
    watch: [
      currentPage,
      perPage,
      sortBy,
      sortOrder,
      filterGender,
      filterCity,
      filterState,
    ],
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
  if (!search) {
    refresh();
  } else {
    debouncedRefresh();
  }
});
function HandleRowClick(data: number) {
  navigateTo(`/users/${data}`);
}

async function callBroadcast() {
  await $api("/api/broadcast");
}

onMounted(() => {
  $echo
    .channel("date-channel")
    .listen(".date-event", (data: { message: string }) => {
      const toastStore = useToastStore();
      toastStore.showSuccess(data.message);
    });
});

function handleOpenModal(value: boolean) {
  AddUserData.value = {
    id: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
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
const formatUsers = (rawData: any[]) => {
  return rawData.map((user: any) => {
    const addressParts = [user.street, user.city, user.state].filter(Boolean);
    const address =
      addressParts.join(", ") + (user.pincode ? ` - ${user.pincode}` : "");

    return {
      ...user,
      address: address || "N/A",
      status: isUserOnline(user.id) ? "online" : "offline",
    };
  });
};

// Update when API data changes
watch(
  apiResponse,
  (newData) => {
    if (newData?.data) {
      lastPage.value = newData.last_page ?? 1;
      totalUsers.value = newData.total ?? 0;
      userStore.users = formatUsers(newData.data);
    } else {
      userStore.users = [];
    }
  },
  { immediate: true },
);

// Update when online users list changes (Real-time update)
watch(
  onlineUsers,
  () => {
    if (userStore.users.length > 0) {
      userStore.users = userStore.users.map((user) => ({
        ...user,
        status: isUserOnline(user.id) ? "online" : "offline",
      }));
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
    <h1 class="font-semibold text-2xl">Users List</h1>
    <hr class="border-1 border-[#c0e5c9] mt-2" />
    <div class="flex items-center flex-wrap gap-4 my-4">
      <div class="w-full sm:flex-1 sm:min-w-[160px]">
        <Input
          label="Search User"
          placeholder="Search users..."
          type="text"
          v-model="search"
        />
      </div>

      <div class="w-full sm:w-40 xl:w-48">
        <Select
          label="Gender"
          :options="[
            { label: 'Gender Filter', value: '' },
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]"
          v-model="filterGender"
          layout="auth"
        />
      </div>

      <div class="w-full sm:w-40 xl:w-48">
        <Select
          v-model="filterState"
          :options="stateOptions"
          label="State"
          layout="auth"
        />
      </div>

      <div class="w-full sm:w-40 xl:w-48">
        <Select
          v-model="filterCity"
          :options="cityOptions"
          label="City"
          layout="auth"
          :disabled="!filterState"
        />
      </div>

      <div class="w-full sm:w-auto ml-auto flex items-center justify-end">
        <Button
          v-if="can('add-user')"
          @button-click="handleOpenModal(true)"
          additionalClasses="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold "
        >
          <PlusIcon class="h-4 w-4" />
          Add User
        </Button>
        <Button
          @button-click="callBroadcast"
          additionalClasses="inline-flex ml-2 items-center justify-center px-4 py-2 text-sm font-semibold "
        >
          Test Live UI Updates
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
