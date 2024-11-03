import React, { useEffect, useState } from 'react';

const ForecastOverview = ({ location }) => {
    const [dailyPredictions, setDailyPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (location) {
                setLoading(true);
                try {
                    const response = await fetch('http://127.0.0.1:8000/predict', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ location }),
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch weather data');
                    }
                    const data = await response.json();
                    setDailyPredictions(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchWeatherData();
    }, [location]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="forecast-overview">
            <h2>7-Day Forecast for {location}</h2>
            <div className="daily-forecast">
                {dailyPredictions.map((daily) => (
                    <div key={daily.date} className="daily-card">
                        <h3>{daily.day_of_week} - {daily.date}</h3>
                        <p>Min Temp: {daily.min_temp}°C</p>
                        <p>Max Temp: {daily.max_temp}°C</p>
                        <p>Humidity (9 AM): {daily.humidity_9am}%</p>
                        <p>Humidity (3 PM): {daily.humidity_3pm}%</p>
                        <p>Wind Speed (9 AM): {daily.wind_speed_9am} km/h</p>
                        <p>Wind Speed (3 PM): {daily.wind_speed_3pm} km/h</p>
                        <p>Total Accidents: {daily.total_accidents}</p>
                        <p>Rainfall: {daily.rainfall} mm</p>
                        <h4>Hourly Forecast</h4>
                        <div className="hourly-forecast">
                            {daily.hourly_predictions.map((hour) => (
                                <div key={hour.hour} className="hourly-card">
                                    <p>Hour: {hour.hour}:00</p>
                                    <p>Temp: {hour.temperature}°C</p>
                                    <p>Humidity: {hour.humidity}%</p>
                                    <p>Wind Speed: {hour.wind_speed} km/h</p>
                                    <p>Wind Gust Speed: {hour.wind_gust_speed} km/h</p>
                                    <p>Rainfall: {hour.rainfall} mm</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForecastOverview;
