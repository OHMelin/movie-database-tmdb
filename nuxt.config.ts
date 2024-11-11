// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      tmdbApiKey: process.env.NUXT_TMDB_API_KEY,
      tmdbReadAccessToken: process.env.NUXT_TMDB_API_READ_ACCESS_TOKEN,
    },
  },
  compatibilityDate: '2024-04-03',
  ssr: false,
  srcDir: 'src/',
  alias: {
    "@": "/<srcDir>",
  },
  css: [
    "~/assets/main.scss"
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
