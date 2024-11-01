import React from "react";
import { Typography } from "@mui/material";

function Forecast({ weather, toDate }) {
  // Check if weather data is available
  const weatherData = weather.data;

  return (
    <>
      {weatherData && weatherData.current ? (
        <>
          <Typography variant="h5" align="center" style={{ color: "#00796b" }}>
            {weatherData.location.name}
          </Typography>
          <Typography variant="subtitle1" align="center">
            {toDate()}
          </Typography>
          <Typography variant="h6" align="center">
            Temperature: {weatherData.current.temperature}°C
          </Typography>
          <Typography variant="body1" align="center">
            Humidity: {weatherData.current.humidity}%
          </Typography>
          <Typography variant="body1" align="center">
            Wind Speed: {weatherData.current.wind_speed} km/h
          </Typography>
        </>
      ) : (
        <Typography variant="h6" align="center" color="textSecondary">
          No weather data available.
        </Typography>
      )}
    </>
  );
}

export default Forecast;
