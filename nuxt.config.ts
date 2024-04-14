// https://nuxt.com/docs/api/configuration/nuxt-config
import am from "./locals/am.json";
import en from "./locals/en.json";
import graphql from "@rollup/plugin-graphql";

export default defineNuxtConfig({
  ssr: false,
  vite: {
    plugins: [graphql()],
  },
  build: {
    transpile: ["graphql", "@apollo/client", "@vue/apollo-composable"],
  },
  app: {
    head: {
      charset: "utf-16",
      viewport: "width=500, initial-scale=1",
      meta: [
        {
          name: "description",
          content:
            "Create a wider and strong network among the community through revolutionizing the way peoples think, live, communicate, share, sell, buy, deliver, get services, provide services and democratizing the quality of living. Provide a wider strong network which helps to link everything, connect fair services with customers, provide quality products with fair price.",
        },
      ],
      link: [{ rel: "icon", href: "/favicon.svg" }],
    },
  },

  css: ["@vueup/vue-quill/dist/vue-quill.snow.css"],

  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config",
    exposeConfig: false,
    //config: {},
    injectPosition: 0,
    viewer: true,
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    "@nuxt/image-edge",
    "@nuxtjs/device",
    "@nuxtjs/html-validator",
    "magic-regexp/nuxt",
    "nuxt-icon",
    "nuxt-lodash",
    "nuxt-typed-router",
    "nuxt-swiper",
    "nuxt-svgo",
    "nuxt-csurf",
  ],

  runtimeConfig: {
    firebaseApiKey: "",
    firebaseAuthDomain: "",
    firebaseProjectId: "",
    storagePacket: "",
    firebaseMessageSenderId: "",
    firebaseAppId: "",

    graphqlEndpoint: "",
    restEndpoint: "",

    public: {
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseProjectId: "",
      storagePacket: "",
      firebaseMessageSenderId: "",
      firebaseAppId: "",
      graphqlEndpoint: "",
      restEndpoint: "",
    },
  },

  i18n: {
    // locales: ['en', 'am'],
    strategy: "no_prefix",
    // defaultLocale: 'en',
    vueI18n: {
      legacy: false,
      locale: "en",
      messages: {
        en: en,
        am: am,
      },
    },
  },

  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },

  htmlValidator: {},
});
