"""
Analysis: Average monthly temperature

Calculate average temperature for each month of each year as a time series.
"""

import pandas as pd


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
