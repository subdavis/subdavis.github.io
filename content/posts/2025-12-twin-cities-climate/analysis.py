#!/usr/bin/env python3
"""
Load Twin Cities historical climate data into a pandas DataFrame.

Data columns:
- date: Date of observation
- max_temp: Maximum temperature (°F)
- min_temp: Minimum temperature (°F)
- precipitation: Precipitation (inches)
- snowfall: Snowfall (inches)
- snow_depth: Snow depth (inches)

Letter codes:
- T = trace amount
- M = missing data
- S = multi-day value follows
- A = multi-day value (accumulated)
- blank = unknown
"""

import json
from pathlib import Path
import pandas as pd
import numpy as np
from scipy import stats


def compute_linear_regression(data: list, color: str, label_prefix: str, line_id: str, label_id: str, label_x_pct: float = 0.75) -> dict:
    """
    Compute least squares linear regression for a data series and return Chart.js annotation objects.
    
    Args:
        data: List of y-values (can contain None for missing data)
        color: RGB color string for the line (e.g., "rgb(255, 99, 132)")
        label_prefix: Prefix for the label text (e.g., "Snow Cycles")
        line_id: Unique identifier for the line annotation
        label_id: Unique identifier for the label annotation
        label_x_pct: Position of label along the line as a percentage (0.0 to 1.0)
    
    Returns:
        Dict with two annotation objects: one line and one label
    """
    # Filter out None and NaN values and get corresponding x indices
    valid_points = [(i, v) for i, v in enumerate(data) if v is not None and not (isinstance(v, float) and np.isnan(v))]
    if len(valid_points) < 2:
        return {}
    
    x_vals = np.array([p[0] for p in valid_points])
    y_vals = np.array([p[1] for p in valid_points])
    
    # Perform linear regression
    slope, intercept, r_value, p_value, std_err = stats.linregress(x_vals, y_vals)
    
    # Calculate line endpoints using only the range where data exists
    x_min = int(x_vals.min())
    x_max = int(x_vals.max())
    y_min = intercept + slope * x_min
    y_max = intercept + slope * x_max
    
    # Format slope and r value for label
    slope_per_decade = slope * 10  # Convert to per-decade for readability
    label_content = [
        f"{slope_per_decade:+.2f}/decade [R: {r_value:.3f}]",
    ]
    
    # Position label along the line at specified percentage
    label_x = x_min + (x_max - x_min) * label_x_pct
    label_y = intercept + (slope * label_x)
    
    return {
        line_id: {
            "type": "line",
            "yMin": round(y_min, 2),
            "yMax": round(y_max, 2),
            "xMin": x_min,
            "xMax": x_max,
            "borderColor": color,
            "borderWidth": 2,
            "borderDash": [5, 5]
        },
        label_id: {
            "type": "label",
            "xValue": label_x,
            "yValue": label_y,
            "backgroundColor": "rgba(245,245,245,0.6)",
            "content": label_content,
            "font": {
                "size": 12
            }
        }
    }

def parse_value(val):
    """
    Parse a value from the data, handling special cases.
    
    Letter codes:
    - T = trace amount (returned as 0.001)
    - M = missing data (returned as NaN)
    - S = multi-day value follows (returned as NaN, value is in following 'A' row)
    - A = multi-day accumulated value (parsed normally)
    - blank = unknown (returned as NaN)
    """
    if isinstance(val, list):
        val = val[0]  # First element is the value, second is a flag
    if val == "T":
        return 0.001  # Trace amount
    if val in ("M", "S", ""):
        return np.nan  # Missing, multi-day follows, or unknown
    try:
        return float(val)
    except (ValueError, TypeError):
        return np.nan


def load_decade(filepath: Path) -> list[dict]:
    """Load a single decade's data from a JSON file."""
    with open(filepath) as f:
        data = json.load(f)
    
    records = []
    for row in data["data"]:
        date = row[0]
        records.append({
            "date": date,
            "max_temp": parse_value(row[1]),
            "min_temp": parse_value(row[2]),
            "precipitation": parse_value(row[3]),
            "snowfall": parse_value(row[4]),
            "snow_depth": parse_value(row[5]),
        })
    return records


