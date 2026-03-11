<template>
  <div
    class="w-full bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-xl overflow-hidden"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="(header, index) in headerConfig"
              :key="index"
              class="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
              @click="handleSort(header.key)"
            >
              <div class="flex items-center gap-2">
                {{ header.label }}
                <div
                  v-show="!['phone', 'action', 'gender'].includes(header.key)"
                  class="flex flex-col text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  :class="{ 'opacity-100': sortBy === header.key }"
                >
                  <svg
                    v-if="sortBy !== header.key || sortOrder === 'asc'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 font-semibold"
                    :class="
                      sortBy === header.key && sortOrder === 'asc'
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                    "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <svg
                    v-if="sortBy !== header.key || sortOrder === 'desc'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    :class="
                      sortBy === header.key && sortOrder === 'desc'
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                    "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </th>
            <th
              class="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white">
          <template v-if="loading">
            <tr v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
              <td
                v-for="j in headerConfig.length"
                :key="'cell-' + j"
                class="px-4 py-4 whitespace-nowrap"
              >
                <div
                  class="h-4 bg-gray-100 rounded"
                  :class="j === 1 ? 'w-3/4' : 'w-1/2'"
                ></div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end gap-x-2">
                  <div class="h-8 w-8 bg-gray-100 rounded-md"></div>
                  <div class="h-8 w-8 bg-gray-100 rounded-md"></div>
                </div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="(row, rowIndex) in tableData"
              :key="rowIndex"
              class="hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
              @click="$emit('row-click', row.user_id)"
            >
              <td
                v-for="(header, hIndex) in headerConfig"
                :key="hIndex"
                v-show="
                  header.key !== 'actions' && header.key !== 'profile_image'
                "
                class="px-4 py-4 text-gray-700 whitespace-nowrap"
              >
                <div
                  v-if="header.key === 'name'"
                  class="flex items-center justify-start gap-x-2"
                >
                  <img
                    v-if="row?.profile_image !== null"
                    :src="`${publicPath}${row.profile_image}`"
                    class="h-8 w-8 rounded-full mr-2 object-cover"
                  />
                  <div v-else class="avatar">
                    <span class="avatar-text">{{
                      row[header.key]?.charAt(0) ?? ""
                    }}</span>
                  </div>
                  <span :class="{ 'font-medium text-gray-900': hIndex === 0 }">
                    {{ row[header.key] }}
                  </span>
                </div>
                <span
                  v-else
                  :class="{ 'font-medium text-gray-900': hIndex === 0 }"
                >
                  {{ row[header.key] }}
                </span>
              </td>

              <td class="px-4 py-4 whitespace-nowrap text-right" @click.stop>
                <div
                  class="flex items-center justify-end gap-x-2 transition-opacity focus-within:opacity-100"
                >
                  <button
                    v-if="can('edit-user')"
                    @click="$emit('edit-user', row.user_id)"
                    class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Edit User"
                  >
                    <EditIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="can('delete-user')"
                    @click="$emit('delete-user', row.user_id)"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete User"
                  >
                    <DeleteIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div
        v-if="!tableData.length && !loading"
        class="flex flex-col items-center justify-center py-12 px-4 text-center sm:px-6 lg:px-8"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-semibold text-gray-900">No users found</h3>
        <p class="mt-1 text-sm text-gray-500">
          We couldn't find anything matching your criteria.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { can } = usePermis();

const config = useRuntimeConfig();
const publicPath = config.public.fileUrl;

const props = defineProps({
  headerConfig: {
    type: Array as () => { label: string; key: string }[],
    required: true,
  },
  tableData: { type: Array as () => any[], required: true },
  sortBy: { type: String, default: "name" },
  sortOrder: { type: String as () => "asc" | "desc", default: "asc" },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: "edit-user", id: number): void;
  (e: "delete-user", id: number): void;
  (e: "row-click", id: number): void;
  (e: "sort", key: string): void;
}>();

function handleSort(key: string) {
  emit("sort", key);
}
</script>

<style scoped lang="scss">
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, $btn-bg-primary, $btn-bg-primary-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: $navy-text;
  font-weight: 700;
  font-size: 0.875rem;
}
</style>
