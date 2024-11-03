import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Cloud, WbSunny, Umbrella, WarningAmber, AccessTime, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ForecastOverview = ({ location, predictions }) => {
    const navigate = useNavigate(); // Use useNavigate for routing

    if (!predictions || predictions.length === 0) {
        return <div>No predictions available for {location}.</div>;
    }

    const today = new Date();
    today.setHours(22, 0, 0, 0);

    const hourlyForecasts = Array.from({ length: 24 }, (_, index) => {
        const hour = new Date(today);
        hour.setHours(today.getHours() + index);
        const forecast = predictions.flatMap(daily => daily.hourly_predictions)[index % predictions[0].hourly_predictions.length] || {};
        return {
            time: hour,
            temperature: forecast.temperature || 'N/A',
            condition: forecast.condition || 'Sunny',
        };
    });

    const dailyForecasts = predictions.slice(0, 7);

    const getDayOfWeek = (dayIndex) => {
        const day = new Date();
        day.setDate(today.getDate() + dayIndex);
        return day.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const getWeatherIcon = (condition) => {
        switch (condition) {
            case 'Sunny':
                return <WbSunny style={{ color: 'white' }} />;
            case 'Rainy':
                return <Umbrella style={{ color: 'white' }} />;
            case 'Cloudy':
                return <Cloud style={{ color: 'white' }} />;
            default:
                return <WbSunny style={{ color: 'white' }} />;
        }
    };

    const handleCardClick = () => {
        navigate('/statistics'); // Use navigate to route to the Statistics page
    };

    return (
        <div className="forecast-overview" style={{ margin: '20px', color: 'white' }}>
            <Paper elevation={3} style={{ padding: '16px', marginBottom: '20px', backgroundColor: 'transparent' }}>
                <Typography variant="h6" gutterBottom>
                    <AccessTime style={{ verticalAlign: 'middle', color: 'white' }} /> Hourly Forecast for {location} 
                </Typography>
                <div style={{ display: 'flex', overflowX: 'auto', padding: '10px' }}>
                    {hourlyForecasts.map((hour, index) => (
                        <Paper
                            key={index}
                            elevation={2}
                            style={{
                                minWidth: '120px',
                                height: '120px',
                                margin: '0 7px',
                                padding: '16px',
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                                color: 'white',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer',
                            }}
                            onClick={handleCardClick} // Route to Statistics on click
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale up on hover
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale on leave
                        >
                            <Typography variant="body2">{hour.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                            <Typography variant="body1">Temp: {hour.temperature}°C</Typography>
                            {getWeatherIcon(hour.condition)}
                        </Paper>
                    ))}
                </div>
            </Paper>

            <Paper elevation={3} style={{ marginTop: '20px', padding: '16px', backgroundColor: 'transparent' }}>
                <Typography variant="h6" gutterBottom>
                    <CalendarToday style={{ verticalAlign: 'middle', color: 'white' }} /> Daily Forecast for {location}
                </Typography>
                <div style={{ display: 'flex', overflowX: 'auto', padding: '10px' }}>
                    {dailyForecasts.map((daily, index) => (
                        <Paper
                            key={index}
                            elevation={2}
                            style={{
                                minWidth: '150px',
                                height: '120px',
                                margin: '0 5px',
                                padding: '16px',
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                                color: 'white',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer',
                            }}
                            onClick={handleCardClick} // Route to Statistics on click
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale up on hover
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale on leave
                        >
                            <Typography variant="body2">{getDayOfWeek(index)}</Typography>
                            <Typography variant="body1">Max: {daily.max_temp}°C</Typography>
                            <Typography variant="body1">Min: {daily.min_temp}°C</Typography>
                            {getWeatherIcon(daily.weather_condition)}
                        </Paper>
                    ))}
                </div>
            </Paper>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <Paper
                    elevation={2}
                    style={{
                        minWidth: '150px',
                        height: '120px',
                        margin: '0 5px',
                        padding: '16px',
                        textAlign: 'center',
                        backgroundColor: 'transparent',
                        color: 'white',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                    }}
                    onClick={handleCardClick} // Route to Statistics on click
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale up on hover
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale on leave
                >
                    <Typography variant="body1">Wind Gust Speed</Typography>
                    <Typography variant="h6">{predictions[0].wind_speed_3pm} km/h</Typography>
                </Paper>
                <Paper
                    elevation={2}
                    style={{
                        minWidth: '150px',
                        height: '120px',
                        margin: '0 5px',
                        padding: '16px',
                        textAlign: 'center',
                        backgroundColor: 'transparent',
                        color: 'white',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                    }}
                    onClick={handleCardClick} // Route to Statistics on click
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale up on hover
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale on leave
                >
                    <Typography variant="body1">Number of Accidents</Typography>
                    <Typography variant="h6">{predictions[0].total_accidents}</Typography>
                </Paper>
                <Paper
                    elevation={2}
                    style={{
                        minWidth: '150px',
                        height: '120px',
                        margin: '0 5px',
                        padding: '16px',
                        textAlign: 'center',
                        backgroundColor: 'transparent',
                        color: 'white',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                    }}
                    onClick={handleCardClick} // Route to Statistics on click
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale up on hover
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale on leave
                >
                    <Typography variant="body1">Rainfall</Typography>
                    <Typography variant="h6">{predictions[0].rainfall} mm</Typography>
                </Paper>
            </div>

            {predictions[0].rainfall > 60 && (
                <Paper
                    elevation={3}
                    style={{
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        color: 'white',
                        borderRadius: '8px',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale up on hover
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale on leave
                >
                    <Typography variant="h6" gutterBottom>
                        <WarningAmber fontSize="large" /> ⚠️ Rainfall Warning!
                    </Typography>
                    <Typography variant="body1">
                        Expected rainfall is over 60 mm. Please take necessary precautions.
                    </Typography>
                </Paper>
            )}
        </div>
    );
};

export default ForecastOverview;
