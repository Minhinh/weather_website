// WeatherOverview.jsx
import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import SunnyIcon from "@mui/icons-material/WbSunny";
import ThermostatAutoIcon from "@mui/icons-material/ThermostatAuto";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import AirIcon from "@mui/icons-material/Air";
import WeatherInfoCard from "./WeatherInfoCard";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
function WeatherOverview({ predictions }) {
  const weatherCondition = getWeatherCondition(predictions);
  const averageTemp = calculateAverageTemp(predictions);
  const minTemp = predictions[0]?.min_temp || 0;
  const maxTemp = predictions[0]?.max_temp || 0;

  return (
    <Card
      style={{
        marginTop: "20px",
        padding: "20px", // Increased padding
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        height: "750px", // Increased height
      }}
    >
      <CardContent>
        <Typography
          variant="body1"
          align="center"
          style={{ color: "white", fontSize: "50px" }}
        >
          <strong>{averageTemp}°C</strong>
        </Typography>
        <Typography
          variant="h2"
          align="center"
          style={{ color: "#FFEB3B", fontSize: "40px" }}
        >
          {getWeatherIcon(weatherCondition)}
          {weatherCondition}
        </Typography>

        {/* Moved the message and icon lower */}
        <Typography
          variant="body1"
          align="center"
          style={{ color: "white", fontSize: "14px", marginTop: "60px" }}
        >
          {getWeatherMessage(weatherCondition, predictions)}
        </Typography>

        <Grid container spacing={2} style={{ marginTop: "40px" }}>
          {/* Min and Max Temperature Boxes */}
          <Grid item xs={6}>
            <WeatherInfoCard
              title="Max Temperature"
              value={`${maxTemp}°C`}
              icon={<WbSunnyIcon />}
              cardStyle={{ height: "200px", padding: "20px" }}
            />
          </Grid>

          <Grid item xs={6}>
            <WeatherInfoCard
              title="Min Temperature"
              value={`${minTemp}°C`}
              icon={<ThermostatAutoIcon />}
              cardStyle={{ height: "200px", padding: "40px" }}
            />
          </Grid>

          {/* Humidity, Wind Speed, and Sunshine Info Boxes */}
          <Grid item xs={6}>
            <WeatherInfoCard
              title="Humidity"
              value={`${predictions[0]?.humidity_9am}%`}
              icon={<InvertColorsIcon />}
              cardStyle={{ height: "200px", padding: "20px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <WeatherInfoCard
              title="Wind Speed"
              value={`${predictions[0]?.wind_speed_9am} km/h`}
              icon={<AirIcon />}
              cardStyle={{ height: "200px", padding: "20px" }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

const getWeatherCondition = (predictions) => {
  if (predictions.length > 0) {
    if (predictions[0].rainfall > 0) return "Rainy Day";
    if (predictions[0].max_temp > 30) return "Sunny Day";
    return "Cloudy Day";
  }
  return "";
};

const calculateAverageTemp = (predictions) => {
  if (predictions.length > 0) {
    const maxTemp = predictions[0].max_temp;
    const minTemp = predictions[0].min_temp;
    return ((maxTemp + minTemp) / 2).toFixed(1);
  }
  return 0;
};

const getWeatherIcon = (weatherCondition) => {
  const iconStyle = { fontSize: "40px" }; // Adjust the size as needed
  switch (weatherCondition) {
    case "Rainy Day":
      return <ThunderstormIcon style={{ ...iconStyle, color: "White" }} />;
    case "Sunny Day":
      return <SunnyIcon style={{ ...iconStyle, color: "yellow" }} />;
    default:
      return <CloudIcon style={{ ...iconStyle, color: "white" }} />;
  }
};

const getWeatherMessage = (weatherCondition, predictions) => {
  if (weatherCondition === "Rainy Day") {
    return ` Today the expectation is going to be rainy, with a temperature reaching to a maximum of ${predictions[0].max_temp}°C. 
    Make sure to grab your umbrella and raincoat before heading out. Have a nice day!`;
  } else if (weatherCondition === "Sunny Day") {
    return ` Today the expectation is going to be sunny, with a temperature reaching to a maximum of ${predictions[0].max_temp}°C. Enjoy the sunshine and have a nice day!`;
  }
  return ` Today the expectation is going to be cloudy, with a temperature reaching to a maximum of ${predictions[0].max_temp}°C. 
  Make sure to grab your umbrella and raincoat before heading out. Have a nice day!`;
};

export default WeatherOverview;
