---
title: Using the Linkding bookmark manager as a CMS for Hugo blogrolls
date: 2025-12-13
draft: false
description: Approximating the convenience of a retweet without a backend.
---

![linkding](./linkding.png)

I want the ability to easily share tagged links to this website, inspired by the blogrolls of yore (shoutout to [sethmlarson](https://sethmlarson.dev/blogroll)).

This is a static hugo site, though. I have no interest in creating a commit just to make new links appear.

I could have called this post "Using linkding as a content management system (CMS) for a hugo blogroll" but

## Linkding, my bookmark manager

Incidentally, I recently spun up a [linkding](https://linkding.link) instance to unify my bookmark collection and was delighted to discover that it has a **public sharing** feature.  You can see [my shared instance here](https://links.subdavis.com/bookmarks/shared).

This is the perfect tool for creating structured link data legible to Hugo!

There's [a convenient API](https://linkding.link/api/#bookmarks) and `/api/bookmarks/shared` does not require an auth token.

The same thing could probably be [achieved with Linkwarden](https://docs.linkwarden.app/api/api-introduction).

## Adding a link

To share a link to this site, all I need to do is bookmark it with Linkding and check the "Share" option. The chrome extension is shown below.

![Linkding extension](./linkding-retweet.png)

## Generating a Hugo page from Linkding data

Hugo generates pages from markdown and structured yaml data. I can curl my public bookmarks and write them out as json in the hugo data directory.

### `./data/retweets.json`

```bash
curl https://links.subdavis.com/api/bookmarks/shared/ | jq > data/retweets.json
```

### `content/retweets.md`

A static page definition

```
---
title: Retweets
type: retweets
---

Page footer content goes here.
```

### `./layouts/retweets/single.html`

A page render template. Mine can be [seen here](https://github.com/subdavis/subdavis.github.io/blob/main/layouts/retweets/single.html).

```html
{{ define "main" }}
<article>
  <h1>{{ .Title }}*</h1>
  {{ if .Site.Data.retweets }}
  <ul>
    {{ range .Site.Data.retweets.retweets }}
    <li>
      <a href="{{ .url }}">{{ .title }}</a>
      {{ if .tag_names }}
      <span>
        {{ range .tag_names }}
          <span>{{ . }}</span>
        {{ end }}
      </span>
      {{ end }}
      {{ if .description}}
      <span>{{ .description }}</span>
      {{ end }}
    </li>
    {{ end }}
  </ul>
  {{ else }}
  <p>No retweets yet.</p>
  {{ end }}
</article>
{{ end }}
```

## Nightly GitHub Action

* Action definition: https://github.com/subdavis/subdavis.github.io/blob/main/.github/workflows/fetch-retweets.yml
* Run example: https://github.com/subdavis/subdavis.github.io/actions/workflows/fetch-retweets.yml

Runs nightly, and if a change is committed, a new build in CloudFlare Pages is triggered.

## The result

I now have a "blogroll" style page thing at [/retweets](/retweets)
