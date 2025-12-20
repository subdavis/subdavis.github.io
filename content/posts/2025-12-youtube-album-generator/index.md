---
title: Generate live albums from YouTube videos with ffmpeg
date: 2025-12-18
draft: false
description: I love live albums, but it can be difficult to find digital copies.
---

![navidrome.png](./navidrome.png)

There are plenty of high-quality full length concerts available on youtube.  It only recenlty occurred to me that I could just turn these into my own bootleg live albums.

## Step 1: Manifest file

Make a new text file that follows this template.

```
artist: CHVRCHES
album: Live at Glastonbury 2016
date: 2016
source: https://www.youtube.com/watch?v=jIbRto7TQ30
---
02:45 Never Ending Circles
05:56 We Sink
09:54 Keep You on My Side
14:24 Make Them Gold
19:31 Gun
23:21 Bury It
26:59 High Enough to Carry You Over
31:32 Empty Threat
35:59 Recover
40:09 Clearest Blue
```

## Step 2: Run the script

The script downloads the video with [yt-dlp](https://github.com/yt-dlp/yt-dlp) and transforms it using ffmpeg. ffmpeg even supports [ID3 metadata](https://id3.org/) tagging.

`./annotate_v2.py my_manifest.txt`

## Results

Now you've got an album directory. You can drop a file called `cover.jpg` in if you want, but it's optional.

```
➜  output git:(main) ✗ ls -T ./CHVRCHES/
./CHVRCHES
└── 'Live at Glastonbury 2016'
    ├── '01 - Never Ending Circles.mp3'
    ├── '02 - We Sink.mp3'
    ├── '03 - Keep You on My Side.mp3'
    ├── '04 - Make Them Gold.mp3'
    ├── '05 - Gun.mp3'
    ├── '06 - Bury It.mp3'
    ├── '07 - High Enough to Carry You Over.mp3'
    ├── '08 - Empty Threat.mp3'
    ├── '09 - Recover.mp3'
    ├── '10 - Clearest Blue.mp3'
    └── cover.png
```

Done. This was a one-shot with Claude Opus 4.5 and I've now made a dozen new live albums. I'm aware that you could embed the art direclty into the mp3 files, but I'm too lazy for that.

## Navidrome setup

The "album" wont match anything on MusicBrainz, so IMO it's best to keep them in their own siloed library away from Lidarr or any other metadata automation you might have running.  Navidrome supports serving multiple root directories.

## GitHub repository

https://github.com/subdavis/youtube-album-generator

## rsync it to Navidrome

Alright, now push it to the sever.

```bash
rsync -avz --ignore-errors --no-o --no-g --exclude data/output/ user@host:/media/4tb/music_manual
```

## Bonus: Audiotree

In case you didn't know, you actually _can_ buy [audiotree sessions on bandcamp](https://audiotree.bandcamp.com/)! My favorite so far is [mewithoutYou from 2016](https://www.youtube.com/watch?v=Kfn57_QqprE) during the Pale Horse tour.