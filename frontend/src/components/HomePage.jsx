// HomePage.jsx
import React, { useState, useEffect } from "react";
import { Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import WeatherOverview from "./WeatherOverview";
import SearchLocation from "./SearchLocation";
import LoadingSpinner from "./LoadingSpinner";
import ForecastOverview from "./ForecastOverview";
import "./HomePage.css";

function HomePage() {
  const [locations, setLocations] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [backgroundStyles, setBackgroundStyles] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/locations")
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
        const randomLocation = data[Math.floor(Math.random() * data.length)];
        setSelectedLocation(randomLocation);
        fetchPredictions(randomLocation);
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  const fetchPredictions = (location) => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPredictions(data);
        const humidity = data[0]?.humidity_9am || 0;
        setBackgroundStyles(getBackgroundStyles(humidity));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error);
        setLoading(false);
      });
  };

  const getBackgroundStyles = (humidity) => {
    if (humidity > 70) {
      return { className: "rainy-background" };
    } else if (humidity > 30) {
      return { className: "cloudy-background" };
    }
    return { className: "sunny-background" };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={backgroundStyles.className}
      style={{ height: "90vh", color: "white", padding: "20px", width: "100%", overflow: "hidden" }}
    >
      <Container maxWidth="xxl" style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Grid container spacing={3} style={{ height: "100%" }}>
          <Grid item xs={12} md={4}>
            <SearchLocation
              locations={locations}
              setSelectedLocation={setSelectedLocation}
              fetchPredictions={fetchPredictions}
            />
            {loading && <LoadingSpinner />}
            {predictions.length > 0 && (
              <WeatherOverview predictions={predictions} />
            )}
          </Grid>
          <Grid item xs={12} md={8}>
          <ForecastOverview 
            hourlyPredictions={hourlyPredictions} 
            sevenDayPredictions={sevenDayPredictions} 
          />
            {/* Add any additional content you want on the right side */}
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}

export default HomePage;
