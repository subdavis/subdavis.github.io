"""
Analysis: Snow days by winter season

Count the number of days with snow depth > 0 and days with snowfall > 0 by winter season.
Winter is defined as Nov-Mar, assigned to the year the winter started.
"""

import pandas as pd
from .utils import compute_linear_regression


def analyze_snow_days_by_year(df: pd.DataFrame) -> dict:
    """
    Count the number of days with snow depth > 0 and days with snowfall > 0 by winter season.
    
    Winter season is Nov-Mar, assigned to starting year (e.g., "1884-85").
    
    Returns:
        Chart.js configuration dict with two datasets and trend lines
    """
    df_snow = df.copy()
    
    # Only include winter months (Nov-Mar)
    df_snow = df_snow[df_snow["month"].isin([11, 12, 1, 2, 3])]
    
    # Filter to complete winter seasons only (1884 to 2024)
    # 2025 winter is incomplete (missing Jan-Mar 2026)
    df_snow = df_snow[(df_snow["winter_year"] >= 1884) & (df_snow["winter_year"] <= 2024)]
    
    # Count days with snow on ground and snowfall by winter season
    snow_depth_days = df_snow[df_snow["snow_depth"] > 0].groupby("winter_year").size()
    snowfall_days = df_snow[df_snow["snowfall"] > 0].groupby("winter_year").size()
    
    valid_seasons = sorted(df_snow["winter_year"].unique())
    labels = [f"{int(year)}-{str(int(year)+1)[-2:]}" for year in valid_seasons]
    
    # Snow depth data only available from 1899 onwards
    # Use None for earlier years to avoid showing artificial zeros
    SNOW_DEPTH_START_YEAR = 1899
    depth_data = [int(snow_depth_days.get(year, 0)) if year >= SNOW_DEPTH_START_YEAR else None for year in valid_seasons]
    fall_data = [int(snowfall_days.get(year, 0)) for year in valid_seasons]
    
    # Split data at 1970
    split_year = 1970
    
    # Create post-1970 datasets for trend lines
    depth_data_post = [depth_data[i] if valid_seasons[i] >= split_year else None for i in range(len(valid_seasons))]
    fall_data_post = [fall_data[i] if valid_seasons[i] >= split_year else None for i in range(len(valid_seasons))]
    
    # Colors
    depth_color = "rgb(75, 192, 192)"
    fall_color = "rgb(54, 162, 235)"
    
    # Compute post-1970 trend lines only
    annotations = {}
    annotations.update(compute_linear_regression(
        depth_data_post, depth_color, "Snow on Ground (post-1970)", 
        "depth_post_line", "depth_post_label", label_x_pct=0.5
    ))
    annotations.update(compute_linear_regression(
        fall_data_post, fall_color, "Snowfall Days (post-1970)", 
        "fall_post_line", "fall_post_label", label_x_pct=0.7
    ))
    
    return {
        "type": "line",
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "label": "Days with Snow on Ground",
                    "data": depth_data,
                    "fill": False,
                    "borderColor": depth_color,
                    "tension": 0.1
                },
                {
                    "label": "Days with Snowfall",
                    "data": fall_data,
                    "fill": False,
                    "borderColor": fall_color,
                    "tension": 0.1
                }
            ]
        },
        "annotation": {
            "annotations": annotations
        }
    }
