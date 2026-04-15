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
    wsHost: config.public.reverbHost as string,
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    authEndpoint: config.public.backendUrl + "/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token.value ?? ""}`,
        Accept: "application/json",
      },
    },
  });

  nuxtApp.provide("notificationEcho", notificationEcho);
});
