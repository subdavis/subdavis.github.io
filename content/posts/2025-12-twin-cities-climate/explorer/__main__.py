"""
Main entry point for running all climate analyses.
"""

import json
from pathlib import Path

from .utils import load_all_data, run_analysis
from .snow_days import analyze_snow_days_by_year
from .snow_cycles import analyze_snow_cycles_by_year
from .daily_lows import analyze_avg_daily_lows_by_season
from .monthly_temp import analyze_avg_monthly_temp
from .total_snowfall import analyze_total_snowfall_by_year
from .snowfall_distribution import analyze_snowfall_distribution
from .snowfall_boxplot import analyze_snowfall_rolling_boxplot
from .snow_event_duration import analyze_snow_event_duration
from .co2 import analyze_co2


def run_all_analyses() -> None:
    """Run all analysis functions and save results."""
    df = load_all_data()
    print(f"\nLoaded {len(df):,} records from {df['date'].min()} to {df['date'].max()}")
    
    print("\nRunning analyses...")
    
    analyses = [
        (analyze_snow_days_by_year, "snow_days_by_year"),
        (analyze_snow_cycles_by_year, "snow_cycles_by_year"),
        (analyze_avg_daily_lows_by_season, "avg_daily_lows_by_season"),
        (analyze_avg_monthly_temp, "avg_monthly_temp"),
        (analyze_total_snowfall_by_year, "total_snowfall_by_year"),
        (analyze_snowfall_distribution, "snowfall_distribution"),
        (analyze_snowfall_rolling_boxplot, "snowfall_rolling_boxplot"),
        (analyze_snow_event_duration, "snow_event_duration"),
    ]
    
    for func, name in analyses:
        run_analysis(df, func, name)
    
    # Run CO2 analysis (uses its own data source)
    output_dir = Path(__file__).parent.parent / "analysis"
    output_dir.mkdir(exist_ok=True)
    co2_result = analyze_co2()
    co2_path = output_dir / "co2.json"
    with open(co2_path, "w") as f:
        json.dump(co2_result, f)
    print(f"Wrote {co2_path}")
    
    print("\nDone!")


if __name__ == "__main__":
    run_all_analyses()
