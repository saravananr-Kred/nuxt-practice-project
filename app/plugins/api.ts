import { defineNuxtPlugin } from "#app";
import type { $Fetch } from "ofetch";

export default defineNuxtPlugin((nuxtApp) => {
  const toastStore = useToastStore();

  const apiFetcher = $fetch.create({
    onRequest({ options }) {
      const loginStore = useLoginStore();
      const headers = new Headers(options.headers);

      headers.set("Accept", "application/json");

      if (loginStore.token) {
        headers.set("Authorization", `Bearer ${loginStore.token}`);
      }

      options.headers = headers;
    },
    onResponseError({ response }) {
      const loginStore = useLoginStore();
      if (response.status === 401) {
        loginStore.logout();
      }

      const errorMsg = response._data?.message || "Something went wrong";
      toastStore.showError(errorMsg);
    },
  });

  return {
    provide: {
      api: apiFetcher as $Fetch,
    },
  };
});
