const title = 'Brandon Davis'
const description = `UNC alum and software engineer.
  I love experimenting with code, discovering new places,
  and reading about space exploration`
const image = 'https://subdavis.com/img/li.jpg'
const url = 'https://subdavis.com'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: description },
      // facebook
      { property: 'og:title', content: title },
      { property: 'og:site_name', content: 'subdavis.com' },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      // twitter
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@subdavis' },
      { name: 'twitter:creator', content: '@subdavis' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:url', content: url }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/imagemin-module
    // '@nuxtjs/imagemin',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // Doc: https://github.com/nuxt-community/fontawesome-module
    ['@nuxtjs/fontawesome', {
      component: 'fa',
      useLayers: false,
      icons: {
        brands: [
          'faGithub',
          'faLinkedin',
          'faSnapchatGhost',
          'faKeybase',
          'faGoodreads'
        ]
      }
    }]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  purgeCSS: {
    whitelistPatterns: [/-fa$/, /^fa-/]
  }
}
