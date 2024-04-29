// https://nuxt.com/docs/api/configuration/nuxt-config
export default ({
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      title: 'IntuiBoard',
      meta: [
        { name: 'description', content: 'IntuiBoard' },
      ],
    },
  },
  devtools: { enabled: true },
  modules: [
    'nuxt-icon',
    'nuxt-primevue',
  ],
  typescript: {
    typeCheck: true,
    strict: true,
  },
  primevue: {
    components: {
      include: ['Chart', 'Button'],
      exclude: ['Editor'],
    },
  },
});
