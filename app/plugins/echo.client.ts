import Pusher from "pusher-js";
import Echo from "laravel-echo";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  if (import.meta.client) {
    window.Pusher = Pusher;
  }

  const echo = new Echo({
    broadcaster: "reverb",
    key: config.public.ReverbAppKey,
    wsHost: config.public.reverbHost as string,
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });
  return {
    provide: {
      echo: echo,
    },
  };
});
