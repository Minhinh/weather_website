from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import WeatherModel
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

# Initialize the weather model
weather_model = WeatherModel()


@app.get("/")
async def root():
    return {"message": "Welcome to the Weather and Accident Prediction API"}

@app.get("/predict/weather/{location}")
async def predict_weather(location: str):
    try:
        # Load the CSV data to find the location
        data_path = os.path.join("data", "1 Main Weather Dataset Cleaned.csv")
        data = pd.read_csv(data_path)

        # Filter the data for the requested location
        location_data = data[data['Location'].str.lower() == location.lower()]
        
        if location_data.empty:
            raise HTTPException(status_code=404, detail="Location not found")

        # Prepare the features for prediction from the latest available data
        latest_data = location_data.iloc[-1]
        features = [
            latest_data['MinTemp'],
            latest_data['MaxTemp'],
            latest_data['Humidity9am'],
            latest_data['Humidity3pm'],
            latest_data['WindSpeed9am'],
            latest_data['WindSpeed3pm']
        ]

        # Get predictions using the WeatherModel
        predictions = weather_model.predict(features)

        # Format and return predictions
        return {
            "location": location,
            "temperature_predictions": {
                "min_temp": round(predictions["min_temp"], 2),
                "max_temp": round(predictions["max_temp"], 2),
            },
            "humidity_predictions": {
                "humidity_9am": round(predictions["humidity_9am"], 2),
                "humidity_3pm": round(predictions["humidity_3pm"], 2),
            },
            "wind_speed_predictions": {
                "wind_speed_9am": round(predictions["wind_speed_9am"], 2),
                "wind_speed_3pm": round(predictions["wind_speed_3pm"], 2),
            }
        }
    except Exception as e:
        print(f"Error in weather prediction: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal weather prediction error")

@app.get("/predict/accidents/{rainfall}")
async def predict_accidents(rainfall: float):
    try:
        # Get predictions for accidents
        prediction = accident_model.predict(rainfall)

        # Return formatted prediction
        return {
            "rainfall": round(rainfall, 2),
            "predicted_total_accidents": round(prediction, 2),
        }
    except Exception as e:
        print("Error occurred during accident prediction:", e)
        raise HTTPException(status_code=500, detail="Accident prediction error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
