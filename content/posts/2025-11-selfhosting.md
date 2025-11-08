---
title: Self-hosting Sustainably
date: 2025-11-07
draft: true
description: How I learned to do less and stop chasing shiny objects.
---

At some point, every self-hosting enthusiast loses steam. After 6+ years of running ~20 applications on a home server, I value reliability and simplicity over just about everything else.

**docker compose is probably all you need.**

[Here is my full configuration](https://github.com/subdavis/selfhosted)

## My needs

Any conversation about the "right" setup should be grounded in needs. These are mine.

* A bunch of network-reachable applications
* Some reachable over public internet
* Some behind SSO, IP Whitelist, or both.
* Running as <app>.subdavis.com
* Plus DNS filtering via AdGuardHome

I no longer care about acquiring arcane knowledge through suffering.

## 10 year old hardware

* An old 2010s Dell Optiplex Core i3 with 8GB RAM
* Rehoused in a Fractal Design Node 304 Mini-ITX
* With a 4TB media HDD
* And a 2-Drive 2TB RAID-1 MDADM array for more important data
* And another 1TB HDD for backups

## Everything is ~~computer~~ docker compose

My basic philosophy is that I should be able to get this junk running on new or reimaged hardware in a couple hours if needed. I can do a dist upgrade totally worry-free. Docker's restart policy has never failed me the way [systemd repeatedly has.](https://nosystemd.org/).

## A little bit of systemd

A necessary evil, systemd starts dockerd, which takes care of bringing up the compose stack on restart or container failure. It handles dependency constraints with grace and dignity.

One extra need is for the external disks to be mounted properly before docker even tries to start. systemd allows you to set mount dependencies on services, which is quite handy.

```conf
[Unit]
Description=RAID1

[Mount]
What=/dev/md0
Where=/media/primary
Type=ext4
Options=defaults,auto,noatime,exec

[Install]
WantedBy=multi-user.target
```

## Traefik is whatever, man

I use [traefik](https://traefik.io/traefik). I learned it back when I had more energy for such things. If I were starting over today I might try [caddy](https://caddyserver.com/). I geniunely like tag-based config because it keeps my `docker-compose.yml` modular and clean, but traefik config is verbose and annoying to troubleshoot.

Still, the Letsencrypt support and Cloudflare companion have never let me down. Often, my new hostname has registered and is ready to serve traffic by the time the service is stood up.

## Tired of fighting DNS

6-8 times a year, AdGuardHome goes down. Last year a slowly failing power supply lead to random system crashes. On this matter I have moved past depression and into acceptance.

If you, too, feel traumatized by `dhcp-option=6`, I recommend giving up on your end user device discovery dreams and dealing with DNS at the router instead.

I run dnsmasq on my Edgerouter, redirect all DNS queries to my adguard instance with NAT, and have a NAT rule enable/disable switch I can throw to take my home server out of the critical path of internet access if needed.

(This is necessary whether you try to configure DNS via DHCP or not since plenty of IoT devices hard-code their DNS anyway. Looking at you, Philips Hue Bridge)

## Wireguard? 🙅 Tailscale? 👍

Wireguard config has eaten more hours of my life than I care to say. The final straw was fiddling with MTU while dealing with packet loss over mobile networks (T Mobile). I noped out and set up Tailscale. Not a single problem since.

## No more innovation tokens

I started out using [CoreOS](https://en.wikipedia.org/wiki/Container_Linux) which turned out to be stupid because it was abandoned about 2 years after I adopted it. Never again will I look beyond Ubuntu.

I also used to do [insane, truly unhinged shit](https://github.com/subdavis/selfhosted/blob/10f6aef418ffadcb3cefca16f3fad604abfb97a2/minio.service) with `systemd`. I believed that `docker compose` was not a valid substitue for an init system, whatever that means. Don't be like me.

Unnecessary complexity is fine for learning, but be prepared to burn out. It's perfectly reasonable to tire of tinkering with complicated setups. Docker compose is not somehow a retreat to noob technology.

A particular choice may emerge out of a desire for novelty or fun or curiosity, but be clear-eyed, lest you confuse these indulgences with actual improvements.

Keep it simple, stupid.
