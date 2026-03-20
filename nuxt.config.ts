import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  components: true,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  app: {
    head: {
      title: "Nuxt JS - Practice",
      meta: [
        {
          charset: "UTF-8",
        },
        { name: "description", content: "For Practicing Nuxt Js" },
      ],
    },
    pageTransition: {
      name: "slide",
      mode: "out-in",
    },
    layoutTransition: {
      name: "fade",
      mode: "out-in",
    },
  },
  // routeRules: {
  //   "/api/user-details": { swr: 60 },
  // },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      fileUrl: process.env.NUXT_PUBLIC_FILE_URL,
      supabaseStorageUrl: process.env.SUPABASE_STORAGE_URL,
    },
  },
  imports: {
    dirs: ["Types"],
  },
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-auth-sanctum",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
    "@nuxt/image",
  ],
  image: {
    domains: ["https://ybiwqilvsxrnsjboenek.supabase.co"],
    format: ["webp"],
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },
  css: [
    "@/assets/scss/main.scss",
    "@/assets/css/tailwind.css",
    "vuetify/styles",
  ],
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
  router: {
    options: { linkExactActiveClass: "active" },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/_variables.scss" as *;
            @use "@/assets/scss/_mixins.scss" as *;
            @use "@/assets/scss/_utilities.scss" as *;
          `,
        },
      },
    },
    plugins: [
      // @ts-expect-error
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
