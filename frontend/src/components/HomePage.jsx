import React, { useState } from 'react';

const WeatherSearch = () => {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    const handleSearch = async () => {
      try {
          const response = await fetch(`http://127.0.0.1:8000/predict/weather/${location}`);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setWeatherData(data);
      } catch (error) {
          console.error("Error fetching weather data:", error);
      }
  };
  

    return (
        <div>
            <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Enter location"
            />
            <button onClick={handleSearch}>Search</button>

            {weatherData && (
                <div>
                    <h2>Weather Prediction for {weatherData.location}</h2>
                    <p>Min Temperature: {weatherData.temperature_predictions.min_temp}°C</p>
                    <p>Max Temperature: {weatherData.temperature_predictions.max_temp}°C</p>
                    <p>Humidity at 9 AM: {weatherData.humidity_predictions.humidity_9am}%</p>
                    <p>Humidity at 3 PM: {weatherData.humidity_predictions.humidity_3pm}%</p>
                    <p>Wind Speed at 9 AM: {weatherData.wind_speed_predictions.wind_speed_9am} km/h</p>
                    <p>Wind Speed at 3 PM: {weatherData.wind_speed_predictions.wind_speed_3pm} km/h</p>
                </div>
            )}
        </div>
    );
};

export default WeatherSearch;
