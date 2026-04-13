import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  if (import.meta.client) {
    window.Pusher = Pusher;
  }

  const loginStore = useLoginStore();
  const token = storeToRefs(loginStore).token;

  const notificationEcho = new Echo({
    broadcaster: "reverb",
    key: config.public.ReverbAppKey,
    wsHost: "127.0.0.1",
    wsPort: 8080,
    forceTLS: false,
    disableStats: true,
    authEndpoint: "http://localhost:8000/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token.value ?? ""}`,
      },
    },
  });

  nuxtApp.provide("notificationEcho", notificationEcho);
});
