"""
Analysis: Rolling boxplot of seasonal snowfall

Create rolling boxplot data for seasonal snowfall analysis.
Each data point contains raw values from a 20-year rolling window.
"""

import pandas as pd


def analyze_snowfall_rolling_boxplot(df: pd.DataFrame) -> dict:
    """
    Create rolling boxplot data for seasonal snowfall.
    Each data point contains the raw values from a 20-year rolling window,
    allowing the charting software to compute quantiles.
    
    Returns:
        Chart.js configuration dict with 2D array data for boxplot
    """
    # Filter to winter months only
    winter_months = [11, 12, 1, 2, 3]
    df_winter = df[df["month"].isin(winter_months)]
    
    # Get complete winter seasons only (1884 to 2024)
    # 2025 winter is incomplete (missing Jan-Mar 2026)
    valid_seasons = sorted(s for s in df_winter["winter_year"].unique() if 1884 <= s <= 2024)
    
    # Sum snowfall by winter season
    total_snowfall = df_winter.groupby("winter_year")["snowfall"].sum()
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
