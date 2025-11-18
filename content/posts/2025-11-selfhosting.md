---
title: Self-hosting Sustainably
date: 2025-11-16
description: With docker compose and not much else.
---

At some point, every home server operator loses steam. After 6+ years running ~20 applications on a home server, I wish only for things to work properly and not waste my time.

If you're anything like me, **docker compose is probably all you need.**

[Here is my full configuration](https://github.com/subdavis/selfhosted)

## My needs

Any conversation about the "right" setup should be grounded in goals. These are mine.

* A bunch of network-reachable applications
* Some reachable over public internet
* Some behind SSO, IP Whitelist, or both
* Running as <app>.subdavis.com
* Plus DNS filtering via AdGuardHome

I no longer value arcane wisdom earned through [suffering](https://immich.app/cursed-knowledge).

## 10 year old hardware

* An old 2010s Dell Optiplex Core i3, 8GB RAM
* Rehoused in a Fractal Design Node 304 Mini-ITX
* With a 4TB media HDD
* And a 2-Drive 2TB RAID-1 MDADM array for more important data
* And another 1TB HDD for backups

## Everything is ~~computer~~ docker compose

My basic philosophy is that I should be able to get this junk running on new or reimaged hardware in a couple hours if needed. I can `apt dist-upgrade` worry-free. Docker's restart policy has never betrayed me the way [systemd repeatedly has.](https://nosystemd.org/).

## A little bit of systemd, though

systemd starts dockerd, which takes care of bringing up the compose stack on restart or container failure. Docker handles dependency constraints with grace.

One extra need is for the external disks to be mounted properly before docker even tries to start. fstab can create race conditions, but systemd allows you to set mount dependencies on services, which is quite handy.

```conf
[Unit]
Description=RAID1

[Mount]
What=/dev/md0
Where=/media/primary
Type=ext4
Options=defaults,auto,noatime,exec

[Install]
WantedBy=docker.service
```

## Traefik is whatever, man

I use [traefik](https://traefik.io/traefik). I learned it back when I had more energy for such things. I geniunely like its tag-based config because it keeps my `docker-compose.yml` modular and clean, but traefik config is verbose and annoying to troubleshoot. If I were starting over today I might try [caddy](https://caddyserver.com/).

Still, the Letsencrypt support and Cloudflare companion have never let me down. Often, my new hostname has registered and is ready to serve traffic before the new app has even booted.

## Tired of fighting DNS

Maybe 6-8x per year, AdGuardHome goes down. Last year a slowly failing power supply lead to a lot of random system crashes. On this matter I have moved past depression to acceptance.

If you, too, feel traumatized by `dhcp-option=6`, I recommend giving up on your end user device discovery dreams and dealing with DNS at the router instead.

I run dnsmasq on my Edgerouter, redirect all DNS queries to my adguard instance wit NAT, and have a NAT rule enable/disable switch I can throw to take my AdGuardHome instance out of the critical path of internet access. [I wrote about that here.](https://github.com/subdavis/selfhosted/blob/main/docs/pihole-dnsmasq.md)

(The NAT rule is necessary regardless of your config because plenty of IoT devices hard-code their DNS anyway. Looking at you, Philips Hue Bridge)

## Wireguard? 🙅 Tailscale? 👍

Wireguard config has consumed many hours of my life. The final straw was tweaking MTU while dealing with packet loss over mobile networks (T Mobile). I noped out and set up Tailscale.

## No more innovation tokens

I started out using [CoreOS](https://en.wikipedia.org/wiki/Container_Linux) which turned out to be foolish because it was abandoned about 2 years later.

I also used to do [insane, truly unhinged shit](https://github.com/subdavis/selfhosted/blob/10f6aef418ffadcb3cefca16f3fad604abfb97a2/minio.service) with `systemd`. I believed that `docker compose` was not a valid substitue for an init system, whatever that means. Don't be like me.

Unnecessary complexity is fine for learning. A particular choice may emerge out of a desire for novelty or fun or curiosity, but be clear-eyed, lest you confuse these indulgences with actual improvements. It's perfectly reasonable to tire of tinkering with complicated setups. Using docker compose isn't admitting defeat.

Keep it simple, stupid.
