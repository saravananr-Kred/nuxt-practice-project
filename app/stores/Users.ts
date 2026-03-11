import { defineStore } from "pinia";
export const useUsersStore = defineStore("User", () => {
  const loadingUsers = ref<boolean>(false);
  const users = ref<AllUsersDetailsData[]>([]);
  const search = ref<string>("");

  const singleUser = ref<AllUsersDetailsData | null>(null);
  const { showSuccess } = useToastStore();
  const { $api } = useNuxtApp();

  // ============= Computed Values ============= //

  // Filter Users based on search text

  // ============= Actions ============= //

  const handleError = (error: any) => {
    console.log(error, "error");
    const msg =
      error?.data?.message ||
      error?.message ||
      error?.statusMessage ||
      "An unexpected error occurred";
    showError(msg);
  };

  // Fetch single user
  const fetchSingleUser = async (id: number) => {
    loadingUsers.value = true;
    try {
      const response = await $api<AllUsersDetailsData>(
        "/api/user-details/" + id,
        {
          method: "get",
        },
      );

      singleUser.value = response;
    } catch (error) {
      handleError(error);
    } finally {
      loadingUsers.value = false;
    }
  };

  // Add a new user
  const AddUserApi = async (userData: any) => {
    loadingUsers.value = true;
    try {
      let response = await $api<AddUserResponse>("/api/user-details", {
        method: "post",
        body: userData,
      });

      if (response?.message?.includes("User created successfully")) {
        showSuccess("User added successfully!");
      } else {
        handleError("User not added!");
      }
    } catch (error) {
      handleError(error);
    } finally {
      loadingUsers.value = false;
    }
  };

  // Edit an user
  const UpdateUser = async (userData: any, id: number) => {
    loadingUsers.value = true;
    try {
      await $api("/api/user-details/" + id, {
        method: "post",
        body: userData,
      });

      showSuccess("User updated successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      loadingUsers.value = false;
    }
  };

  // Delete an user
  const DeleteUser = async (id: number) => {
    loadingUsers.value = true;
    try {
      await $api("/api/user-details/" + id, {
        method: "delete",
      });

      showSuccess("User deleted successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      loadingUsers.value = false;
    }
  };

  // Return values

  return {
    users,
    search,
    loadingUsers,
    AddUserApi,
    UpdateUser,
    DeleteUser,
    fetchSingleUser,
    singleUser,
  };
});
