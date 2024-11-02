from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import joblib
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    location: str

class PredictionResponse(BaseModel):
    min_temp: int
    max_temp: int
    humidity_9am: int
    humidity_3pm: int
    wind_speed_9am: int
    wind_speed_3pm: int
    total_accidents: int
    rainfall: int  # Add rainfall to the response

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
        location_data = data[data['Location'] == location]

        if location_data.empty:
            raise ValueError("Location not found in the dataset.")

        latest_data = location_data.iloc[-1]
        features = [[latest_data['MinTemp'], latest_data['MaxTemp'], 
                     latest_data['Humidity9am'], latest_data['Humidity3pm'], 
                     latest_data['WindSpeed9am'], latest_data['WindSpeed3pm']]]

        predictions = {}
        for key in self.models:
            predictions[key] = round(self.models[key].predict(features)[0])

        return predictions

    def predict_accidents(self, rainfall):
        return round(self.accident_model.predict([[rainfall]])[0])

weather_model = WeatherModel()

@app.get("/locations", response_model=List[str])
async def get_locations():
    return weather_model.get_locations()

@app.post("/predict", response_model=PredictionResponse)
async def predict_weather(request: PredictionRequest):
    try:
        predictions = weather_model.predict_weather(request.location)
        rainfall = predictions['humidity_9am']  # Assuming rainfall correlates with morning humidity for simplicity
        total_accidents = weather_model.predict_accidents(rainfall)

        return PredictionResponse(
            min_temp=predictions['min_temp'],
            max_temp=predictions['max_temp'],
            humidity_9am=predictions['humidity_9am'],
            humidity_3pm=predictions['humidity_3pm'],
            wind_speed_9am=predictions['wind_speed_9am'],
            wind_speed_3pm=predictions['wind_speed_3pm'],
            total_accidents=total_accidents,
            rainfall=rainfall  # Including rainfall in the response
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
