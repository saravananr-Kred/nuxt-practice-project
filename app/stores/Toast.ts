import { defineStore } from "pinia";

export const useToastStore = defineStore("Toast", {
  state: () => ({
    show: false as boolean,
    message: "" as string,
    type: "" as string,
    duration: 0 as number,
    toastTimer: null as ReturnType<typeof setTimeout> | null,
  }),
  actions: {
    showSuccess(msg: string) {
      if (!import.meta.client) return;
      this.clearActiveTimer();
      this.show = true;
      this.message = msg;
      this.type = "success";
      this.duration = 2500;

      this.toastTimer = setTimeout(() => {
        this.show = false;
        this.message = "";
        this.type = "";
        this.duration = 0;
      }, this.duration);
    },
    showError(msg: string) {
      if (!import.meta.client) return;
      this.clearActiveTimer();
      this.show = true;
      this.message = msg;
      this.type = "error";
      this.duration = 4000;
      this.toastTimer = setTimeout(() => {
        this.show = false;
        this.message = "";
        this.type = "";
        this.duration = 0;
      }, this.duration);
    },
    clearActiveTimer() {
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
        this.toastTimer = null;
      }
    },
  },
});
