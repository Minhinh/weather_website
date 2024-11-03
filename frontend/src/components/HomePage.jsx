import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  TextField,
  Popper,
  Paper,
  Grid,
  ClickAwayListener,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import CloudIcon from "@mui/icons-material/Cloud";
import SunnyIcon from "@mui/icons-material/WbSunny";
import RainyIcon from "@mui/icons-material/Water";
import AirIcon from "@mui/icons-material/Air";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import ThermostatAutoIcon from "@mui/icons-material/ThermostatAuto";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import "./HomePage.css";

function Homepage() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [backgroundStyles, setBackgroundStyles] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/locations")
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
        setFilteredLocations(data);
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

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchInput(query);
    const matches = locations.filter((location) =>
      location.toLowerCase().includes(query)
    );
    setFilteredLocations(matches);
    setAnchorEl(event.currentTarget);
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setSearchInput(location);
    fetchPredictions(location);
    setAnchorEl(null);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const getBackgroundStyles = (humidity) => {
    if (humidity > 70) {
      return { className: "rainy-background" };
    } else if (humidity > 30) {
      return { className: "cloudy-background" };
    }
    return { className: "sunny-background" };
  };

  const calculateAverageTemp = () => {
    if (predictions.length > 0) {
      const maxTemp = predictions[0].max_temp;
      const minTemp = predictions[0].min_temp;
      return ((maxTemp + minTemp) / 2).toFixed(1);
    }
    return 0;
  };

  const getWeatherCondition = () => {
    if (predictions.length > 0) {
      if (predictions[0].rainfall > 0) return "Rainy Day";
      if (predictions[0].max_temp > 30) return "Sunny Day";
      return "Cloudy Day";
    }
    return "";
  };

  const weatherCondition = getWeatherCondition();
  const averageTemp = calculateAverageTemp();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={backgroundStyles.className}
      style={{
        height: "100vh",
        color: "white",
        padding: "20px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Grid container spacing={3} style={{ height: "100%" }}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ fontWeight: "bold", color: "#BBDEFB" }}
            >
              Weather Prediction
            </Typography>

            <TextField
              fullWidth
              label="Search Location"
              variant="outlined"
              onChange={handleSearchChange}
              value={searchInput}
              style={{
                marginBottom: "20px",
                backgroundColor: "#1C1C1C",
                color: "white",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
              }}
              InputLabelProps={{ style: { color: "#BBDEFB" } }}
              InputProps={{
                style: { color: "white" },
                sx: { borderRadius: "10px" },
                startAdornment: <SearchIcon style={{ color: "white" }} />,
              }}
            />

            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
              <Paper>
                <ClickAwayListener onClickAway={handleDropdownClose}>
                  <Box>
                    {filteredLocations.map((location, index) => (
                      <Typography
                        key={index}
                        onClick={() => handleLocationClick(location)}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          backgroundColor: "#f0f0f0",
                          color: "#000",
                          borderRadius: "5px",
                          margin: "5px 0",
                        }}
                      >
                        {location}
                      </Typography>
                    ))}
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Popper>

            {loading && <CircularProgress color="inherit" />}

            {predictions.length > 0 && (
              <Card
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                  height: "500px", // Increase height
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h5" align="center" style={{ color: "#BBDEFB" }}>
                    Weather Overview
                  </Typography>
                  <Typography variant="h6" align="center" style={{ color: "#FFEB3B" }}>
                    {weatherCondition}
                  </Typography>
                  <Typography variant="body1" align="center" style={{ color: "white" }}>
                    {weatherCondition === "Rainy Day" ? (
                      <RainyIcon style={{ color: "yellow" }} />
                    ) : weatherCondition === "Sunny Day" ? (
                      <SunnyIcon style={{ color: "yellow" }} />
                    ) : (
                      <CloudIcon style={{ color: "white" }} />
                    )}
                    {weatherCondition === "Rainy Day"
                      ? ` Today the expectation is rainy, with a high temp of ${predictions[0].max_temp}°C. Grab your umbrella!`
                      : weatherCondition === "Sunny Day"
                      ? ` Expect a sunny day with a high temp of ${predictions[0].max_temp}°C. Enjoy the sunshine!`
                      : ` It might be cloudy today with a high temp of ${predictions[0].max_temp}°C.`}
                  </Typography>
                  <Typography variant="body1" align="center" style={{ color: "white" }}>
                    <strong>Average Temp: {averageTemp}°C</strong>
                  </Typography>

                  <Grid container spacing={2} style={{ marginTop: "100px" }}>
                    {/* Temperature, Humidity, and Wind Info Boxes */}
                    <Grid item xs={6}>
                      <Card
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "10px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                          height: "100px",
                          textAlign: "center",
                        }}
                      >
                        <CardContent>
                          <ThermostatAutoIcon style={{ color: "#BBDEFB", fontSize: 30 }} />
                          <Typography variant="body2" style={{ color: "white" }}>
                            Temperature
                          </Typography>
                          <Typography variant="body2" style={{ color: "white" }}>
                            {averageTemp}°C
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={6}>
                      <Card
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "10px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                          height: "100px",
                          textAlign: "center",
                        }}
                      >
                        <CardContent>
                          <InvertColorsIcon style={{ color: "#BBDEFB", fontSize: 30 }} />
                          <Typography variant="body2" style={{ color: "white" }}>
                            Humidity
                          </Typography>
                          <Typography variant="body2" style={{ color: "white" }}>
                            {predictions[0]?.humidity_9am}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={6}>
                      <Card
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "10px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                          height: "100px",
                          textAlign: "center",
                        }}
                      >
                        <CardContent>
                          <AirIcon style={{ color: "#BBDEFB", fontSize: 30 }} />
                          <Typography variant="body2" style={{ color: "white" }}>
                            Wind Speed
                          </Typography>
                          <Typography variant="body2" style={{ color: "white" }}>
                            {predictions[0]?.wind_speed_9am} km/h
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={6}>
                      <Card
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "10px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                          height: "100px",
                          textAlign: "center",
                        }}
                      >
                        <CardContent>
                          <WbSunnyIcon style={{ color: "#BBDEFB", fontSize: 30 }} />
                          <Typography variant="body2" style={{ color: "white" }}>
                            Sunshine
                          </Typography>
                          <Typography variant="body2" style={{ color: "white" }}>
                            {predictions[0]?.sunshine_hours} hrs
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            {/* Add any additional content you want on the right side */}
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}

export default Homepage;
