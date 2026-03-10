<script setup lang="ts">
definePageMeta({
  layout: "side-bar",
});

const route = useRoute();
const toastStore = useToastStore();
const isSaving = ref(false);
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

const states = Object.keys(locations);
const { $api } = useNuxtApp();
const errors = ref<number[]>([]);
const deleteDialog = ref<boolean>(false);
const selectedLicense = ref<License | null>(null);
interface License {
  id: number;
  number: string;
  state: string;
  city: string;
  endDate: string;
  startDate: string;
  isSaved: boolean;
}

const isExpired = (date: string) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const licenses = ref<License[]>([
  {
    id: 0,
    number: "",
    state: "",
    city: "",
    endDate: "",
    startDate: "",

    isSaved: false,
  },
]);

const resetLicense = () => {
  licenses.value = [
    {
      id: 0,
      number: "",
      state: "",
      city: "",
      endDate: "",
      startDate: "",
      isSaved: false,
    },
  ];
};

const validateLicense = () => {
  const toSave: License[] = [];

  licenses.value.forEach((license, index) => {
    const isEmpty =
      !license.number &&
      !license.state &&
      !license.city &&
      !license.startDate &&
      !license.endDate;

    if (license.isSaved || isEmpty) return;

    const hasMissingFields =
      !license.number ||
      !license.state ||
      !license.city ||
      !license.startDate ||
      !license.endDate;

    if (hasMissingFields) {
      errors.value.push(index);
    } else {
      toSave.push(license);
    }
  });

  return toSave;
};

const addLicense = () => {
  licenses.value.push({
    id: 0,
    number: "",
    state: "",
    city: "",
    endDate: "",
    startDate: "",
    isSaved: false,
  });
};

const removeLicense = (data: License, index: number) => {
  if (data.id !== 0) {
    deleteDialog.value = true;
    selectedLicense.value = data;
  } else {
    if (licenses.value.length > 1) {
      licenses.value.splice(index, 1);
    }
  }
};

const confirmDelete = async () => {
  console.log(selectedLicense.value?.id, "delete id");

  let response = await $api("/api/user/license/" + selectedLicense.value?.id);

  console.log(response);

  deleteDialog.value = false;
};

const cancelDelete = () => {
  deleteDialog.value = false;
};

const handleStateChange = (index: number) => {
  console.log(index, "index");
  if (licenses.value[index]) {
    licenses.value[index].city = "";
  }
};

const saveLicenses = async () => {
  isSaving.value = true;
  let validData = validateLicense();

  if (errors.value.length > 0) {
    toastStore.showError("Please fill all fields before saving.");
    isSaving.value = false;
    return;
  }
  console.log(validData, "to save");
  try {
    const { $api } = useNuxtApp();
    const data = await $api(`/api/user/${route.params.id}/license`, {
      method: "post",
      body: { licenses: validData },
    });

    if (data?.message === "success") {
      toastStore.showSuccess("Licenses inserted successfully");
      await refresh(); // Refresh data
    }
  } catch (e) {
    toastStore.showError("Update failed");
  } finally {
    isSaving.value = false;
  }
};

const activeMenu1 = ref<number | null>(null);
const activeMenu2 = ref<number | null>(null);

const formatDate = (date: any) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

const getLicenses = async () => {
  const { $api } = useNuxtApp();
  try {
    const response = await $api(`/api/user/${route.params.id}/license`);
    if (response) {
      licenses.value = response.map((l: any) => ({
        id: l.id,
        number: l.license_number,
        state: l.license_state,
        city: l.license_city,
        startDate: l.license_start_date,
        endDate: l.license_end_date,
        isSaved: true,
      }));
    }
  } catch (e) {
    console.error("Fetch failed", e);
  }
};

