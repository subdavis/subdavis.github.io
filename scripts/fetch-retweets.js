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
