"""
Twin Cities Climate Data Explorer

A package for analyzing historical climate data from the Twin Cities area.
"""

from .utils import (
    compute_linear_regression,
    parse_value,
    load_decade,
    load_all_data,
    get_valid_years,
    run_analysis,
)

from .snow_days import analyze_snow_days_by_year
from .snow_cycles import analyze_snow_cycles_by_year
from .daily_lows import analyze_avg_daily_lows_by_season
from .monthly_temp import analyze_avg_monthly_temp
from .total_snowfall import analyze_total_snowfall_by_year
from .snowfall_distribution import analyze_snowfall_distribution
from .snowfall_boxplot import analyze_snowfall_rolling_boxplot
from .co2 import analyze_co2, load_co2_data
from .snow_event_duration import analyze_snow_event_duration

__all__ = [
    "compute_linear_regression",
    "parse_value",
    "load_decade",
    "load_all_data",
    "get_valid_years",
    "run_analysis",
    "analyze_snow_days_by_year",
    "analyze_snow_cycles_by_year",
    "analyze_avg_daily_lows_by_season",
    "analyze_avg_monthly_temp",
    "analyze_total_snowfall_by_year",
    "analyze_snowfall_distribution",
    "analyze_snowfall_rolling_boxplot",
    "analyze_co2",
    "load_co2_data",
    "analyze_snow_event_duration",
]
