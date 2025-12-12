---
title: The one-click Navidrome bandcamp purchase sync
date: 2025-12-06
description: I made it so buying music is (almost) as easy as stealing it.
---

![My setup](./diagram.svg)

## Why is buying music so inconvenient?

It's kind of insane that setting up a piracy stack is somehow easier than regularly purchasing and downloading music in a way that supports the artist.

Read [this setup guide](https://ndeast.com/posts/death-to-spotify/#) for example. Toward the bottom of that article, Nik documents his end-to-end purchase workflow. It's horrible. It takes ~10 manual steps and 4 different websites to... buy an album.

There are powerful, convenient tools for torrenting. But if you want to buy things, the only platform not aggressively doing vendor ecosystem lock-in is Bandcamp. It has no consumer-facing API, its app kinda sucks, and there's no good way to grab your purchases except one-at-a-time through the browser.

## Navidrome and Lidarr

I do use Lidarr for some things, but I keep the lidarr library completely separate from my bandcamp purchases.

I ran into trouble trying to download bandcamp albums into a directory that lidarr controls becuase the file structure and naming lidarr picks are different. This breaks bandcampsync's ability to determine whether or not it has already downloaded something to skip it.

Navidrome supports **indexing multiple library folders**, and will serve them all as if they were one librar. This works perfectly, so I keep them separate now.  See the diagram above.

## The one-click workflow

![Sync screenshot](./sync.png)

Until bandcamp build webhooks (fat chance), you need at least 1 click to trigger a re-scan of your purchases.

* Buy an album on Bandcamp
* Swap over to my Bandcamp Sync Flask instance and click "Run sync". It pulls every purchase into `/music_other`
* Navidrome discovers the new files. Lidarr is not involved.

Stuff should appear in your media player instantly. Bandcamp's file downloads are already well-tagged so Lidarr would only get in the way.

## The repo: Bandcamp Sync Flask

https://github.com/subdavis/bandcamp-sync-flask

Credit and kudos to [BandcampSync](https://github.com/subdavis/bandcamp-sync-flask?tab=readme-ov-file) which is the script this app wraps.

## Comments

> All this fuss about metadata seems like unneeded headache. A music library should be listened to on global shuffle, and if the RNG takes you straight from "Carolina in my Mind" to "Stupid Horse" then is that so bad? - Hastings Greer