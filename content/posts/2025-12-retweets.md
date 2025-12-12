---
title: Retweets
date: 2025-01-01
draft: true
description: Using a static site generator and bookmarks
---

If you aren't interested in the grand human project of getting away from social media (companies), you can safely close this tab.

## What's a retweet?

I want the ability to very easily publish links to this website. I was inspired by the blogrolls of yore (shoutout to [sethmlarson](https://sethmlarson.dev/blogroll)).

This is a static hugo site, though. I have no interest in making a commit for something that should be as frictionless as a retweet.

## Linkding

I recently spun up a [linkding](https://linkding.link) instance to unify my bookmark collection.

I discovered it has a **public sharing** feature.  You can see [my shared instance here](https://links.subdavis.com/bookmarks/shared).

It occurred to me that I could simply auto-generate a blogroll from bookmarks inside linkding.

There's even [a convenient API](https://linkding.link/api/#bookmarks). The docs don't mention that when you use `/api/bookmarks/shared` no auth token is required!

## Scripting Hugo Data Generation

Hugo generates pages from markdown and structured yaml data.

All I have to do is curl my public bookmarks and write them out as yaml in the hugo data directory.

[Check out that script.](#appendix-a)

## Nightly GitHub Action

## The result

Check out my retweet blogroll page thing at [/retweets](/retweets)

## Appendix A

```js
#!/usr/bin/env node

/**
 * Fetches bookmarks from a linkding server and writes them as YAML.
 *
 * Usage:
 *   LINKDING_URL=https://your-linkding.com node scripts/fetch-retweets.js
 *
 * Optional:
 *   LINKDING_LIMIT=100    # Max bookmarks to fetch (default: 100)
 */

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const LINKDING_URL =
  process.env.LINKDING_URL ||
  "https://links.subdavis.com/api/bookmarks/shared/";
const LINKDING_LIMIT = process.env.LINKDING_LIMIT || 100;

async function fetchBookmarks() {
  const url = new URL("/api/bookmarks/shared/", LINKDING_URL);
  url.searchParams.set("limit", LINKDING_LIMIT);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `Failed to fetch bookmarks: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

function transformBookmarks(bookmarks) {
  return bookmarks.map((bookmark) => {
    const item = {
      url: bookmark.url,
      title: bookmark.title || bookmark.url,
      date_added: bookmark.date_added,
      tags: bookmark.tag_names || [],
    };

    if (bookmark.description) {
      item.description = bookmark.description;
    }

    return item;
  });
}

async function main() {
  try {
    console.log(`Fetching bookmarks from ${LINKDING_URL}`);

    const data = await fetchBookmarks();
    console.log(`Found ${data.results.length} bookmarks`);

    // Sort by date_added descending (newest first)
    const bookmarks = data.results.sort(
      (a, b) => new Date(b.date_added) - new Date(a.date_added)
    );

    const transformed = transformBookmarks(bookmarks);
    const yaml = YAML.stringify({ retweets: transformed });

    const outputPath = path.join(__dirname, "..", "data", "retweets.yaml");
    fs.writeFileSync(outputPath, yaml);

    console.log(`Wrote ${bookmarks.length} retweets to ${outputPath}`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
```