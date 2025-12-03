"""
Analysis: Snow cycles by winter season

Count snow melt events and freeze-thaw cycles per winter season.
Winter is defined as Nov-Mar, assigned to the year the winter started.
"""

import pandas as pd
from .utils import compute_linear_regression


def analyze_snow_cycles_by_year(df: pd.DataFrame) -> dict:
    """
    Count the number of snow cycles and freeze-thaw cycles per winter season.
    - Snow cycle: when snow depth transitions from >0 to 0 (snow melts completely).
    - Freeze-thaw cycle: days where the high is above freezing and the low is below freezing.
    
    Winter season is Nov-Mar, assigned to starting year (e.g., "1884-85").
    
    Returns:
        Chart.js configuration dict with two datasets and trend line annotations
    """
    df_snow = df.copy()
    
    # Only include winter months (Nov-Mar)
    df_snow = df_snow[df_snow["month"].isin([11, 12, 1, 2, 3])]
    
    # Filter to complete winter seasons only (1884 to 2024)
    # 2025 winter is incomplete (missing Jan-Mar 2026)
    df_snow = df_snow[(df_snow["winter_year"] >= 1884) & (df_snow["winter_year"] <= 2024)]
    
    # Create a boolean series: True when there's snow on the ground
    has_snow = (df_snow["snow_depth"] > 0).fillna(False)
    
    # Detect transitions from snow (True) to no snow (False)
    # Shift forward and compare: previous day had snow, current day doesn't
    snow_melted = has_snow.shift(1) & ~has_snow
    df_snow["snow_melted"] = snow_melted
    
    # Count melt events by winter season
    cycles_by_season = df_snow[df_snow["snow_melted"]].groupby("winter_year").size()
    
    # Freeze-thaw cycles: days where high > 32°F and low < 32°F
    freeze_thaw = (df_snow["max_temp"] > 32) & (df_snow["min_temp"] < 32)
    df_snow["freeze_thaw"] = freeze_thaw
    freeze_thaw_by_season = df_snow[df_snow["freeze_thaw"]].groupby("winter_year").size()
    
    valid_seasons = sorted(df_snow["winter_year"].unique())
    labels = [f"{int(year)}-{str(int(year)+1)[-2:]}" for year in valid_seasons]
    
    # Snow depth/cycle data only available from 1899 onwards
    # Use None for earlier years to avoid showing artificial zeros
    SNOW_DEPTH_START_YEAR = 1899
    snow_cycle_data = [int(cycles_by_season.get(year, 0)) if year >= SNOW_DEPTH_START_YEAR else None for year in valid_seasons]
    freeze_thaw_data = [int(freeze_thaw_by_season.get(year, 0)) for year in valid_seasons]
    
    # Create post-1970 datasets for trend lines
    split_year = 1970
    snow_cycle_data_post = [snow_cycle_data[i] if valid_seasons[i] >= split_year else None for i in range(len(valid_seasons))]
    freeze_thaw_data_post = [freeze_thaw_data[i] if valid_seasons[i] >= split_year else None for i in range(len(valid_seasons))]
    
    # Compute post-1970 trend line annotations only
    snow_cycle_color = "rgb(153, 102, 255)"
    freeze_thaw_color = "rgb(255, 159, 64)"
    
    annotations = {}
    annotations.update(compute_linear_regression(
        snow_cycle_data_post, snow_cycle_color, "Snow Cycles (post-1970)", "snow_cycle_line", "snow_cycle_label", label_x_pct=0.5
    ))
    annotations.update(compute_linear_regression(
        freeze_thaw_data_post, freeze_thaw_color, "Freeze-Thaw (post-1970)", "freeze_thaw_line", "freeze_thaw_label", label_x_pct=0.75
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
