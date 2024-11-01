import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestRegressor

class WeatherModel:
    def __init__(self):
        self.models = {
            "random_forest_min": joblib.load('data/random_forest_min.pkl'),
            "random_forest_max": joblib.load('data/random_forest_max.pkl'),
            "random_forest_humidity_9am": joblib.load('data/random_forest_humidity_9am.pkl'),
            "random_forest_humidity_3pm": joblib.load('data/random_forest_humidity_3pm.pkl'),
            "random_forest_wind_speed_9am": joblib.load('data/random_forest_wind_speed_9am.pkl'),
            "random_forest_wind_speed_3pm": joblib.load('data/random_forest_wind_speed_3pm.pkl')
        }

    def predict(self, features):
        predictions = {}
        predictions["min_temp"] = self.models["random_forest_min"].predict([features])[0]
        predictions["max_temp"] = self.models["random_forest_max"].predict([features])[0]
        predictions["humidity_9am"] = self.models["random_forest_humidity_9am"].predict([features])[0]
        predictions["humidity_3pm"] = self.models["random_forest_humidity_3pm"].predict([features])[0]
        predictions["wind_speed_9am"] = self.models["random_forest_wind_speed_9am"].predict([features])[0]
        predictions["wind_speed_3pm"] = self.models["random_forest_wind_speed_3pm"].predict([features])[0]
        return predictions
