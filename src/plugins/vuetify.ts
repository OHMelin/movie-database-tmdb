import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            wexo: '#0b1b38',
            slate: '#6c49eb',
          },
        },
        dark: {
          dark: true,
          colors: {
            wexo: '#0b1b38',
            slate: '#6c49eb',
          },
        },
      },
    },
  })
  app.vueApp.use(vuetify)
})
