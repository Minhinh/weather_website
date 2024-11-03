// WeatherOverview.jsx
import React from "react"; // Importing React
import { Card, CardContent, Typography, Grid } from "@mui/material"; // Importing Material UI components for layout
import CloudIcon from "@mui/icons-material/Cloud"; // Importing icons for weather conditions
import SunnyIcon from "@mui/icons-material/WbSunny"; // Importing sunny icon
import ThermostatAutoIcon from "@mui/icons-material/ThermostatAuto"; // Importing icon for temperature
import InvertColorsIcon from "@mui/icons-material/InvertColors"; // Importing icon for humidity
import AirIcon from "@mui/icons-material/Air"; // Importing icon for wind speed
import WeatherInfoCard from "./WeatherInfoCard"; // Importing WeatherInfoCard component for displaying weather info
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Importing icon for maximum temperature
import ThunderstormIcon from "@mui/icons-material/Thunderstorm"; // Importing icon for rainy weather

function WeatherOverview({ predictions }) {
  // Determine the current weather condition and other metrics based on predictions
  const weatherCondition = getWeatherCondition(predictions); // Get the weather condition
  const averageTemp = calculateAverageTemp(predictions); // Calculate average temperature
  const minTemp = predictions[0]?.min_temp || 0; // Get minimum temperature or default to 0
  const maxTemp = predictions[0]?.max_temp || 0; // Get maximum temperature or default to 0

  return (
    <Card
      style={{
        marginTop: "20px", // Top margin for spacing
        padding: "20px", // Increased padding for the card
        backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
        borderRadius: "10px", // Rounded corners
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)", // Shadow effect for the card
        height: "750px", // Fixed height for the card
      }}
    >
      <CardContent>
        {/* Display the average temperature */}
        <Typography
          variant="body1"
          align="center"
          style={{ color: "white", fontSize: "50px" }} // Styling for temperature display
        >
          <strong>{averageTemp}°C</strong>
        </Typography>
        {/* Display weather condition and icon */}
        <Typography
          variant="h2"
          align="center"
          style={{ color: "#FFEB3B", fontSize: "40px" }} // Styling for weather condition text
        >
          {getWeatherIcon(weatherCondition)} {/* Display the corresponding weather icon */}
          {weatherCondition} {/* Display the weather condition */}
        </Typography>

        {/* Weather message based on condition */}
        <Typography
          variant="body1"
          align="center"
          style={{ color: "white", fontSize: "14px", marginTop: "60px" }} // Styling for the message
        >
          {getWeatherMessage(weatherCondition, predictions)} {/* Get and display the weather message */}
        </Typography>

        <Grid container spacing={2} style={{ marginTop: "40px" }}> {/* Grid layout for weather info boxes */}
          {/* Max Temperature Box */}
          <Grid item xs={6}>
            <WeatherInfoCard
              title="Max Temperature" // Title for the card
              value={`${maxTemp}°C`} // Value for the max temperature
              icon={<WbSunnyIcon />} // Icon for max temperature
              cardStyle={{ height: "200px", padding: "20px" }} // Card styles
            />
          </Grid>

          {/* Min Temperature Box */}
          <Grid item xs={6}>
            <WeatherInfoCard
              title="Min Temperature" // Title for the card
              value={`${minTemp}°C`} // Value for the min temperature
              icon={<ThermostatAutoIcon />} // Icon for min temperature
              cardStyle={{ height: "200px", padding: "40px" }} // Card styles
            />
          </Grid>

          {/* Humidity Box */}
          <Grid item xs={6}>
            <WeatherInfoCard
              title="Humidity" // Title for the card
              value={`${predictions[0]?.humidity_9am}%`} // Value for humidity
              icon={<InvertColorsIcon />} // Icon for humidity
              cardStyle={{ height: "200px", padding: "20px" }} // Card styles
            />
          </Grid>
          {/* Wind Speed Box */}
          <Grid item xs={6}>
            <WeatherInfoCard
              title="Wind Speed" // Title for the card
              value={`${predictions[0]?.wind_speed_9am} km/h`} // Value for wind speed
              icon={<AirIcon />} // Icon for wind speed
              cardStyle={{ height: "200px", padding: "20px" }} // Card styles
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Function to determine the weather condition based on predictions
const getWeatherCondition = (predictions) => {
  if (predictions.length > 0) {
    if (predictions[0].rainfall > 0) return "Rainy Day"; // Check if there is rainfall
    if (predictions[0].max_temp > 30) return "Sunny Day"; // Check if max temperature is over 30
    return "Cloudy Day"; // Default to cloudy if neither condition is met
  }
  return ""; // Return empty if there are no predictions
};

// Function to calculate the average temperature from the predictions
const calculateAverageTemp = (predictions) => {
  if (predictions.length > 0) {
    const maxTemp = predictions[0].max_temp; // Get max temperature
    const minTemp = predictions[0].min_temp; // Get min temperature
    return ((maxTemp + minTemp) / 2).toFixed(1); // Return average temperature rounded to 1 decimal place
  }
  return 0; // Return 0 if no predictions available
};

// Function to get the corresponding weather icon based on the weather condition
const getWeatherIcon = (weatherCondition) => {
  const iconStyle = { fontSize: "40px" }; // Define the style for icons
  switch (weatherCondition) {
    case "Rainy Day":
      return <ThunderstormIcon style={{ ...iconStyle, color: "White" }} />; // Return thunderstorm icon for rainy days
    case "Sunny Day":
      return <SunnyIcon style={{ ...iconStyle, color: "yellow" }} />; // Return sunny icon for sunny days
    default:
      return <CloudIcon style={{ ...iconStyle, color: "white" }} />; // Return cloud icon for cloudy days
  }
};

// Function to generate a weather message based on the weather condition and predictions
const getWeatherMessage = (weatherCondition, predictions) => {
  if (weatherCondition === "Rainy Day") {
    return ` Today the expectation is going to be rainy, with a temperature reaching a maximum of ${predictions[0].max_temp}°C. 
    Make sure to grab your umbrella and raincoat before heading out. Have a nice day!`;
  } else if (weatherCondition === "Sunny Day") {
    return ` Today the expectation is going to be sunny, with a temperature reaching a maximum of ${predictions[0].max_temp}°C. Enjoy the sunshine and have a nice day!`;
  }
  return ` Today the expectation is going to be cloudy, with a temperature reaching a maximum of ${predictions[0].max_temp}°C. 
  Make sure to grab your umbrella and raincoat before heading out. Have a nice day!`;
};

export default WeatherOverview; // Exporting the WeatherOverview component
