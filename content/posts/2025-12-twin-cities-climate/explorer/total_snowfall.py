"""
Analysis: Total snowfall by winter season

Calculate total snowfall for each winter season with trend lines.
Winter is defined as Nov-Mar, assigned to the year the winter started.
"""

import pandas as pd

from .utils import compute_linear_regression


def analyze_total_snowfall_by_year(df: pd.DataFrame) -> dict:
    """
    Calculate total snowfall by winter season.
    Includes 3 trend lines as annotations: overall, pre-1970, and post-1970.
    Also includes rolling standard deviation on secondary y-axis.
    
    Winter season is Nov-Mar, assigned to starting year (e.g., "1884-85").
    
    Returns:
        Chart.js configuration dict
    """
    df_snow = df.copy()
    
    # Only include winter months (Nov-Mar)
    df_snow = df_snow[df_snow["month"].isin([11, 12, 1, 2, 3])]
    
    # Calculate total snowfall for each winter season
    winter_snowfall = df_snow.groupby("winter_year")["snowfall"].sum().reset_index()
    winter_snowfall.columns = ["winter_year", "total_snowfall"]
    
    # Filter to complete winter seasons only (1884 to 2024)
    # 2025 winter is incomplete (missing Jan-Mar 2026)
    winter_snowfall = winter_snowfall[(winter_snowfall["winter_year"] >= 1884) & (winter_snowfall["winter_year"] <= 2024)]
    valid_seasons = list(winter_snowfall["winter_year"])
    
    # Create labels like "1884-85"
    labels = [f"{int(year)}-{str(int(year)+1)[-2:]}" for year in valid_seasons]
    data = [round(val, 1) for val in winter_snowfall["total_snowfall"]]
    
    # Calculate rolling standard deviation
    data_series = pd.Series(data)
    rolling_std_20 = data_series.rolling(window=20, min_periods=20).std()
    rolling_std_30 = data_series.rolling(window=30, min_periods=30).std()
    std_data_20 = [round(v, 1) if pd.notna(v) else None for v in rolling_std_20]
    std_data_30 = [round(v, 1) if pd.notna(v) else None for v in rolling_std_30]
    
    # Split data at 1970 for trend line
    split_year = 1970
    data_post = [data[i] if valid_seasons[i] >= split_year else None for i in range(len(valid_seasons))]
    
    # Compute post-1970 trend line only
    color = "rgb(54, 162, 235)"
    std_color_20 = "rgb(255, 159, 64)"
    std_color_30 = "rgb(153, 102, 255)"
    
    annotations = {}
    annotations.update(compute_linear_regression(
        data_post, color, "Post-1970", "snowfall_post_line", "snowfall_post_label", label_x_pct=0.25
    ))
    
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
