from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import joblib
import pandas as pd
import os
from datetime import datetime, timedelta

app = FastAPI()

# Configure CORS middleware to allow requests from the React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request and response models
class PredictionRequest(BaseModel):
    location: str

class HourlyPrediction(BaseModel):
    hour: int
    temperature: float
    humidity: float
    wind_speed: float
    wind_gust_speed: float
    rainfall: float

class DailyPrediction(BaseModel):
    day_of_week: str
    date: str
    min_temp: int
    max_temp: int
    humidity_9am: int
    humidity_3pm: int
    wind_speed_9am: int
    wind_speed_3pm: int
    total_accidents: int
    rainfall: int
    hourly_predictions: List[HourlyPrediction]  # Add this line

# Weather model class to handle loading and predicting
class WeatherModel:
    def __init__(self):
        # Load models from the specified path
        self.models = {
            "min_temp": joblib.load('data/random_forest_min_temp.pkl'),
            "max_temp": joblib.load('data/random_forest_max_temp.pkl'),
            "humidity_9am": joblib.load('data/random_forest_humidity_9am.pkl'),
            "humidity_3pm": joblib.load('data/random_forest_humidity_3pm.pkl'),
            "wind_speed_9am": joblib.load('data/random_forest_wind_speed_9am.pkl'),
            "wind_speed_3pm": joblib.load('data/random_forest_wind_speed_3pm.pkl'),
        }
        self.accident_model = joblib.load('data/gradient_boosting_accidents.pkl')

    def get_locations(self):
        # Load data to get unique locations
        data_path = os.path.join("data", "1 Main Weather Dataset Cleaned.csv")
        data = pd.read_csv(data_path)
        return data['Location'].unique().tolist()

    def predict_weather(self, location):
        # Load the weather data for prediction
        data_path = os.path.join("data", "1 Main Weather Dataset Cleaned.csv")
        data = pd.read_csv(data_path)
        location_data = data[data['Location'] == location]

        if location_data.empty:
            raise ValueError("Location not found in the dataset.")

        latest_data = location_data.iloc[-1]
        predictions = []
        today = datetime.now()

        # Predict for today and the next 5 days
        for day in range(6):  # 0 for today, 1 for tomorrow, ..., 5 for the day after tomorrow
            features = [[
                latest_data['MinTemp'] + day,  # Increment min temp by day
                latest_data['MaxTemp'] + day,  # Increment max temp by day
                latest_data['Humidity9am'] + day,
                latest_data['Humidity3pm'] + day,
                latest_data['WindSpeed9am'] + day,
                latest_data['WindSpeed3pm'] + day
            ]]

            daily_predictions = {}
            for key in self.models:
                daily_predictions[key] = round(self.models[key].predict(features)[0])

            # Assuming rainfall correlates with morning humidity for simplicity
            rainfall = daily_predictions['humidity_9am']
            total_accidents = round(self.accident_model.predict([[rainfall]])[0])

            # Calculate the date and day of the week
            prediction_date = today + timedelta(days=day)

            # Generate hourly predictions (assuming 4 hourly predictions for simplicity)
            hourly_predictions = []
            for hour in range(24):
                # Interpolating values for hourly data
                temp_range = daily_predictions['max_temp'] - daily_predictions['min_temp']
                hourly_temp = daily_predictions['min_temp'] + (temp_range * (hour / 24))
                hourly_humidity = daily_predictions['humidity_9am'] + ((daily_predictions['humidity_3pm'] - daily_predictions['humidity_9am']) * (hour / 12))
                hourly_wind_speed = daily_predictions['wind_speed_9am'] + ((daily_predictions['wind_speed_3pm'] - daily_predictions['wind_speed_9am']) * (hour / 12))
                hourly_wind_gust = daily_predictions['wind_speed_3pm'] * 1.1  # Example: Assuming gust speed is slightly higher than wind speed

                hourly_predictions.append(HourlyPrediction(
                    hour=hour,
                    temperature=round(hourly_temp, 1),
                    humidity=round(hourly_humidity, 1),
                    wind_speed=round(hourly_wind_speed, 1),
                    wind_gust_speed=round(hourly_wind_gust, 1),
                    rainfall=rainfall  # Assuming constant rainfall for simplicity
                ))

            predictions.append(DailyPrediction(
                day_of_week=prediction_date.strftime('%A'),  # Get the full name of the day
                date=prediction_date.strftime('%d-%m-%Y'),
                min_temp=daily_predictions['min_temp'],
                max_temp=daily_predictions['max_temp'],
                humidity_9am=daily_predictions['humidity_9am'],
                humidity_3pm=daily_predictions['humidity_3pm'],
                wind_speed_9am=daily_predictions['wind_speed_9am'],
                wind_speed_3pm=daily_predictions['wind_speed_3pm'],
                total_accidents=total_accidents,
                rainfall=daily_predictions['humidity_9am'],  # Including rainfall in the response
                hourly_predictions=hourly_predictions  # Add hourly predictions
            ))

        return predictions

# Instantiate the WeatherModel
weather_model = WeatherModel()

@app.get("/locations", response_model=List[str])
async def get_locations():
    return weather_model.get_locations()

@app.post("/predict", response_model=List[DailyPrediction])
async def predict_weather(request: PredictionRequest):
    try:
        return weather_model.predict_weather(request.location)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
