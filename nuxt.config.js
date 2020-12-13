const cheerio = require('cheerio');

const title = 'Brandon Davis'
const description = `UNC alum and software engineer.
  I love experimenting with code, discovering new places,
  and reading about space exploration`
const image = 'https://subdavis.com/img/li.jpg'
const url = 'https://subdavis.com'

export default {
  target: 'static',
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

  render: { resourceHints: false },

  hooks: {
    // Purge javascript
    // https://github.com/nuxt/nuxt.js/issues/2822
    'generate:page': (page) => {
      const doc = cheerio.load(page.html)
      doc('body script').remove()
      doc('link[rel=preload]').remove()
      doc('body').append(`
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GT15TTB3YP"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-GT15TTB3YP');
        </script>`.replace('\n', ''));
      page.html = doc.html()
    }
  },
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
          'faTwitter',
          'faLinkedin',
          'faKeybase',
          'faGoodreads'
        ]
      }
    }],
  ],

  purgeCSS: {
    // https://github.com/nuxt/nuxt.js/issues/6565
    // https://github.com/vaso2/nuxt-fontawesome/issues/9
    whitelistPatterns: [/-fa$/, /^fa-/]
  },
}
