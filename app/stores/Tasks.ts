import { defineStore } from "pinia";

export const useTasksStore = defineStore("Task", () => {
  const loadingTasks = ref<boolean>(false);
  const tasks = ref<TaskData[]>([]);
  const search = ref<string>("");
  const singleTask = ref<TaskData | null>(null);
  const { showSuccess } = useToastStore();
  const { $api } = useNuxtApp();

  // ============= Computed Values ============= //

  // Filter tasks based on search text
  const filteredTasks = computed<TaskData[]>(() => {
    return tasks.value
      ?.filter((item) =>
        item.name.toLowerCase().includes(search.value.toLowerCase()),
      )
      ?.sort((a, b) => Number(a.id) - Number(b.id));
  });

  const handleError = (error: any) => {
    console.log(error, "error");
    const msg =
      error?.data?.message ||
      error?.message ||
      error?.statusMessage ||
      "An unexpected error occurred";
    showError(msg);
  };

  // Group tasks by status for Kanban columns
  const tasksByStatus = computed(() => {
    const grouped = {
      Open: [] as TaskData[],
      "In Progress": [] as TaskData[],
      Completed: [] as TaskData[],
      "On Hold": [] as TaskData[],
    };

    filteredTasks.value.forEach((task) => {
      const status = task.status as keyof typeof grouped;
      if (grouped[status]) {
        grouped[status].push(task);
      } else {
        grouped["Open"].push(task);
      }
    });

    return grouped;
  });

  // ============= Actions ============= //

  // Fetch single task
  const fetchSingleTask = async (id: number) => {
    loadingTasks.value = true;
    try {
      const response = await $api<TaskData>("/api/tasks/" + id, {
        method: "get",
      });

      singleTask.value = response;
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      loadingTasks.value = false;
    }
  };

  // Add a new task
  const addTask = async (taskData: FormData) => {
    loadingTasks.value = true;
    try {
      const response = await $api<TaskApiResponse>("/api/tasks", {
        method: "post",
        body: taskData,
      });

      showSuccess("Task added successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      loadingTasks.value = false;
    }
  };

  // Update a task
  const updateTask = async (taskData: FormData, id: number) => {
    loadingTasks.value = true;
    try {
      await $api("/api/tasks/" + id, {
        method: "put",
        body: taskData,
      });

      showSuccess("Task updated successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      loadingTasks.value = false;
    }
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    loadingTasks.value = true;
    try {
      await $api("/api/tasks/" + id, {
        method: "delete",
      });

      showSuccess("Task deleted successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      loadingTasks.value = false;
    }
  };

  // Return values
  return {
    tasks,
    search,
    loadingTasks,
    filteredTasks,
    tasksByStatus,
    singleTask,
    fetchSingleTask,
    addTask,
    updateTask,
    deleteTask,
  };
});
