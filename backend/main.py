from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import WeatherModel
from accident_model import AccidentModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize the models
weather_model = WeatherModel()
accident_model = AccidentModel()

@app.get("/")
async def root():
    return {"message": "Welcome to the Weather and Accident Prediction API"}

@app.get("/predict/weather/{min_temp}/{max_temp}/{humidity_9am}/{humidity_3pm}/{wind_speed_9am}/{wind_speed_3pm}")
async def predict_weather(
    min_temp: float, max_temp: float, humidity_9am: float, 
    humidity_3pm: float, wind_speed_9am: float, wind_speed_3pm: float
):
    try:
        # Prepare features for weather prediction
        features = [min_temp, max_temp, humidity_9am, humidity_3pm, wind_speed_9am, wind_speed_3pm]
        
        # Get predictions using the correct method
        predictions = weather_model.predict(features)
        
        # Format and return predictions
        return {
            "temperature_predictions": {
                "random_forest_min": round(predictions["min_temp"], 2),
                "random_forest_max": round(predictions["max_temp"], 2),
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
        print("Error occurred during weather prediction:", e)
        raise HTTPException(status_code=500, detail="Weather prediction error")

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