const { pending, error, refresh } = useAsyncData("licenses", () =>
  getLicenses(),
);
</script>
<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-20">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-[#c0e5c9]"
    >
      <div>
        <div class="flex items-center gap-3 mb-1">
          <div class="w-2 h-8 bg-[#7bf37b] rounded-full"></div>
          <h1 class="text-3xl font-black" style="color: #010145">
            License Management
          </h1>
        </div>
        <p class="text-gray-500 font-medium">
          Verified credentials and professional permits.
        </p>
      </div>

      <div class="flex gap-3">
        <div
          class="hidden sm:flex flex-col items-end px-4 border-r border-gray-100"
        >
          <span class="text-[10px] font-bold text-gray-400 uppercase"
            >Total Active</span
          >
          <span class="text-xl font-black" style="color: #010145">{{
            licenses.filter((l) => !isExpired(l.endDate)).length
          }}</span>
        </div>
        <button
          @click="addLicense"
          class="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95 bg-[#010145] text-white"
        >
          <span class="text-xl text-[#7bf37b]">+</span> New License
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TransitionGroup name="list">
        <div
          v-for="(license, index) in licenses"
          :key="index"
          class="relative bg-white rounded-[2rem] border-2 transition-all duration-500 overflow-hidden"
          :class="
            license.isSaved
              ? 'border-[#ecf0e9] shadow-sm hover:border-[#7bf37b]'
              : 'border-dashed border-[#7bf37b] bg-[#7bf37b]/5'
          "
        >
          <div
            class="px-8 py-4 flex justify-between items-center border-b border-gray-50"
            :class="license.isSaved ? 'bg-[#fafafa]' : 'bg-[#7bf37b]/10'"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-2 h-2 rounded-full"
                :class="
                  isExpired(license.endDate) ? 'bg-red-500' : 'bg-[#04a004]'
                "
              ></span>
              <span
                class="text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                {{
                  license.isSaved && license.id !== 0
                    ? "Saved License"
                    : license.id === 0
                      ? "Adding New"
                      : "Editing License"
                }}
              </span>
            </div>

            <button
              @click="removeLicense(license, index)"
              class="transition group transition-all delay-200 ease-in text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition transition-all delay-200 ease-in group-hover:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          <div class="p-8 space-y-5">
            <div class="flex flex-col gap-1.5">
              <label class="label-style">License Number</label>
              <input
                v-model="license.number"
                type="text"
                placeholder="Ex: LIC-9920-X"
                class="input-style font-mono tracking-wider"
                :class="{
                  'border-1 border-red-500':
                    errors.includes(index) && !license.number,
                  'border-1 border-[#c0e5c9]':
                    !errors.includes(index) || license.number,
                }"
              />
              <span
                v-if="errors.includes(index) && !license.number"
                class="text-red-500 text-xs"
                >Please enter license number</span
              >
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5 custom-select-container">
                <label class="label-style">Issuing State</label>

                <v-select
                  v-model="license.state"
                  :items="states"
                  placeholder="Select State"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  @update:model-value="handleStateChange(index)"
                  :menu-props="{ contentClass: 'custom-dropdown-menu' }"
                  class="custom-v-select"
                  :error="errors.includes(index) && !license.state"
                ></v-select>
                <span
                  v-if="errors.includes(index) && !license.state"
                  class="text-red-500 text-xs"
                  >Please select state</span
                >
              </div>
              <div class="flex flex-col gap-1.5 custom-select-container">
                <label class="label-style">City</label>

                <v-select
                  v-model="license.city"
                  :items="
                    locations[license.state as keyof typeof locations] || []
                  "
                  :disabled="!license.state"
                  placeholder="Select City"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  :menu-props="{ contentClass: 'custom-dropdown-menu' }"
                  class="custom-v-select"
                  :class="{
                    'border-red-500': errors.includes(index) && !license.city,
                  }"
                ></v-select>
                <span
                  v-if="errors.includes(index) && !license.city"
                  class="text-red-500 text-xs"
                  >Please select city</span
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div class="flex flex-col gap-1.5">
                <label class="label-style">Start Date</label>

                <v-menu
                  :close-on-content-click="false"
                  :model-value="activeMenu1 === index"
                  @update:model-value="
                    (val) => (activeMenu1 = val ? index : null)
                  "
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      :model-value="formatDate(license.startDate)"
                      v-bind="props"
                      readonly
                      format="dd-MM-yyyy"
                      variant="outlined"
                      density="comfortable"
                      class="custom-v-select"
                      prepend-inner-icon="mdi-calendar"
                      hide-details
                    ></v-text-field>
                    <span
                      v-if="errors.includes(index) && !license.startDate"
                      class="text-red-500 text-xs"
                      >Please select start date</span
                    >
                  </template>

                  <v-date-picker
                    v-model="license.startDate"
                    color="#7bf37b"
                    elevation="10"
                    @update:model-value="activeMenu1 = null"
                  ></v-date-picker>
                </v-menu>
              </div>
              <div
                class="flex flex-col gap-1.5"
                :class="
                  isExpired(license.endDate)
                    ? 'bg-red-50 border-red-100'
                    : 'bg-gray-50 border-gray-100'
                "
              >
                <label
                  class="label-style"
                  :class="isExpired(license.endDate) ? 'text-red-600' : ''"
                  >Expiry Date</label
                >

                <v-menu
                  :close-on-content-click="false"
                  :model-value="activeMenu2 === index"
                  @update:model-value="
                    (val) => (activeMenu2 = val ? index : null)
                  "
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      :model-value="formatDate(license.endDate)"
                      v-bind="props"
                      readonly
                      format="dd-MM-yyyy"
                      variant="outlined"
                      density="comfortable"
                      class="custom-v-select"
                      prepend-inner-icon="mdi-calendar"
                      hide-details
                    ></v-text-field>
                    <span
                      v-if="errors.includes(index) && !license.endDate"
                      class="text-red-500 text-xs"
                      >Please select end date</span
                    >
                  </template>

                  <v-date-picker
                    v-model="license.endDate"
                    color="#7bf37b"
                    elevation="10"
                    @update:model-value="activeMenu2 = null"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div
      class="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50"
    >
      <div
        class="bg-[#010145] p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-[#7bf37b]/30"
      >
        <div class="pl-4">
          <p
            class="text-[10px] font-bold text-[#7bf37b] uppercase tracking-widest"
          >
            Unsaved Changes
          </p>
          <p class="text-white text-sm font-medium">
            {{ licenses.length }} Total Records
          </p>
        </div>
        <button
          @click="saveLicenses"
          :disabled="isSaving"
          class="px-8 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
          style="background-color: #7bf37b; color: #010145"
        >
          <Spinner v-if="isSaving" :loading="true" />
          {{ isSaving ? "Saving..." : "Commit All Changes" }}
        </button>
      </div>
    </div>
    <ConfirmDelete
      @confirm-delete="confirmDelete"
      @cancel-delete="cancelDelete"
    />
  </div>
