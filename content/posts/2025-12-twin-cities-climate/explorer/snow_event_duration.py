"""
Analysis: Average snow event duration by winter season

Calculate the average duration of snow events (consecutive days with snow on ground).
"""

import pandas as pd
from .utils import compute_linear_regression


def analyze_snow_event_duration(df: pd.DataFrame) -> dict:
    """
    Calculate the average duration of snow events per winter season.
    
    A snow event is the number of consecutive days where snow_depth > 0.
    Multiple snowstorms can occur during a single event if the snow never
    fully melts between them.
    
    Winter season is Nov-Mar, assigned to starting year (e.g., "1899-00").
    Data starts from 1899 when snow_depth coverage begins.
    
    Returns:
        Chart.js configuration dict
    """
    # Filter to winter months only
    winter_months = [11, 12, 1, 2, 3]
    df_winter = df[df["month"].isin(winter_months)].copy()
    
    # Filter to complete winter seasons with snow_depth data (1899 to 2024)
    df_winter = df_winter[(df_winter["winter_year"] >= 1899) & (df_winter["winter_year"] <= 2024)]
    
    # Sort by date to ensure consecutive days are in order
    df_winter = df_winter.sort_values("date").reset_index(drop=True)
    
    # Track snow events by winter season
    season_events = {}  # {winter_year: [list of event durations]}
    
    current_event_start = None
    current_event_season = None
    
    for idx, row in df_winter.iterrows():
        has_snow = row["snow_depth"] > 0 if pd.notna(row["snow_depth"]) else False
        winter_year = row["winter_year"]
        
        if has_snow:
            if current_event_start is None:
                # Start a new snow event
                current_event_start = idx
                current_event_season = winter_year
        else:
            if current_event_start is not None:
                # End the current snow event
                event_duration = idx - current_event_start
                if current_event_season not in season_events:
                    season_events[current_event_season] = []
                season_events[current_event_season].append(event_duration)
                current_event_start = None
                current_event_season = None
    
    # Handle case where season ends with snow still on ground
    if current_event_start is not None:
        event_duration = len(df_winter) - current_event_start
        if current_event_season not in season_events:
            season_events[current_event_season] = []
        season_events[current_event_season].append(event_duration)
    
    # Calculate average duration per season
    valid_seasons = sorted(season_events.keys())
    labels = [f"{int(year)}-{str(int(year)+1)[-2:]}" for year in valid_seasons]
    
    avg_durations = []
    for year in valid_seasons:
        events = season_events.get(year, [])
        if events:
            avg_durations.append(round(sum(events) / len(events), 1))
        else:
            avg_durations.append(None)
    
    # Create post-1970 dataset for trend line
    split_year = 1970
    data_post = [avg_durations[i] if valid_seasons[i] >= split_year else None for i in range(len(valid_seasons))]
    
    # Compute trend line
    color = "rgb(75, 192, 192)"
    annotations = {}
    annotations.update(compute_linear_regression(
        data_post, color, "Post-1970", "duration_post_line", "duration_post_label", label_x_pct=0.75
    ))
    
    return {
        "type": "line",
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "label": "Avg Snow Event Duration (days)",
                    "data": avg_durations,
                    "fill": False,
                    "borderColor": color,
                    "tension": 0.1,
                    "pointRadius": 2
                }
            ]
        },
        "options": {
            "scales": {
                "y": {
                    "title": {
                        "display": True,
                        "text": "Average Duration (days)"
                    }
                }
            }
        },
        "annotation": {
            "annotations": annotations
        }
    }