def load_all_data(data_dir: Path = None) -> pd.DataFrame:
    """Load all climate data from the data directory into a DataFrame."""
    if data_dir is None:
        data_dir = Path(__file__).parent / "data"
    
    all_records = []
    for filepath in sorted(data_dir.glob("twin_cities_*.json")):
        print(f"Loading {filepath.name}...")
        all_records.extend(load_decade(filepath))
    
    df = pd.DataFrame(all_records)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)
    
    # Add derived columns
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["day_of_year"] = df["date"].dt.dayofyear
    df["decade"] = (df["year"] // 10) * 10
    
    # Exclude current year (incomplete data)
    current_year = pd.Timestamp.now().year
    df = df[df["year"] < current_year]
    
    return df


def get_valid_years(df: pd.DataFrame, column: str) -> set:
    """
    Get years that have at least some non-null data for the given column.
    Years with entirely missing data are excluded.
    """
    valid_data = df[df[column].notna()]
    return set(valid_data["year"].unique())


def analyze_snow_days_by_year(df: pd.DataFrame) -> dict:
    """
    Count the number of days with snow depth > 0 and days with snowfall > 0 by year.
    
    Returns:
        Chart.js configuration dict with two datasets
    """
    valid_years = get_valid_years(df, "snow_depth")
    snow_depth_days = df[df["snow_depth"] > 0].groupby("year").size()
    snowfall_days = df[df["snowfall"] > 0].groupby("year").size()
    
    labels = [str(year) for year in sorted(valid_years)]
    depth_data = [int(snow_depth_days.get(year, 0)) for year in sorted(valid_years)]
    fall_data = [int(snowfall_days.get(year, 0)) for year in sorted(valid_years)]
    
    return {
        "type": "line",
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "label": "Days with Snow on Ground",
                    "data": depth_data,
                    "fill": False,
                    "borderColor": "rgb(75, 192, 192)",
                    "tension": 0.1
                },
                {
                    "label": "Days with Snowfall",
                    "data": fall_data,
                    "fill": False,
                    "borderColor": "rgb(54, 162, 235)",
                    "tension": 0.1
                }
            ]
        }
    }


def analyze_snow_cycles_by_year(df: pd.DataFrame) -> dict:
    """
    Count the number of snow cycles and freeze-thaw cycles per year.
    - Snow cycle: when snow depth transitions from >0 to 0 (snow melts completely).
    - Freeze-thaw cycle: days where the high is above freezing and the low is below freezing.
    
    Returns:
        Chart.js configuration dict with two datasets and trend line annotations
    """
    valid_years = get_valid_years(df, "snow_depth")
    
    # Create a boolean series: True when there's snow on the ground
    has_snow = (df["snow_depth"] > 0).fillna(False)
    
    # Detect transitions from snow (True) to no snow (False)
    # Shift forward and compare: previous day had snow, current day doesn't
    snow_melted = has_snow.shift(1) & ~has_snow
    
    # Add to dataframe temporarily for grouping
    df_temp = df.copy()
    df_temp["snow_melted"] = snow_melted
    
    # Count melt events by year
    cycles_by_year = df_temp[df_temp["snow_melted"]].groupby("year").size()
    
    # Freeze-thaw cycles: days where high > 32°F and low < 32°F
    freeze_thaw = (df["max_temp"] > 32) & (df["min_temp"] < 32)
    df_temp["freeze_thaw"] = freeze_thaw
    freeze_thaw_by_year = df_temp[df_temp["freeze_thaw"]].groupby("year").size()
    
    labels = [str(year) for year in sorted(valid_years)]
    snow_cycle_data = [int(cycles_by_year.get(year, 0)) for year in sorted(valid_years)]
    freeze_thaw_data = [int(freeze_thaw_by_year.get(year, 0)) for year in sorted(valid_years)]
    
    # Compute trend line annotations
    snow_cycle_color = "rgb(153, 102, 255)"
    freeze_thaw_color = "rgb(255, 159, 64)"
    
    annotations = {}
    annotations.update(compute_linear_regression(
        snow_cycle_data, snow_cycle_color, "Snow Cycles", "snow_cycle_line", "snow_cycle_label", label_x_pct=0.5
    ))
    annotations.update(compute_linear_regression(
        freeze_thaw_data, freeze_thaw_color, "Freeze-Thaw", "freeze_thaw_line", "freeze_thaw_label", label_x_pct=0.75
    ))
    
    return {
        "type": "line",
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "label": "Snow Cycles (Melt Events)",
                    "data": snow_cycle_data,
                    "fill": False,
                    "borderColor": snow_cycle_color,
                    "tension": 0.1
                },
                {
                    "label": "Freeze-Thaw Cycles",
                    "data": freeze_thaw_data,
                    "fill": False,
                    "borderColor": freeze_thaw_color,
                    "tension": 0.1
                }
            ]
        },
        "annotation": {
            "annotations": annotations
        }
    }


