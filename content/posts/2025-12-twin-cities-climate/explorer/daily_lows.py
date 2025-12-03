"""
Analysis: Average daily lows by season

Calculate the average daily low temperature for each season over time.
"""

import pandas as pd
from .utils import get_valid_years, compute_linear_regression


def analyze_avg_daily_lows_by_season(df: pd.DataFrame) -> dict:
    """
    Calculate the average daily low temperature for each season over time.
    - Summer: Jun-Aug
    - Fall: Sep-Nov
    - Winter: Dec-Feb
    - Spring: Mar-May
    
    Returns:
        Chart.js configuration dict with 4 datasets and trend lines for all seasons
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
    
    # Create post-1970 datasets for trend lines
    split_year = 1970
    season_data_post = {}
    for season_name, data in season_data_map.items():
        season_data_post[season_name] = [data[i] if valid_years[i] >= split_year else None for i in range(len(valid_years))]
    
    # Compute post-1970 trend line annotations only
    annotations = {}
    annotations.update(compute_linear_regression(
        season_data_post["Summer"], colors["Summer"], "Summer (post-1970)", "summer_line", "summer_label", label_x_pct=0.20
    ))
    annotations.update(compute_linear_regression(
        season_data_post["Fall"], colors["Fall"], "Fall (post-1970)", "fall_line", "fall_label", label_x_pct=0.30
    ))
    annotations.update(compute_linear_regression(
        season_data_post["Winter"], colors["Winter"], "Winter (post-1970)", "winter_line", "winter_label", label_x_pct=0.60
    ))
    annotations.update(compute_linear_regression(
        season_data_post["Spring"], colors["Spring"], "Spring (post-1970)", "spring_line", "spring_label", label_x_pct=0.50
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
