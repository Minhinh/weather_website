import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Cloud, WbSunny, Umbrella } from '@mui/icons-material';

const ForecastOverview = ({ location, predictions }) => {
    // Return early if predictions are not available
    if (!predictions || predictions.length === 0) {
        return <div>No predictions available for {location}.</div>;
    }

    // Get the current hour
    const currentHour = new Date().getHours();

    // Get hourly forecasts for the next 24 hours
    const hourlyForecasts = predictions.flatMap(daily => daily.hourly_predictions).slice(currentHour, currentHour + 24);

    // Daily forecasts for the next 7 days
    const dailyForecasts = predictions.slice(0, 7);

    const getWeatherIcon = (condition) => {
        switch (condition) {
            case 'Sunny':
                return <WbSunny />;
            case 'Rainy':
                return <Umbrella />;
            case 'Cloudy':
                return <Cloud />;
            default:
                return <WbSunny />;
        }
    };

    // Get today's date for displaying day of the week
    const options = { weekday: 'short' };
    const today = new Date().toLocaleDateString('en-US', options);

    // Assume these are the last predictions for accidents, wind gusts, and rainfall
    const windGustSpeed = predictions[0].wind_gust_speed; // Replace with actual data source
    const numberOfAccidents = predictions[0].total_accidents; // Replace with actual data source
    const totalRainfall = predictions[0].rainfall; // Replace with actual data source

    return (
        <div className="forecast-overview" style={{ margin: '20px', color: 'white' }}>
            {/* Hourly Forecast Section */}
            <Paper elevation={3} style={{ padding: '16px', marginBottom: '20px', backgroundColor: 'transparent' }}>
                <Typography variant="h6" gutterBottom>
                    Hourly Forecast for {location}
                </Typography>
                <div style={{ display: 'flex', overflowX: 'auto', padding: '10px' }}>
                    {hourlyForecasts.map((hour, index) => (
                        <Paper key={index} elevation={2} style={{ minWidth: '120px', height: '120px', margin: '0 7px', padding: '16px', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}>
                            <Typography variant="body2">
                                {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Loading...'}
                            </Typography>
                            <Typography variant="body1">Temp: {hour.temperature}°C</Typography>
                            {getWeatherIcon(hour.condition)}
                        </Paper>
                    ))}
                </div>
            </Paper>

            {/* Daily Forecast Section */}
            <Paper elevation={3} style={{ marginTop: '20px', padding: '16px', backgroundColor: 'transparent' }}>
                <Typography variant="h6" gutterBottom>
                    Daily Forecast for {location}
                </Typography>
                <div style={{ display: 'flex', overflowX: 'auto', padding: '10px' }}>
                    {dailyForecasts.map((daily, index) => {
                        // Check if daily.date is valid, fallback if necessary
                        const date = new Date(daily.date);
                        const dayName = isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', { weekday: 'short' });
                        
                        return (
                            <Paper key={index} elevation={2} style={{ minWidth: '150px', height: '120px', margin: '0 5px', padding: '16px', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}>
                                <Typography variant="body2">{dayName}</Typography>
                                <Typography variant="body1">Max: {daily.max_temp}°C</Typography>
                                <Typography variant="body1">Min: {daily.min_temp}°C</Typography>
                                {getWeatherIcon(daily.weather_condition)}
                            </Paper>
                        );
                    })}
                </div>
            </Paper>

            {/* Additional Information Section */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <Paper elevation={2} style={{ minWidth: '150px', height: '120px', margin: '0 5px', padding: '16px', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}>
                    <Typography variant="body1">Wind Gust Speed</Typography>
                    <Typography variant="h6">{windGustSpeed} km/h</Typography>
                </Paper>
                <Paper elevation={2} style={{ minWidth: '150px', height: '120px', margin: '0 5px', padding: '16px', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}>
                    <Typography variant="body1">Number of Accidents</Typography>
                    <Typography variant="h6">{numberOfAccidents}</Typography>
                </Paper>
                <Paper elevation={2} style={{ minWidth: '150px', height: '120px', margin: '0 5px', padding: '16px', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}>
                    <Typography variant="body1">Rainfall</Typography>
                    <Typography variant="h6">{totalRainfall} mm</Typography>
                </Paper>
            </div>
            
            {/* Warning Card for High Rainfall */}
            {totalRainfall > 60 && (
                <Paper  
                    elevation={3} 
                    style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(255, 0, 0, 0.5)', color: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
                >
                    <Typography variant="h6" gutterBottom>
                        ⚠️ Rainfall Warning!
                    </Typography>
                    <Typography variant="body1">
                        Expected rainfall is over 60mm. Please take necessary precautions!
                    </Typography>
                </Paper>
            )}
        </div>
    );
};

export default ForecastOverview;
