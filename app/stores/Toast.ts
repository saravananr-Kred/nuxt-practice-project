import { defineStore } from "pinia";

export const useToastStore = defineStore("Toast", {
  state: () => ({
    show: false as boolean,
    message: "" as string,
    type: "" as string,
  }),
  actions: {
    showSuccess(msg: string) {
      this.show = true;
      this.message = msg;
      this.type = "success";
      setTimeout(() => {
        this.show = false;
        this.message = "";
        this.type = "";
      }, 2500);
    },
    showError(msg: string) {
      this.show = true;
      this.message = msg;
      this.type = "error";
      setTimeout(() => {
        this.show = false;
        this.message = "";
        this.type = "";
      }, 4000);
    },
  },
});
