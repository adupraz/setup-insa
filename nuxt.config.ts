// https://nuxt.com/docs/api/configuration/nuxt-config

const ONE_DAY = 60 * 60 * 24 * 1000;
const ONE_WEEK = ONE_DAY * 7;


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

  runtimeConfig: {
    cookieName: "__intuiboard",
    cookieSecret: "secret",
    cookieExpires: ONE_DAY.toString(),
    cookieRememberMeExpires: ONE_WEEK.toString(),
  }
});
