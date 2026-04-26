---
title: Cache busting Hono CSS for Cloudflare Workers
date: 2026-04-25
description: Without a(nother) build tool.
---

[Hono JS](https://hono.dev/) is a barebones framework I've used on projects recently to write server side JSX.

You can bundle any static assets you like and ship them to be served alongside your worker app, but these are not esbuild artifacts and are never touched by a build tool.

**There is no cache busting**, so I made my own simple pre-build step to add file hashes.

My only point in jotting this down is that you don't necessarily need to adopt Vite or Webpack for small capabilities like this, or understand the depths of Clouflare cache controls.

## `scripts/build-css.sh`

```bash
#!/bin/bash
yarn build:css
newname=main.$(md5sum public/styles/main.css | cut -c 1-8).css
cp public/styles/main.css public/styles/$newname
echo "main.css -> $newname"

# Now replace all references to main.css in the built files with the new name
if [[ "$OSTYPE" == "darwin"* ]]; then
    grep -l -r "/styles/main.css" src | xargs sed -i '' "s/main\.css/$newname/g"
else
    grep -l -r "/styles/main.css" src | xargs sed -i "s/main\.css/$newname/g"
fi
```

## `package.json`

```json
{
  "scripts": {
    // The development server
    "dev": "concurrently -n css,worker -c cyan,magenta \"yarn dev:css\" \"yarn dev:worker\"",
    "dev:css": "npx @tailwindcss/cli -i src/styles/main.css -o public/styles/main.css --watch",
    "dev:worker": "wrangler dev",
    // The production deployment
    "build:css": "npx @tailwindcss/cli -i src/styles/main.css -o public/styles/main.css --minify",
    "deploy": "./scripts/build-css.sh && wrangler deploy",
  },
}
```

I included the development server just to illustrate that this is a production-only fix. None of the guides for Tailwind + Hono call out the cache busting problem, so here's mine.