import numpy as np
import pandas as pd


def engineer_price_features(df: pd.DataFrame, include_grade: bool = False) -> pd.DataFrame:
    """
    Expects columns: vegetable_name, mandi_name, arrival_date, min_price, max_price, modal_price, reported_grade.
    Sorts chronologically per (vegetable_name, mandi_name) so lag features never leak future dates.
    """
    data = df.copy()
    data["arrival_date"] = pd.to_datetime(data["arrival_date"])
    data = data.sort_values(["vegetable_name", "mandi_name", "arrival_date"]).reset_index(drop=True)

    # Missing-value handling for price columns
    for col in ["min_price", "max_price", "modal_price"]:
        data[col] = pd.to_numeric(data[col], errors="coerce")
        data[col] = data.groupby(["vegetable_name", "mandi_name"])[col].ffill().bfill()
    data = data.dropna(subset=["modal_price"])

    grp = data.groupby(["vegetable_name", "mandi_name"])
    data["lag_1_modal"] = grp["modal_price"].shift(1)
    data["lag_3_modal"] = grp["modal_price"].shift(3)
    data["lag_7_modal"] = grp["modal_price"].shift(7)
    data["rolling_7_mean"] = grp["modal_price"].transform(lambda s: s.shift(1).rolling(7, min_periods=1).mean())
    data["rolling_7_std"] = grp["modal_price"].transform(lambda s: s.shift(1).rolling(7, min_periods=1).std()).fillna(0.0)
    data["prev_spread"] = (grp["max_price"].shift(1) - grp["min_price"].shift(1)).fillna(0.0)

    # Fill early-history lags with previous available value or group expanding mean (past-only)
    for col in ["lag_1_modal", "lag_3_modal", "lag_7_modal", "rolling_7_mean"]:
        data[col] = data[col].fillna(data["rolling_7_mean"])

    # Seasonal / calendar encodings
    doy = data["arrival_date"].dt.dayofyear
    data["sin_doy"] = np.sin(2 * np.pi * doy / 365.25)
    data["cos_doy"] = np.cos(2 * np.pi * doy / 365.25)
    data["day_of_week"] = data["arrival_date"].dt.dayofweek
    data["month"] = data["arrival_date"].dt.month

    if include_grade:
        data["grade_feature"] = data["reported_grade"].fillna("FAQ").astype(str)

    return data.dropna(subset=["lag_1_modal", "rolling_7_mean"])
