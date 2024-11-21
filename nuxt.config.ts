// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  app: {
    head: {
      title: 'WMDB - WEXO Movie Database',
      meta: [
        { name: 'description', content: 'Lorem, ipsum.' },
      ],
    },
  },
  compatibilityDate: '2024-04-03',
  runtimeConfig: {
    public: {
      tmdbApiKey: process.env.NUXT_TMDB_API_KEY,
      tmdbReadAccessToken: process.env.NUXT_TMDB_API_READ_ACCESS_TOKEN,
      baseURL: process.env.NUXT_BASE_URL,
    },
  },
  ssr: false, // Set rendering to SPA as SSR is not needed
  srcDir: 'src/', // Set source folder to keep a more organized structure
  alias: {
    '@': fileURLToPath(new URL('./src/', import.meta.url)), // Set @ as root alias
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
