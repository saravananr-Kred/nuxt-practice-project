import { defineStore } from "pinia";
let toastTimer: ReturnType<typeof setTimeout>;

export const useToastStore = defineStore("Toast", {
  state: () => ({
    show: true as boolean,
    message: "" as string,
    type: "" as string,
  }),
  actions: {
    showSuccess(msg: string) {
      clearTimeout(toastTimer);
      this.show = true;
      this.message = msg;
      this.type = "success";
      toastTimer = setTimeout(() => {
        this.show = false;
      }, 2500);
    },
    showError(msg: string) {
      clearTimeout(toastTimer);
      this.show = true;
      this.message = msg;
      this.type = "error";
      toastTimer = setTimeout(() => {
        this.show = false;
        this.message = "";
        this.type = "";
      }, 4000);
    },
  },
});
