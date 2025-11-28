---
title: How is our winter changing in the Twin Cities?
date: 2025-11-26
description: A scientific(ish) look at historical winter climate trends in the Twin Cities beyond average temperature increases.
chartjs: true
draft: true
---

## What does winter feel like

I sometimes hear about how winters are [nothing like they used to be](https://www.reddit.com/r/TwinCities/comments/1oh38gt/winters_are_not_what_they_used_to_be/). Were they really [worse in the 80s](ttps://1037theloon.com/minnesota-winters-really-were-worse-in-the-70s-80s/)?

Memory is foggy. Averages and trendlines can be hard to relate to subjective personal experience. The average annual temperature in Minnesota has increased by 3.2°F[^1] between 1895 and 2024, but a ~0.5 degree per decade increase is not something you can feel year to year.

Still, the Twin Cities are experiencing climate change. That mostly means more variable weather patterns. Bigger swings, not just steady warming. Can we see that in the data?

## Snowfall trends

Snowfall is probably the biggest factor for of how a winter is remembered.

There are some trends in first-order measures of snowfall, but they may not be what you expect. Both total snowfall and variability from winter to winter are **increasing**. Variability is actually down somewhat since an elevated period from about 1970 to 2010.

My rolling standard deviation is somewhat arbitrary, so I included both a 20 year and a 30 year to show sensitivity to the window size.

{{< chart src="analysis/total_snowfall_by_year.json" >}}

Something to keep in mind here is that regional seasonal snowfall is **not normally distributed**. The curve is skewed right, with a longer tail of very snowy winters.

{{< chart src="analysis/snowfall_distribution.json" >}}

{{< chart src="analysis/snowfall_rolling_boxplot.json" >}}

Let's check how many snow days there were, and how much of the winter included ground cover.

There is a clear **decreasing trend** of days with ground cover, but it's actually falling back toward levels from the early 20th century from a peak in the 50s.

{{< chart src="analysis/snow_days_by_year.json" >}}

I also looked at freeze-thaw cycles and "snow cycles", the number of times snow cover appears and disappears completely, which I just made up. These have both remained **relatively stable** and **very weakly correlated**.

An R value of 0.12 can be read as "Time (or, climate change) explains only 1.5% of the variation in snowfall totals. The other 98.5% is random year-to-year variation". 

{{< chart src="analysis/snow_cycles_by_year.json" >}}

## Temperature variability

Winter **low** temperatures are less stable and **warming faster** than other parts of the year.

{{< chart src="analysis/avg_daily_lows_by_season.json" >}}

In context, the global warming rate is about +0.36°F per decade since 1982[^2]. Northern Minnesota is warming even faster.

![Northern Minnesota is warming faster](./images/climate-change-northern-minnesota-warming-faster.png)

## Pivot at 1950 vs 1970

Climate trend lines intended to show deviation from historical patterns often begin in either 1950 or 1970. It's not arbitrary.

* 1950 is considered the inflection point of human-caused greenhouse gas emmisions, sometimes called the "Great Acceleration".
* But until 1970, the affects of arisols in the atmosphere artifically suppressed those trends, and data collection/instrumentation was less reliable.

## Conclusion

There is so much long-term variability that any single person's childhood experience is more likely to be selective memory (e.g., vividly remembering the magically snowy winters and collapsing the mild ones) than an indicator of climage-change-driven trends. These trends are very real, but subtle and difficult to perceive with anecdotal evidence.

Next time your friends or relatives complain about changing winters, send them this post!

## Explore yourself

You can do a lot using the [DNR Minnesota Climate Explorer](https://climate-explorer.dnr.state.mn.us/main/historical). For some of my own analysis, I verified my numbers against their tool.

![Climate Explorer](./images/climate-explorer-2.png)

### Data and Analysis Tools

All the data and code used for this post is available on [GitHub](https://github.com/subdavis/subdavis.github.io/tree/main/content/posts/2025-12-twin-cities-climate). I've mainly used Python with Pandas and Chart.js for the visualizations.

The Minnesota DNR provides histoirical daily climate data going back to the 1870s [on their website](https://www.dnr.state.mn.us/climate/twin_cities/listings.html). The downloads are all broken, but I was able to scrape them directly and explain how in the code repository `README.md`.

### Disclaimer

I'm not a climate scientist or a statistician. I was interested in seeing second-order measures of variability that I've never really seen discussed in an emperical way.

[^1]: [Minnesota Climate Change Trends](https://climate.umn.edu/MNclimate)
[^2]: [NOAA Climate.gov](https://www.climate.gov/news-features/understanding-climate/climate-change-global-temperature)
[^3]: [Trends in atmospheric CO2: NOAA](https://gml.noaa.gov/ccgg/trends/data.html). 