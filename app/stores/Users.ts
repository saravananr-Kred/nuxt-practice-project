import { defineStore } from "pinia";
export const useUsersStore = defineStore("User", () => {
  const loadingUsers = ref<boolean>(false);
  const users = ref<AllUsersDetailsData[]>([]);
  const search = ref<string>("");
  const filterGender = ref<string>("");
  const filterCity = ref<string>("");
  const filterState = ref<string>("");

  const singleUser = ref<AllUsersDetailsData | null>(null);
  const { showSuccess, showError } = useToastStore();
  const { $api } = useNuxtApp();
  const _pendingOps = new Set<string>();

  // ============= Computed Values ============= //

  // Filter Users based on search text

  // ============= Actions ============= //

  const handleError = (error: any) => {
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
    const opKey = `add-user-${userData.name}-${userData.email}`;
    if (_pendingOps.has(opKey)) return;
    _pendingOps.add(opKey);

    const tempId = Date.now();
    const optimisticUser = {
      ...userData,
      user_id: tempId,
      _optimistic: true,
    } as any;
    
    users.value = [optimisticUser, ...users.value];

    try {
      let response = await $api<AddUserResponse>("/api/user-details", {
        method: "post",
        body: userData,
      });

      if (response?.message?.includes("User created successfully")) {
        showSuccess("User added successfully!");
        // Update optimistic id if server returns id, else might need refresh
        const index = users.value.findIndex((u) => u.user_id === tempId);
        if (index !== -1) {
           delete (users.value[index] as any)._optimistic;
        }
      } else {
        handleError("User not added!");
        users.value = users.value.filter(u => u.user_id !== tempId);
      }
    } catch (error) {
      users.value = users.value.filter(u => u.user_id !== tempId);
      handleError(error);
    } finally {
      _pendingOps.delete(opKey);
    }
  };

  // Edit an user
  const UpdateUser = async (userData: any, id: number) => {
    const opKey = `update-user-${id}`;
    if (_pendingOps.has(opKey)) return;
    _pendingOps.add(opKey);

    const index = users.value.findIndex((u) => u.user_id === id);
    let backupUser: any = null;

    if (index !== -1) {
      backupUser = { ...users.value[index] };
      users.value[index] = { ...users.value[index], ...userData, _optimistic: true };
    }

    try {
      await $api("/api/user-details/" + id, {
        method: "put",
        body: userData,
      });

      if (index !== -1 && users.value) {
        delete (users.value[index] as any)._optimistic;
      }
      showSuccess("User updated successfully!");
    } catch (error) {
      if (index !== -1 && backupUser) {
        users.value[index] = backupUser;
      }
      handleError(error);
    } finally {
      _pendingOps.delete(opKey);
    }
  };

  // Delete an user
  const DeleteUser = async (id: number) => {
    const opKey = `delete-user-${id}`;
    if (_pendingOps.has(opKey)) return;
    _pendingOps.add(opKey);

    const index = users.value.findIndex((u) => u.user_id === id);
    let backupUser: any = null;

    if (index !== -1) {
      backupUser = { ...users.value[index] };
      users.value.splice(index, 1);
    }

    try {
      await $api("/api/user-details/" + id, {
        method: "delete",
      });

      showSuccess("User deleted successfully!");
    } catch (error) {
      if (backupUser) {
        users.value.splice(index, 0, backupUser);
      }
      handleError(error);
    } finally {
      _pendingOps.delete(opKey);
    }
  };

  // Return values

  return {
    users,
    search,
    filterGender,
    filterCity,
    filterState,
    loadingUsers,
    AddUserApi,
    UpdateUser,
    DeleteUser,
    fetchSingleUser,
    singleUser,
  };
});