def analyze_avg_daily_lows_by_season(df: pd.DataFrame) -> dict:
    """
    Calculate the average daily low temperature for each season over time.
    - Summer: Jun-Aug
    - Fall: Sep-Nov
    - Winter: Dec-Feb
    - Spring: Mar-May
    
    Returns:
        Chart.js configuration dict with 4 datasets and trend lines for summer/winter
    """
    seasons = {
        "Summer": [6, 7, 8],
        "Fall": [9, 10, 11],
        "Winter": [12, 1, 2],
        "Spring": [3, 4, 5],
    }
    colors = {
        "Summer": "rgb(255, 99, 132)",    # Red/Pink
        "Fall": "rgb(255, 159, 64)",       # Orange
        "Winter": "rgb(54, 162, 235)",     # Blue
        "Spring": "rgb(75, 192, 192)",     # Teal
    }
    
    valid_years = sorted(get_valid_years(df, "min_temp"))
    labels = [str(year) for year in valid_years]
    
    datasets = []
    season_data_map = {}  # Store data for trend line computation
    
    for season_name, months in seasons.items():
        season_data = df[df["month"].isin(months)]
        avg_low_by_year = season_data.groupby("year")["min_temp"].mean()
        
        data = []
        for year in valid_years:
            if year in avg_low_by_year.index:
                val = avg_low_by_year.get(year)
                if pd.notna(val):
                    data.append(round(val, 1))
                else:
                    data.append(None)
            else:
                data.append(None)
        
        season_data_map[season_name] = data
        
        datasets.append({
            "label": f"{season_name} Avg Daily Low (°F)",
            "data": data,
            "fill": False,
            "borderColor": colors[season_name],
            "tension": 0.1,
            "pointRadius": 0
        })
    
    # Compute trend line annotations for all seasons with staggered label positions
    annotations = {}
    annotations.update(compute_linear_regression(
        season_data_map["Summer"], colors["Summer"], "Summer", "summer_line", "summer_label", label_x_pct=0.20
    ))
    annotations.update(compute_linear_regression(
        season_data_map["Fall"], colors["Fall"], "Fall", "fall_line", "fall_label", label_x_pct=0.30
    ))
    annotations.update(compute_linear_regression(
        season_data_map["Winter"], colors["Winter"], "Winter", "winter_line", "winter_label", label_x_pct=0.60
    ))
    annotations.update(compute_linear_regression(
        season_data_map["Spring"], colors["Spring"], "Spring", "spring_line", "spring_label", label_x_pct=0.50
    ))
    
    return {
        "type": "line",
        "data": {
            "labels": labels,
            "datasets": datasets
        },
        "annotation": {
            "annotations": annotations
        }
    }


