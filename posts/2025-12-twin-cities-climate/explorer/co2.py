"""
Analysis: Atmospheric CO2 concentration

Load and chart Mauna Loa CO2 data from NOAA.
"""

import csv
from pathlib import Path

import pandas as pd


def load_co2_data(data_dir: Path = None) -> pd.DataFrame:
    """Load CO2 data from the CSV file, skipping comment lines."""
    if data_dir is None:
        data_dir = Path(__file__).parent.parent / "data"
    
    filepath = data_dir / "co2_annmean_mlo.csv"
    
    # Read file, skipping comment lines that start with #
    rows = []
    with open(filepath) as f:
        for line in f:
            if not line.startswith("#"):
                rows.append(line.strip())
    
    # Parse CSV from the non-comment lines
    reader = csv.DictReader(rows)
    records = []
    for row in reader:
        records.append({
            "year": int(row["year"]),
            "co2_ppm": float(row["mean"]),
            "uncertainty": float(row["unc"])
        })
    
    return pd.DataFrame(records)


def analyze_co2(df: pd.DataFrame = None) -> dict:
    """
    Create a chart of atmospheric CO2 concentration over time.
    Includes a line for absolute values and bars for year-over-year change.
    
    Returns:
        Chart.js configuration dict
    """
    if df is None:
        df = load_co2_data()
    
    labels = [str(year) for year in df["year"]]
    data = [round(val, 2) for val in df["co2_ppm"]]
    
    # Calculate year-over-year change (first year has no change)
    yoy_change = [None]  # No change for first year
    for i in range(1, len(data)):
        change = round(data[i] - data[i - 1], 2)
        yoy_change.append(change)
    
    return {
        "type": "bar",
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "type": "line",
                    "label": "Atmospheric CO₂ (ppm)",
                    "data": data,
                    "fill": False,
                    "borderColor": "rgb(75, 192, 192)",
                    "tension": 0.1,
                    "pointRadius": 0,
                    "yAxisID": "y"
                },
                {
                    "type": "bar",
                    "label": "Year-over-Year Change (ppm)",
                    "data": yoy_change,
                    "backgroundColor": "rgba(255, 99, 132, 0.7)",
                    "borderColor": "rgb(255, 99, 132)",
                    "borderWidth": 1,
                    "yAxisID": "y1"
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
                        "text": "CO₂ Concentration (ppm)"
                    }
                },
                "y1": {
                    "type": "linear",
                    "position": "right",
                    "title": {
                        "display": True,
                        "text": "Year-over-Year Change (ppm)"
                    },
                    "grid": {
                        "drawOnChartArea": False
                    }
                },
                "x": {
                    "title": {
                        "display": True,
                        "text": "Year"
                    }
                }
            }
        }
    }
