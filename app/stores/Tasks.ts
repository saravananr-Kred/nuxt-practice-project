import { defineStore } from "pinia";

export const useTasksStore = defineStore("Task", () => {
  const loadingTasks = ref<boolean>(false);
  const tasks = ref<TaskData[]>([]);
  const search = ref<string>("");
  const singleTask = ref<TaskData | null>(null);
  const { showSuccess } = useToastStore();
  const { $api } = useNuxtApp();
  const taskComments = ref<CommentData[]>([]);
  const _pendingOps = new Set<string>();

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
  const addTask = async (taskData: TaskFormData) => {
    const opKey = `add-task-${taskData.name}`;
    if (_pendingOps.has(opKey)) return;
    _pendingOps.add(opKey);

    const tempId = Date.now();
    const optimisticTask = {
      ...taskData,
      id: tempId,
      _optimistic: true,
    } as any;
    
    tasks.value = [optimisticTask, ...(tasks.value || [])];

    try {
      const response = await $api<TaskApiResponse>("/api/tasks", {
        method: "post",
        body: taskData,
      });

      showSuccess("Task added successfully!");
      if (tasks.value) {
        const index = tasks.value.findIndex(t => t.id === tempId);
        if (index !== -1) delete (tasks.value[index] as any)._optimistic;
      }
    } catch (error) {
      if (tasks.value) {
        tasks.value = tasks.value.filter(t => t.id !== tempId);
      }
      handleError(error);
    }
  };

  // Update a task
  const updateTask = async (taskData: TaskFormData, id: number) => {
    const opKey = `update-task-${id}`;
    if (_pendingOps.has(opKey)) return;
    _pendingOps.add(opKey);

    const index = tasks.value?.findIndex((t) => t.id === id) ?? -1;
    let backupTask: any = null;

    if (index !== -1 && tasks.value) {
      backupTask = { ...tasks.value[index] };
      tasks.value[index] = { ...tasks.value[index], ...taskData, _optimistic: true } as any;
    }

    try {
      await $api("/api/tasks/" + id, {
        method: "put",
        body: taskData,
      });

      if (index !== -1 && tasks.value) delete (tasks.value[index] as any)._optimistic;
      showSuccess("Task updated successfully!");
    } catch (error) {
      if (index !== -1 && backupTask && tasks.value) {
        tasks.value[index] = backupTask;
      }
      handleError(error);
    }
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    const opKey = `delete-task-${id}`;
    if (_pendingOps.has(opKey)) return;
    _pendingOps.add(opKey);

    const index = tasks.value?.findIndex((t) => t.id === id) ?? -1;
    let backupTask: any = null;

    if (index !== -1 && tasks.value) {
      backupTask = { ...tasks.value[index] };
      tasks.value.splice(index, 1);
    }

    try {
      await $api("/api/tasks/" + id, {
        method: "delete",
      });

      showSuccess("Task deleted successfully!");
    } catch (error) {
      if (backupTask && tasks.value) {
        tasks.value.splice(index, 0, backupTask);
      }
      handleError(error);
    } finally {
      _pendingOps.delete(opKey);
    }
  };

  const fetchTaskComments = async (taskId: number) => {
    try {
      const response = await $api<CommentData[]>(
        `/api/tasks/${taskId}/comments`,
      );
      taskComments.value = response || [];
    } catch (error) {
      handleError(error);
    }
  };

  const addTaskComment = async (taskId: number, payload: CommentPayload) => {
    const opKey = `add-comment-${taskId}-${Date.now()}`;
    if (_pendingOps.has(opKey)) return;
    _pendingOps.add(opKey);

    const tempId = Date.now();
    const optimisticComment = {
      ...payload,
      id: tempId,
      _optimistic: true,
      created_at: new Date().toISOString(),
    } as any;
    
    if (taskComments.value) {
      taskComments.value.push(optimisticComment);
    }

    try {
      await $api(`/api/tasks/${taskId}/comments`, {
        method: "post",
        body: payload,
      });
      await fetchTaskComments(taskId);
      showSuccess("Comment added successfully!");
    } catch (error) {
      if (taskComments.value) {
        taskComments.value = taskComments.value.filter(c => c.id !== tempId);
      }
      handleError(error);
    } finally {
      _pendingOps.delete(opKey);
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
    taskComments,
    fetchTaskComments,
    addTaskComment,
  };
});
