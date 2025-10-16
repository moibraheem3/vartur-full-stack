// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module", "@prisma/nuxt", "@pinia/nuxt"],
  typescript: {
    typeCheck: false,
  },
  nitro: {
    storage: {
      redis: {
        driver: "redis",
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
      },
    },
    experimental: {
      openAPI: true,
    },
    openAPI: {
      route: "/_docs/openapi.json",
      ui: {
        scalar: {
          route: "/_docs/scalar",
        },
        swagger: {
          route: "/_docs",
        },
      },
    },
  },
});
