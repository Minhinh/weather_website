// ForecastOverview.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import './ForecastOverview.css'; // Ensure you create this CSS file for styling

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
            {/* Hourly Forecast Card */}
            <Card className="forecast-card">
                <CardContent>
                    <Typography variant="h5" component="div">
                        Hourly Forecast Prediction
                    </Typography>
                    <Box className="hourly-forecast">
                        {dailyPredictions.length > 0 && dailyPredictions[0].hourly_predictions.map((hour) => (
                            <Card 
                                key={hour.hour} 
                                className={`hourly-item ${hour.weatherCondition || 'default'}`} // Default class if weatherCondition is undefined
                            >
                                <CardContent>
                                    <Typography variant="body2">
                                        {hour.hour}:00
                                    </Typography>
                                    <Typography variant="body2">
                                        Temp: {hour.temperature}°C
                                    </Typography>
                                    <Typography variant="body2">
                                        {hour.weatherCondition ? hour.weatherCondition.charAt(0).toUpperCase() + hour.weatherCondition.slice(1) : 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* 7 Days Forecast Card */}
            <Card className="forecast-card" style={{ marginTop: '20px' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        7 Days Forecast
                    </Typography>
                    <Box className="daily-forecast">
                        {dailyPredictions.map((daily) => (
                            <Card key={daily.date} className="daily-card">
                                <CardContent style={{ textAlign: 'center' }}>
                                    <Typography variant="h6">
                                        {daily.day_of_week} - {daily.date.split('-')[2]}-{daily.date.split('-')[1]}
                                    </Typography>
                                    <Typography variant="body1">
                                        {daily.temperature}°C
                                    </Typography>
                                    {/* Use an icon that matches the weather condition */}
                                    <img 
                                        src={`path_to_icons/${daily.weatherCondition}.png`} 
                                        alt={daily.weatherCondition} 
                                        className="weather-icon" 
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForecastOverview;
