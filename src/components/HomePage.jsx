// src/components/HomePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function HomePage() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });

  const toDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };

  const search = async (event) => {
    event.preventDefault();
    if (
      event.type === "click" ||
      (event.type === "keypress" && event.key === "Enter")
    ) {
      setWeather({ ...weather, loading: true });
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const url = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`;

      await axios
        .get(url)
        .then((res) => {
          setWeather({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const url = `https://api.shecodes.io/weather/v1/current?query=Rabat&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        setWeather({ data: response.data, loading: false, error: false });
      } catch (error) {
        setWeather({ data: {}, loading: false, error: true });
      }
    };

    fetchData();
  }, []);

  return (
    <Container
      className="App"
      maxWidth="md"
      style={{
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "transparent",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ color: "#00796b", fontWeight: "bold" }}
      >
        Weather Forecast
      </Typography>

      <SearchEngine query={query} setQuery={setQuery} search={search} />

      <Box display="flex" justifyContent="center" flexWrap="wrap" mt={4}>
        <Card className="card">
          <CardContent>
            {weather.loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress color="primary" />
              </Box>
            ) : weather.error ? (
              <Typography variant="h6" color="error" align="center">
                Sorry, city not found. Please try again.
              </Typography>
            ) : (
              <Forecast weather={weather} toDate={toDate} />
            )}
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent>
            <Typography variant="h5" align="center">
              Card 2
            </Typography>
            <Typography variant="body2" align="center">
              Additional weather information can go here.
            </Typography>
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent>
            <Typography variant="h5" align="center">
              Card 3
            </Typography>
            <Typography variant="body2" align="center">
              Further statistics or graphics can be included here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default HomePage;
