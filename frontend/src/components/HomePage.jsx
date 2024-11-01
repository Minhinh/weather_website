import React, { useState, useEffect } from 'react';

function Homepage() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [predictions, setPredictions] = useState(null);

    useEffect(() => {
        // Fetch available locations
        fetch("http://127.0.0.1:8000/locations")
            .then(response => response.json())
            .then(data => setLocations(data.locations))
            .catch(error => console.error("Error fetching locations:", error));
    }, []);

    const handlePredict = () => {
        // Fetch prediction for selected location
        fetch(`http://127.0.0.1:8000/predict?location=${selectedLocation}`)
            .then(response => response.json())
            .then(data => setPredictions(data.predictions))
            .catch(error => console.error("Error fetching prediction:", error));
    };

    return (
        <div>
            <h1>Weather Prediction</h1>
            <select onChange={e => setSelectedLocation(e.target.value)} value={selectedLocation}>
                <option value="">Select Location</option>
                {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                ))}
            </select>
            <button onClick={handlePredict} disabled={!selectedLocation}>
                Get Prediction
            </button>
            {predictions && (
                <div>
                    <h2>Predictions for {selectedLocation}</h2>
                    <p>Min Temperature: {predictions.min_temp} °C</p>
                    <p>Max Temperature: {predictions.max_temp} °C</p>
                    <p>Humidity 9AM: {predictions.humidity_9am} %</p>
                    <p>Humidity 3PM: {predictions.humidity_3pm} %</p>
                    <p>Wind Speed 9AM: {predictions.wind_speed_9am} km/h</p>
                    <p>Wind Speed 3PM: {predictions.wind_speed_3pm} km/h</p>
                </div>
            )}
        </div>
    );
}

export default Homepage;