def analyze_avg_monthly_temp(df: pd.DataFrame) -> dict:
    """
    Calculate average temperature for each month of each year.
    Output is a time series with one data point per month.
    
    Returns:
        Chart.js configuration dict
    """
    # Calculate average temp as midpoint of max and min
    df_temp = df.copy()
    df_temp["avg_temp"] = (df_temp["max_temp"] + df_temp["min_temp"]) / 2
    
    # Find years with no missing temperature data
    yearly_missing = df_temp.groupby("year")["avg_temp"].apply(lambda x: x.isna().sum())
    complete_years = set(yearly_missing[yearly_missing == 0].index)
    
    # Filter to only complete years
    df_complete = df_temp[df_temp["year"].isin(complete_years)]
    
    # Calculate average temp for each year-month combination
    monthly_avg = df_complete.groupby(["year", "month"])["avg_temp"].mean().reset_index()
    monthly_avg = monthly_avg.sort_values(["year", "month"])
    
    # Create labels like "1873-01", "1873-02", etc.
    labels = [f"{int(row['year'])}-{int(row['month']):02d}" for _, row in monthly_avg.iterrows()]
    data = [round(val, 1) for val in monthly_avg["avg_temp"]]
    
    return {
        "type": "line",
        "data": {
            "labels": labels,
            "datasets": [{
                "label": "Avg Monthly Temp (°F)",
                "data": data,
                "fill": False,
                "borderColor": "rgb(255, 99, 132)",
                "tension": 0.1,
                "pointRadius": 0
            }]
        }
    }


def analyze_total_snowfall_by_year(df: pd.DataFrame) -> dict:
    """
    Calculate total snowfall in inches per winter season, plus 20-year rolling variance.
    A winter season runs from November through March (e.g., "1884-85" = Nov 1884 - Mar 1885).
    Starts from 1884 due to missing data in earlier years.
    
    Returns:
        Chart.js configuration dict with two datasets and trend line annotation
    """
    df_snow = df.copy()
    
    # Assign winter season: Nov-Dec belong to current year's winter, Jan-Mar belong to previous year's winter
    # e.g., Nov 1884 -> winter 1884, Jan 1885 -> winter 1884
    df_snow["winter_season"] = df_snow.apply(
        lambda row: row["year"] if row["month"] >= 11 else row["year"] - 1,
        axis=1
    )
    
    # Filter to winter months only (Nov, Dec, Jan, Feb, Mar)
    winter_months = [11, 12, 1, 2, 3]
    df_winter = df_snow[df_snow["month"].isin(winter_months)]
    
    # Get valid winter seasons starting from 1884
    valid_seasons = sorted(s for s in df_winter["winter_season"].unique() if s >= 1884)
    
    # Sum snowfall by winter season
    total_snowfall = df_winter.groupby("winter_season")["snowfall"].sum()
    
    # Create labels like "1884-85", "1885-86", etc.
    labels = [f"{year}-{str(year + 1)[-2:]}" for year in valid_seasons]
    data = [round(total_snowfall.get(year, 0), 1) for year in valid_seasons]
    
    # Calculate 20-year and 30-year rolling standard deviation
    data_series = pd.Series(data)
    rolling_std_20 = data_series.rolling(window=20, min_periods=20).std()
    rolling_std_30 = data_series.rolling(window=30, min_periods=30).std()
    std_data_20 = [round(v, 1) if pd.notna(v) else None for v in rolling_std_20]
    std_data_30 = [round(v, 1) if pd.notna(v) else None for v in rolling_std_30]
    
    # Compute trend line for snowfall totals
    color = "rgb(54, 162, 235)"
    std_color_20 = "rgb(255, 159, 64)"
    std_color_30 = "rgb(153, 102, 255)"
    annotations = compute_linear_regression(
        data, color, "Total Snowfall", "snowfall_line", "snowfall_label", label_x_pct=0.7
    )
    
    return {
        "type": "line",
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "label": "Total Snowfall (inches)",
                    "data": data,
                    "fill": False,
                    "borderColor": color,
                    "tension": 0.1,
                    "borderWidth": 1.5,
                    "yAxisID": "y"
                },
                {
                    "label": "20-Year Rolling Std Dev",
                    "data": std_data_20,
                    "fill": False,
                    "borderColor": std_color_20,
                    "tension": 0.3,
                    "yAxisID": "y1",
                    "pointRadius": 0
                },
                {
                    "label": "30-Year Rolling Std Dev",
                    "data": std_data_30,
                    "fill": False,
                    "borderColor": std_color_30,
                    "tension": 0.3,
                    "yAxisID": "y1",
                    "pointRadius": 0
                }
            ]
        },
        "options": {
            "scales": {
                "y": {
                    "type": "linear",
                    "position": "left",
                    "title": {
                        "display": True,
                        "text": "Snowfall (inches)"
                    }
                },
                "y1": {
                    "type": "linear",
                    "position": "right",
                    "title": {
                        "display": True,
                        "text": "Std Dev (inches)"
                    },
                    "grid": {
                        "drawOnChartArea": False
                    }
                }
            }
        },
        "annotation": {
            "annotations": annotations
        }
    }


