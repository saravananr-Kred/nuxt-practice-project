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
    wsHost: "127.0.0.1",
    wsPort: 8080,
    forceTLS: false,
    disableStats: true,
  });
  return {
    provide: {
      echo: echo,
    },
  };
});
