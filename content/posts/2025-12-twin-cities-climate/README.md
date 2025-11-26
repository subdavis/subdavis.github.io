## Data

Fetch data with `./utils.sh ./data`

./data contains historical climate data

Columns are `Temperature High, Temperature Low, Precipitation, Snowfall, Snow Depth`

Letter codes: `key: T=trace | M=missing | S=multi-day value follows | A=multi-day value | blank=unknown`

## Analyses

* `snow_days_by_year.json`:
    * Data series 1: Number of days with snow on ground per year
    * Data series 2: Number of days with measurable snowfall per year
* `snow_cycles_by_year.json`:
    * Data series 1: Number of transitions between snow on ground and no snow on ground per year
    * Data series 2: Freeze-thaw cycles (count of days where the high is above freezing and the low is below freezing) per year
* `avg_daily_lows_by_season.json`:
    * Data series 1: Average daily low for summer months (Jun-Aug) per year
    * Data series 2: Average daily low for fall months (Sep-Nov) per year
    * Data series 3: Average daily low for winter months (Dec-Feb) per year
    * Data series 4: Average daily low for spring months (Mar-May) per year
* `average_temp_spread_by_month.json`:
    * For each data series, the difference between the daily high and low temperature
    * Data series 1: The average daily temp spread for each November over time
    * Data series 2: The average daily temp spread for each December over time
    * Data series 3: The average daily temp spread for each January over time
    * Data series 4: The average daily temp spread for each February over time
    * Data series 5: The average daily temp spread for each March over time
* `avg_monthly_temp.json`:
    * Average temperature per month over time

## Python environment

There is already a virtual environment set up for this analysis and managed with `mise`.  No need to configure your own.