def analyze_snowfall_distribution(df: pd.DataFrame) -> dict:
    """
    Create a histogram of total seasonal snowfall distribution.
    Uses 5-inch buckets from 10 to 90 inches.
    Includes Shapiro-Wilk normality test.
    
    Returns:
        Chart.js configuration dict with bar chart
    """
    df_snow = df.copy()
    
    # Assign winter season (same logic as total snowfall analysis)
    df_snow["winter_season"] = df_snow.apply(
        lambda row: row["year"] if row["month"] >= 11 else row["year"] - 1,
        axis=1
    )
    
    # Filter to winter months only
    winter_months = [11, 12, 1, 2, 3]
    df_winter = df_snow[df_snow["month"].isin(winter_months)]
    
    # Get valid winter seasons starting from 1884
    valid_seasons = sorted(s for s in df_winter["winter_season"].unique() if s >= 1884)
    
    # Sum snowfall by winter season
    total_snowfall = df_winter.groupby("winter_season")["snowfall"].sum()
    snowfall_values = [total_snowfall.get(year, 0) for year in valid_seasons]
    
    # Create histogram with 5-inch buckets
    bucket_size = 5
    bucket_min = 10
    bucket_max = 95  # exclusive upper bound
    buckets = list(range(bucket_min, bucket_max, bucket_size))
    
    # Count values in each bucket
    counts = []
    for bucket_start in buckets:
        bucket_end = bucket_start + bucket_size
        count = sum(1 for v in snowfall_values if bucket_start <= v < bucket_end)
        counts.append(count)
    
    # Create labels like "10-15", "15-20", etc.
    labels = [f"{b}-{b + bucket_size}" for b in buckets]
    
    # Calculate mean and std for reference
    mean_snowfall = np.mean(snowfall_values)
    std_snowfall = np.std(snowfall_values)
    
    # Shapiro-Wilk normality test
    shapiro_stat, shapiro_p = stats.shapiro(snowfall_values)
    normality_result = "Normal" if shapiro_p >= 0.05 else "Non-normal"
    
    return {
        "type": "bar",
        "data": {
            "labels": labels,
            "datasets": [{
                "label": "Number of Seasons",
                "data": counts,
                "backgroundColor": "rgba(54, 162, 235, 0.7)",
                "borderColor": "rgb(54, 162, 235)",
                "borderWidth": 1
            }]
        },
        "options": {
            "plugins": {
                "title": {
                    "display": True,
                    "text": f"Mean: {mean_snowfall:.1f} in, Std Dev: {std_snowfall:.1f} in"
                }
            },
            "scales": {
                "x": {
                    "title": {
                        "display": True,
                        "text": "Seasonal Snowfall (inches)"
                    }
                },
                "y": {
                    "title": {
                        "display": True,
                        "text": "Number of Seasons"
                    }
                }
            }
        },
        "annotation": {
            "annotations": {
                "shapiro_label": {
                    "type": "label",
                    "xValue": len(labels) - 1,
                    "yValue": max(counts),
                    "backgroundColor": "rgba(245,245,245,0.8)",
                    "content": [
                        "Shapiro-Wilk Test",
                        f"W = {shapiro_stat:.3f}",
                        f"p = {shapiro_p:.4f}",
                        f"Result: {normality_result}"
                    ],
                    "font": {
                        "size": 12
                    },
                    "position": {
                        "x": "end",
                        "y": "start"
                    }
                }
            }
        }
    }


