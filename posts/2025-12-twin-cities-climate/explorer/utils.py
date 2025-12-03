"""
Utility functions for data loading, parsing, and analysis helpers.
"""

import json
from pathlib import Path
import pandas as pd
import numpy as np
from scipy import stats


def compute_linear_regression(
    data: list, 
    color: str, 
    label_prefix: str, 
    line_id: str, 
    label_id: str, 
    label_x_pct: float = 0.75
) -> dict:
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
        data_dir = Path(__file__).parent.parent / "data"
    
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
    
    # Winter year: Nov-Dec belong to current year, Jan-Mar to previous year
    # Useful for seasonal winter analyses (Nov-Mar)
    df["winter_year"] = df.apply(
        lambda row: row["year"] if row["month"] >= 11 else row["year"] - 1,
        axis=1
    )
    
    return df


def get_valid_years(df: pd.DataFrame, column: str) -> set:
    """
    Get years that have at least some non-null data for the given column.
    Years with entirely missing data are excluded.
    """
    valid_data = df[df[column].notna()]
    return set(valid_data["year"].unique())


def run_analysis(df: pd.DataFrame, analysis_func, name: str, output_dir: Path = None) -> None:
    """Run an analysis function and save the result to ./analysis/<name>.json"""
    if output_dir is None:
        output_dir = Path(__file__).parent.parent / "analysis"
    output_dir.mkdir(exist_ok=True)
    
    result = analysis_func(df)
    output_path = output_dir / f"{name}.json"
    
    with open(output_path, "w") as f:
        json.dump(result, f)
    
    print(f"Wrote {output_path}")
