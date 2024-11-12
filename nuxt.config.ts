// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  runtimeConfig: {
    public: {
      tmdbApiKey: process.env.NUXT_TMDB_API_KEY,
      tmdbReadAccessToken: process.env.NUXT_TMDB_API_READ_ACCESS_TOKEN,
    },
  },
  ssr: false, // Set rendering to SPA as SSR is not needed
  srcDir: 'src/', // Set source folder to keep a more organized structure
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
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
