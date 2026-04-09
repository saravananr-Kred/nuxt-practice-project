import { defineStore } from "pinia";
import { ref } from "vue";

export interface ActivityLog {
  id: number;
  module: string;
  action: string;
  user_name: string;
  profile_image: string | null;
  ip_address: string;
  created_at: string;
}

export interface ActivityApiResponse {
  action: string;
  created_at: string;
  id: number;
  ip_address: string;
  module: string;
  updated_at: string;
  user: {
    created_at: string;
    email: string;
    email_verified_at: null;
    id: number;
    name: string;
    updated_at: string;
  };
  user_id: number;
}

export interface ActivityResponse {
  data: ActivityLog[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const useActivityStore = defineStore("Activity", () => {
  const loadingActivities = ref<boolean>(false);
  const activities = ref<ActivityLog[]>([]);
  const search = ref<string>("");
  const filterModule = ref<string>("");
  const filterAction = ref<string>("");

  const { showSuccess, showError } = useToastStore();
  const { $api } = useNuxtApp();

  const mockData = ref<ActivityLog[]>([]);

  // const mockData: ActivityLog[] = [
  //   {
  //     id: 1,
  //     module: "Auth",
  //     action: "Login",
  //     user_name: "John Doe",
  //     profile_image: null,
  //     ip_address: "192.168.1.1",
  //     created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  //   },
  //   {
  //     id: 2,
  //     module: "User",
  //     action: "Create",
  //     user_name: "Jane Smith",
  //     profile_image: "https://i.pravatar.cc/150?u=jane",
  //     ip_address: "10.0.0.15",
  //     created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  //   },
  //   {
  //     id: 3,
  //     module: "Task",
  //     action: "Update",
  //     user_name: "Alice Johnson",
  //     profile_image: null,
  //     ip_address: "172.16.0.4",
  //     created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  //   },
  //   {
  //     id: 4,
  //     module: "License",
  //     action: "Delete",
  //     user_name: "Bob Wilson",
  //     profile_image: "https://i.pravatar.cc/150?u=bob",
  //     ip_address: "192.168.1.100",
  //     created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  //   },
  //   {
  //     id: 5,
  //     module: "Auth",
  //     action: "Logout",
  //     user_name: "John Doe",
  //     profile_image: null,
  //     ip_address: "192.168.1.1",
  //     created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  //   },
  //   {
  //     id: 6,
  //     module: "User",
  //     action: "Update",
  //     user_name: "Admin User",
  //     profile_image: "https://i.pravatar.cc/150?u=admin",
  //     ip_address: "127.0.0.1",
  //     created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  //   },
  //   {
  //     id: 7,
  //     module: "Task",
  //     action: "Create",
  //     user_name: "Sarah Williams",
  //     profile_image: null,
  //     ip_address: "10.0.0.22",
  //     created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  //   },
  //   {
  //     id: 8,
  //     module: "Task",
  //     action: "Delete",
  //     user_name: "Mike Brown",
  //     profile_image: "https://i.pravatar.cc/150?u=mike",
  //     ip_address: "172.16.0.10",
  //     created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  //   },
  //   {
  //     id: 9,
  //     module: "License",
  //     action: "Update",
  //     user_name: "Emily Davis",
  //     profile_image: null,
  //     ip_address: "192.168.1.55",
  //     created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  //   },
  //   {
  //     id: 10,
  //     module: "Auth",
  //     action: "Login",
  //     user_name: "Jane Smith",
  //     profile_image: "https://i.pravatar.cc/150?u=jane",
  //     ip_address: "10.0.0.15",
  //     created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  //   },
  // ];

  const fetchActivities = async (): Promise<ActivityLog[]> => {
    try {
      const response = await $api<ActivityApiResponse[]>("/api/audit-logs");
      console.log(response, "response");
      return response.map((i) => ({
        id: i.id,
        module: i.module,
        action: i.action,
        user_name: i.user.name,
        profile_image: null,
        ip_address: i.ip_address,
        created_at: i.created_at,
      }));
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  const handleError = (error: any) => {
    const msg =
      error?.data?.message ||
      error?.message ||
      error?.statusMessage ||
      "An unexpected error occurred while fetching activities";
    showError(msg);
  };

  const fetchActivitiesMock = async (params: {
    page: number;
    limit: number;
    search?: string;
    module?: string;
    action?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ActivityResponse> => {
    loadingActivities.value = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const data = await fetchActivities();
      let filteredData = [...data];

      if (params.search) {
        const query = params.search.toLowerCase();
        filteredData = filteredData.filter(
          (item) =>
            item.user_name.toLowerCase().includes(query) ||
            item.ip_address.includes(query) ||
            item.module.toLowerCase().includes(query) ||
            item.action.toLowerCase().includes(query),
        );
      }

      if (params.module) {
        filteredData = filteredData.filter(
          (item) => item.module === params.module,
        );
      }

      if (params.action) {
        filteredData = filteredData.filter(
          (item) => item.action === params.action,
        );
      }

      if (params.sortBy) {
        filteredData.sort((a: any, b: any) => {
          const valA = a[params.sortBy!] || "";
          const valB = b[params.sortBy!] || "";

          if (valA < valB) return params.sortOrder === "asc" ? -1 : 1;
          if (valA > valB) return params.sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      const total = filteredData.length;
      const startIndex = (params.page - 1) * params.limit;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + params.limit,
      );

      return {
        data: paginatedData,
        current_page: params.page,
        last_page: Math.ceil(total / params.limit) || 1,
        per_page: params.limit,
        total: total,
      };
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      loadingActivities.value = false;
    }
  };

  return {
    activities,
    search,
    filterModule,
    filterAction,
    loadingActivities,
    fetchActivities,
    fetchActivitiesMock,
  };
});