</template>

<style scoped>
.label-style {
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #010145;
  margin-left: 4px;
}
option {
  padding: 8px 4px;
  border-radius: 8px;
}
.input-style {
  width: 100%;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 14px;
  font-size: 14px;
  color: #010145;
  transition: all 0.2s ease;
  outline: none;
}
:deep(.custom-v-select .v-field) {
  background-color: #f5f5f5 !important;
  border-radius: 14px !important;
  font-size: 14px;
  color: #010145;
  transition: all 0.2s ease;
}

:deep(.custom-v-select .v-outline__separator),
:deep(.custom-v-select .v-field__outline) {
  --v-field-border-opacity: 1;
  color: #c0e5c9 !important;
}
:deep(.custom-v-select .v-field--error .v-outline__separator),
:deep(.custom-v-select .v-field--error .v-field__outline) {
  --v-field-border-opacity: 1;
  color: red !important;
}
:deep(.custom-v-select .v-field--focused) {
  background-color: #ffffff !important;
  box-shadow: 0 0 0 4px rgba(123, 243, 123, 0.15);
}
:deep(.custom-v-select .v-field--focused .v-field__outline) {
  color: #7bf37b !important;
}

/* Dropdown (Options) Styling */
:deep(.custom-dropdown-menu) {
  background-color: #ffffff !important;
  border-radius: 12px !important;
  border: 1px solid #c0e5c9 !important;
  margin-top: 8px;
}

:deep(.custom-dropdown-menu .v-list-item--active) {
  background-color: #f5f5f5 !important;
  color: #010145 !important;
}
.input-style:focus {
  background-color: #ffffff;
  border-color: #7bf37b;
  box-shadow: 0 0 0 4px rgba(123, 243, 123, 0.15);
}

/* List Animation */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
