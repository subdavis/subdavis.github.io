import { defineNuxtConfig } from 'nuxt/config';
import cheerio from 'cheerio'

const title = 'Brandon Davis'
const description = `Frontend engineer.`
const image = 'https://subdavis.com/img/li.jpg'
const url = 'https://subdavis.com'

export default defineNuxtConfig({
  devtools: { enabled: true },
  /*
  ** Headers of the page
  */
 app: {
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
 },

  // hooks: {
    // Purge javascript
    // https://github.com/nuxt/nuxt.js/issues/2822
  //   'generate:page': (page) => {
  //     const doc = cheerio.load(page.html)
  //     doc('body script').remove()
  //     doc('link[rel=preload]').remove()
  //     doc('body').append(`
  //       <script async src="https://www.googletagmanager.com/gtag/js?id=G-GT15TTB3YP"></script>
  //       <script>
  //         window.dataLayer = window.dataLayer || [];
  //         function gtag(){dataLayer.push(arguments);}
  //         gtag('js', new Date());
  //         gtag('config', 'G-GT15TTB3YP');
  //       </script>`.replace('\n', ''));
  //     page.html = doc.html()
  //   }
  // },
  /*
  ** Nuxt.js dev-modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],
})