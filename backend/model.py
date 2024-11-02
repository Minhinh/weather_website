import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.exceptions import NotFittedError

class WeatherModel:
    def __init__(self):
        # Initialize Random Forest models for weather predictions
        self.models = {
            "min_temp": RandomForestRegressor(n_estimators=100, random_state=42),
            "max_temp": RandomForestRegressor(n_estimators=100, random_state=42),
            "humidity_9am": RandomForestRegressor(n_estimators=100, random_state=42),
            "humidity_3pm": RandomForestRegressor(n_estimators=100, random_state=42),
            "wind_speed_9am": RandomForestRegressor(n_estimators=100, random_state=42),
            "wind_speed_3pm": RandomForestRegressor(n_estimators=100, random_state=42),
        }

        # Initialize Gradient Boosting model for accident prediction
        self.accident_model = GradientBoostingRegressor(n_estimators=100, random_state=42)

    def train_weather_models(self):
        data_path = os.path.join("data", "1 Main Weather Dataset Cleaned.csv")
        data = pd.read_csv(data_path).sample(frac=0.1, random_state=42).reset_index(drop=True)

        # Prepare the data for tomorrow's predictions
        data['MinTempTomorrow'] = data.groupby('Location')['MinTemp'].shift(-1)
        data['MaxTempTomorrow'] = data.groupby('Location')['MaxTemp'].shift(-1)
        data['Humidity9amTomorrow'] = data.groupby('Location')['Humidity9am'].shift(-1)
        data['Humidity3pmTomorrow'] = data.groupby('Location')['Humidity3pm'].shift(-1)
        data['WindSpeed9amTomorrow'] = data.groupby('Location')['WindSpeed9am'].shift(-1)
        data['WindSpeed3pmTomorrow'] = data.groupby('Location')['WindSpeed3pm'].shift(-1)

        data.dropna(subset=['MinTempTomorrow', 'MaxTempTomorrow', 'Humidity9amTomorrow', 'Humidity3pmTomorrow', 'WindSpeed9amTomorrow', 'WindSpeed3pmTomorrow'], inplace=True)

        X_weather = data[['MinTemp', 'MaxTemp', 'Humidity9am', 'Humidity3pm', 'WindSpeed9am', 'WindSpeed3pm']]
        y_weather = {
            "min_temp": data['MinTempTomorrow'],
            "max_temp": data['MaxTempTomorrow'],
            "humidity_9am": data['Humidity9amTomorrow'],
            "humidity_3pm": data['Humidity3pmTomorrow'],
            "wind_speed_9am": data['WindSpeed9amTomorrow'],
            "wind_speed_3pm": data['WindSpeed3pmTomorrow']
        }

        # Train and save each Random Forest model
        for key in y_weather:
            self.models[key].fit(X_weather, y_weather[key])
            joblib.dump(self.models[key], f'data/random_forest_{key}.pkl')

        print("All Random Forest models trained and saved successfully.")

    def train_accident_model(self):
        accident_data_path = os.path.join("data", "Merged_Accidents_and_Rainfall.csv")
        accident_data = pd.read_csv(accident_data_path).sample(frac=0.1, random_state=42)

        # Drop rows with any NaN values
        accident_data.dropna(subset=['TOTAL_ACCIDENTS', 'Rainfall'], inplace=True)

        # Check if there's enough data after dropping NaNs
        if accident_data.empty:
            raise ValueError("No valid data available for accident prediction after dropping NaNs.")

        X_accident = accident_data[['Rainfall']]
        y_accident = accident_data['TOTAL_ACCIDENTS']

        # Train and save the Gradient Boosting model for accidents
        self.accident_model.fit(X_accident, y_accident)
        joblib.dump(self.accident_model, 'data/gradient_boosting_accidents.pkl')
        print("Gradient Boosting model for accidents trained and saved successfully.")

    def train_all(self):
        self.train_weather_models()
        self.train_accident_model()

    def predict_weather(self, features):
        predictions = {}
        for key in ['min_temp', 'max_temp', 'humidity_9am', 'humidity_3pm', 'wind_speed_9am', 'wind_speed_3pm']:
            predictions[key] = joblib.load(f'data/random_forest_{key}.pkl').predict([features])[0]
        return predictions

    def predict_accidents(self, rainfall):
        try:
            return self.accident_model.predict([[rainfall]])[0]
        except NotFittedError:
            raise Exception("Accident prediction model is not fitted yet.")

if __name__ == "__main__":
    model = WeatherModel()
    model.train_all()