def run_analysis(df: pd.DataFrame, analysis_func, name: str) -> None:
    """Run an analysis function and save the result to ./analysis/<name>.json"""
    output_dir = Path(__file__).parent / "analysis"
    output_dir.mkdir(exist_ok=True)
    
    result = analysis_func(df)
    output_path = output_dir / f"{name}.json"
    
    with open(output_path, "w") as f:
        json.dump(result, f)
    
    print(f"Wrote {output_path}")


def analyze_snowfall_rolling_boxplot(df: pd.DataFrame) -> dict:
    """
    Create rolling boxplot data for seasonal snowfall.
    Each data point contains the raw values from a 20-year rolling window,
    allowing the charting software to compute quantiles.
    
    Returns:
        Chart.js configuration dict with 2D array data for boxplot
    """
    df_snow = df.copy()
    
    # Assign winter season
    df_snow["winter_season"] = df_snow.apply(
        lambda row: row["year"] if row["month"] >= 11 else row["year"] - 1,
        axis=1
    )
    
    # Filter to winter months only
    winter_months = [11, 12, 1, 2, 3]
    df_winter = df_snow[df_snow["month"].isin(winter_months)]
    
    # Get valid winter seasons starting from 1884
    valid_seasons = sorted(s for s in df_winter["winter_season"].unique() if s >= 1884)
    
    # Sum snowfall by winter season
    total_snowfall = df_winter.groupby("winter_season")["snowfall"].sum()
    snowfall_data = [round(total_snowfall.get(year, 0), 1) for year in valid_seasons]
    
    # Create rolling 20-year windows
    window_size = 20
    rolling_windows = []
    labels = []
    
    for i in range(len(valid_seasons)):
        if i < window_size - 1:
            # Not enough data yet for a full window
            rolling_windows.append(None)
            labels.append("")  # Empty label for incomplete windows
        else:
            # Get the last 20 years of data
            window = snowfall_data[i - window_size + 1:i + 1]
            rolling_windows.append(window)
            
            # Label shows the range of years in this window
            start_year = valid_seasons[i - window_size + 1]
            end_year = valid_seasons[i]
            labels.append(f"{start_year}-{str(end_year + 1)[-2:]}")
    
    return {
        "type": "boxplot",
        "data": {
            "labels": labels,
            "datasets": [{
                "label": "20-Year Rolling Snowfall Distribution",
                "data": rolling_windows,
                "backgroundColor": "rgba(54, 162, 235, 0.5)",
                "borderColor": "rgb(54, 162, 235)",
                "borderWidth": 1
            }]
        },
        "options": {
            "scales": {
                "x": {
                    "title": {
                        "display": True,
                        "text": "Winter Season (end of 20-year window)"
                    }
                },
                "y": {
                    "title": {
                        "display": True,
                        "text": "Seasonal Snowfall (inches)"
                    }
                }
            }
        }
    }


def run_all_analyses(df: pd.DataFrame) -> None:
    """Run all analysis functions and save results."""
    analyses = [
        (analyze_snow_days_by_year, "snow_days_by_year"),
        (analyze_snow_cycles_by_year, "snow_cycles_by_year"),
        (analyze_avg_daily_lows_by_season, "avg_daily_lows_by_season"),
        (analyze_avg_monthly_temp, "avg_monthly_temp"),
        (analyze_total_snowfall_by_year, "total_snowfall_by_year"),
        (analyze_snowfall_distribution, "snowfall_distribution"),
        (analyze_snowfall_rolling_boxplot, "snowfall_rolling_boxplot"),
    ]
    
    for func, name in analyses:
        run_analysis(df, func, name)


if __name__ == "__main__":
    df = load_all_data()
    print(f"\nLoaded {len(df):,} records from {df['date'].min()} to {df['date'].max()}")
    
    print("\nRunning analyses...")
    run_all_analyses(df)
    print("\nDone!")
