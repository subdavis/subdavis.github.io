# subdavis.github.io

> nuxt static personal site

**Source for [https://subdavis.com](https://subdavis.com)**

Statically compiled, minified, and with no javascript at all.

* font awesome
* tailwind css

## Why all this

I like keeping up with the Vue world, but I want my personal site to be as lightweight as possible.

Samantha Ming's [VuePress site](https://www.samanthaming.com/blog/building-my-new-site-with-vuepress/) represents what I wanted pretty well, but I don't have a blog, so the markdown capabilities of VuePress aren't appealing to me.  Nuxt seems to have more build-enhancing opportunities, such as CSS and JS purging.

You can browse through my nuxt and tailwind config for the special tweaks I've added.  There are links to github issues explaining why each change was necessary.

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# generate static project
$ yarn generate

# serve compiled assets
$ yarn start
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
