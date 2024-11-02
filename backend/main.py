from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
import joblib
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class PredictionRequest(BaseModel):
    location: str

class PredictionResponse(BaseModel):
    min_temp: float
    max_temp: float
    humidity_9am: float
    humidity_3pm: float
    wind_speed_9am: float
    wind_speed_3pm: float
    total_accidents: float

class WeatherModel:
    def __init__(self):
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
        data_path = os.path.join("data", "1 Main Weather Dataset Cleaned.csv")
        data = pd.read_csv(data_path)
        return data['Location'].unique().tolist()

    def predict_weather(self, location):
        data_path = os.path.join("data", "1 Main Weather Dataset Cleaned.csv")
        data = pd.read_csv(data_path)

        # Filtering the data for the selected location
        location_data = data[data['Location'] == location]

        if location_data.empty:
            raise ValueError("Location not found in the dataset.")

        # Using the latest available data for prediction
        latest_data = location_data.iloc[-1]

        features = [[latest_data['MinTemp'], latest_data['MaxTemp'], 
                     latest_data['Humidity9am'], latest_data['Humidity3pm'], 
                     latest_data['WindSpeed9am'], latest_data['WindSpeed3pm']]]

        predictions = {}
        for key in self.models:
            predictions[key] = self.models[key].predict(features)[0]

        return predictions

    def predict_accidents(self, rainfall):
        return self.accident_model.predict([[rainfall]])[0]

weather_model = WeatherModel()

@app.get("/locations", response_model=List[str])
async def get_locations():
    return weather_model.get_locations()

@app.post("/predict", response_model=PredictionResponse)
async def predict_weather(request: PredictionRequest):
    try:
        predictions = weather_model.predict_weather(request.location)
        rainfall = predictions['humidity_9am']  # Use humidity for accident prediction
        total_accidents = weather_model.predict_accidents(rainfall)

        return PredictionResponse(
            min_temp=predictions['min_temp'],
            max_temp=predictions['max_temp'],
            humidity_9am=predictions['humidity_9am'],
            humidity_3pm=predictions['humidity_3pm'],
            wind_speed_9am=predictions['wind_speed_9am'],
            wind_speed_3pm=predictions['wind_speed_3pm'],
            total_accidents=total_accidents
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
