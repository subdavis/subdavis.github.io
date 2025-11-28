## Data

Fetch data with `./utils.sh ./data`

./data contains historical climate data

Columns are `Temperature High, Temperature Low, Precipitation, Snowfall, Snow Depth`

Letter codes: `key: T=trace | M=missing | S=multi-day value follows | A=multi-day value | blank=unknown`

## Analyses

Analyses are run in `analysis.py` and generate JSON files in `analysis/` that are rendered as chartjs charts in the post.

Linear regression can be added with `compute_linear_regression` which adds a chartjs line annotation using 2 endpoints and a label.


## Python environment

There is already a virtual environment set up for this analysis and managed with `mise`.  No need to configure your own.