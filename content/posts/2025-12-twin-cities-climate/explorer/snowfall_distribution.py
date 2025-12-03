"""
Analysis: Snowfall distribution histogram

Create a histogram of total seasonal snowfall values with Shapiro-Wilk normality test.
"""

import numpy as np
import pandas as pd
from scipy import stats


def analyze_snowfall_distribution(df: pd.DataFrame) -> dict:
    """
    Create a histogram of total seasonal snowfall distribution.
    Uses 5-inch buckets from 10 to 90 inches.
    Includes Shapiro-Wilk normality test.
    
    Returns:
        Chart.js configuration dict with bar chart
    """
    # Filter to winter months only
    winter_months = [11, 12, 1, 2, 3]
    df_winter = df[df["month"].isin(winter_months)]
    
    # Get complete winter seasons only (1884 to 2024)
    # 2025 winter is incomplete (missing Jan-Mar 2026)
    valid_seasons = sorted(s for s in df_winter["winter_year"].unique() if 1884 <= s <= 2024)
    
    # Sum snowfall by winter season
    total_snowfall = df_winter.groupby("winter_year")["snowfall"].sum()
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
