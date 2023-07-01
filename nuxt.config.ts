// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.7.107/build/pdf.min.js' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.7.107/web/pdf_viewer.min.css' }
      ]
    }
  },
  devServerHandlers: []
})