from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import WeatherModel
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model and load data
weather_model = WeatherModel()
data_path = os.path.join("data", "1 Main Weather Dataset Cleaned.csv")
data = pd.read_csv(data_path)

@app.get("/locations")
async def get_locations():
    # Fetch unique locations from the data
    locations = data["Location"].unique().tolist()
    return {"locations": locations}

@app.get("/predict")
async def get_prediction(location: str):
    # Get the latest data for the specified location
    location_data = data[data["Location"] == location].iloc[-1]
    features = location_data[["MinTemp", "MaxTemp", "Humidity9am", "Humidity3pm", "WindSpeed9am", "WindSpeed3pm"]].tolist()
    
    # Use the model to predict based on the features
    predictions = weather_model.predict(features)
    
    return {
        "location": location,
        "predictions": predictions
    }
