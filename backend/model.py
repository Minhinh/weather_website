import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestRegressor

class WeatherModel:
    def __init__(self):
        # Initialize Random Forest models for tomorrow's min/max temperature, humidity, and wind speed at specific times
        self.models = {
            "random_forest_min": RandomForestRegressor(n_estimators=100, random_state=42),
            "random_forest_max": RandomForestRegressor(n_estimators=100, random_state=42),
            "random_forest_humidity_9am": RandomForestRegressor(n_estimators=100, random_state=42),
            "random_forest_humidity_3pm": RandomForestRegressor(n_estimators=100, random_state=42),
            "random_forest_wind_speed_9am": RandomForestRegressor(n_estimators=100, random_state=42),
            "random_forest_wind_speed_3pm": RandomForestRegressor(n_estimators=100, random_state=42)
        }

    def train(self):
        data_path = os.path.join("data", "1 Main Weather Dataset Cleaned.csv")
        data = pd.read_csv(data_path)
        
        # Sample 10% of the data for faster processing
        data = data.sample(frac=0.1, random_state=42).reset_index(drop=True)
        
        # Prepare the data for tomorrow's predictions
        data['MinTempTomorrow'] = data.groupby('Location')['MinTemp'].shift(-1)
        data['MaxTempTomorrow'] = data.groupby('Location')['MaxTemp'].shift(-1)
        data['Humidity9amTomorrow'] = data.groupby('Location')['Humidity9am'].shift(-1)
        data['Humidity3pmTomorrow'] = data.groupby('Location')['Humidity3pm'].shift(-1)
        data['WindSpeed9amTomorrow'] = data.groupby('Location')['WindSpeed9am'].shift(-1)
        data['WindSpeed3pmTomorrow'] = data.groupby('Location')['WindSpeed3pm'].shift(-1)
        
        # Drop rows with NaN values for tomorrow's predictions
        data.dropna(subset=['MinTempTomorrow', 'MaxTempTomorrow', 'Humidity9amTomorrow', 'Humidity3pmTomorrow', 'WindSpeed9amTomorrow', 'WindSpeed3pmTomorrow'], inplace=True)

        # Features and labels for each model
        X = data[['MinTemp', 'MaxTemp', 'Humidity9am', 'Humidity3pm', 'WindSpeed9am', 'WindSpeed3pm']]
        y = {
            "min_temp": data['MinTempTomorrow'],
            "max_temp": data['MaxTempTomorrow'],
            "humidity_9am": data['Humidity9amTomorrow'],
            "humidity_3pm": data['Humidity3pmTomorrow'],
            "wind_speed_9am": data['WindSpeed9amTomorrow'],
            "wind_speed_3pm": data['WindSpeed3pmTomorrow']
        }

        # Train and save each Random Forest model
        self.models["random_forest_min"].fit(X, y["min_temp"])
        joblib.dump(self.models["random_forest_min"], 'data/random_forest_min.pkl')
        
        self.models["random_forest_max"].fit(X, y["max_temp"])
        joblib.dump(self.models["random_forest_max"], 'data/random_forest_max.pkl')
        
        self.models["random_forest_humidity_9am"].fit(X, y["humidity_9am"])
        joblib.dump(self.models["random_forest_humidity_9am"], 'data/random_forest_humidity_9am.pkl')
        
        self.models["random_forest_humidity_3pm"].fit(X, y["humidity_3pm"])
        joblib.dump(self.models["random_forest_humidity_3pm"], 'data/random_forest_humidity_3pm.pkl')

        self.models["random_forest_wind_speed_9am"].fit(X, y["wind_speed_9am"])
        joblib.dump(self.models["random_forest_wind_speed_9am"], 'data/random_forest_wind_speed_9am.pkl')
        
        self.models["random_forest_wind_speed_3pm"].fit(X, y["wind_speed_3pm"])
        joblib.dump(self.models["random_forest_wind_speed_3pm"], 'data/random_forest_wind_speed_3pm.pkl')
        
        print("All Random Forest models trained and saved successfully.")

    def predict(self, features):
        # Load and predict using each Random Forest model
        predictions = {}
        
        predictions["min_temp"] = joblib.load('data/random_forest_min.pkl').predict([features])[0]
        predictions["max_temp"] = joblib.load('data/random_forest_max.pkl').predict([features])[0]
        
        predictions["humidity_9am"] = joblib.load('data/random_forest_humidity_9am.pkl').predict([features])[0]
        predictions["humidity_3pm"] = joblib.load('data/random_forest_humidity_3pm.pkl').predict([features])[0]
        
        predictions["wind_speed_9am"] = joblib.load('data/random_forest_wind_speed_9am.pkl').predict([features])[0]
        predictions["wind_speed_3pm"] = joblib.load('data/random_forest_wind_speed_3pm.pkl').predict([features])[0]

        return predictions

if __name__ == "__main__":
    model = WeatherModel()
    model.train()
