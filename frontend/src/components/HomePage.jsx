import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import { Container, Grid } from "@mui/material"; // Importing Material UI components for layout
import { motion } from "framer-motion"; // Importing motion for animation effects
import WeatherOverview from "./WeatherOverview"; // Importing WeatherOverview component
import SearchLocation from "./SearchLocation"; // Importing SearchLocation component
import LoadingSpinner from "./LoadingSpinner"; // Importing loading spinner component
import ForecastOverview from "./ForecastOverview"; // Importing ForecastOverview component
import { Link } from "react-router-dom"; // Importing Link for navigation
import axios from "axios"; // Importing Axios for making HTTP requests
import "./HomePage.css"; // Importing CSS for styling

function HomePage() {
  // State variables
  const [locations, setLocations] = useState([]); // Stores the list of locations
  const [predictions, setPredictions] = useState([]); // Stores the weather predictions
  const [loading, setLoading] = useState(false); // Loading state for fetching predictions
  const [selectedLocation, setSelectedLocation] = useState(""); // Stores the currently selected location
  const [inputValue, setInputValue] = useState(""); // Manages the input value of the location search
  const [backgroundStyles, setBackgroundStyles] = useState({}); // Styles for the background based on weather conditions

  useEffect(() => {
    // Fetch locations from the API when the component mounts
    axios.get("http://127.0.0.1:8000/locations")
      .then((response) => {
        const data = response.data; // Get the data from the response
        setLocations(data); // Set the locations state with fetched data
        const randomLocation = data[Math.floor(Math.random() * data.length)]; // Select a random location
        setSelectedLocation(randomLocation); // Set the selected location
        setInputValue(randomLocation); // Set the input value to the random location
        fetchPredictions(randomLocation); // Fetch predictions for the selected random location
      })
      .catch((error) => console.error("Error fetching locations:", error)); // Log any errors
  }, []); // Empty dependency array ensures this runs only once on mount

  const fetchPredictions = (location) => {
    setLoading(true); // Set loading to true while fetching predictions
    axios.post(`http://127.0.0.1:8000/predict`, {
      location // Send the selected location in the request body
    })
      .then((response) => {
        const data = response.data; // Get the data from the response
        setPredictions(data); // Set the predictions state with fetched data
        const humidity = data[0]?.humidity_9am || 0; // Get humidity from predictions, default to 0
        setBackgroundStyles(getBackgroundStyles(humidity)); // Set background styles based on humidity
        setLoading(false); // Set loading to false after fetching is complete
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error); // Log any errors
        setLoading(false); // Set loading to false on error
      });
  };

  // Function to determine background styles based on humidity levels
  const getBackgroundStyles = (humidity) => {
    if (humidity > 70) {
      return { className: "rainy-background" }; // Return rainy styles for high humidity
    } else if (humidity > 30) {
      return { className: "cloudy-background" }; // Return cloudy styles for moderate humidity
    }
    return { className: "sunny-background" }; // Return sunny styles for low humidity
  };

  return (
    // Motion div for animation effects on the main container
    <motion.div
      initial={{ opacity: 0 }} // Initial opacity
      animate={{ opacity: 1 }} // Animate to full opacity
      exit={{ opacity: 0 }} // Exit animation to fade out
      className={backgroundStyles.className} // Set background class based on weather
      style={{
        minHeight: "100vh", // Set minimum height to full viewport height
        color: "white", // Text color
        padding: "20px", // Padding around the content
        width: "100%", // Full width
        overflow: "hidden", // Prevent overflow of content
      }}
    >
      <Container maxWidth="xxl" style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Grid container spacing={3} style={{ height: "100%", overflow: "hidden" }}> {/* Prevent overflow for the grid */}
          <Grid item xs={12} md={4}>
            <SearchLocation
              locations={locations} // Pass locations to SearchLocation
              setSelectedLocation={setSelectedLocation} // Pass function to set selected location
              fetchPredictions={fetchPredictions} // Pass function to fetch predictions
              inputValue={inputValue} // Pass input value for the search
              setInputValue={setInputValue} // Pass function to update input value
            />
            {loading && <LoadingSpinner />} {/* Show loading spinner while fetching predictions */}
            {predictions.length > 0 && (
              <Link to="/statistics" style={{ textDecoration: "none" }}> {/* Link to statistics page */}
                <div className="weather-card">
                  <WeatherOverview predictions={predictions} /> {/* Display weather overview */}
                </div>
              </Link>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            {selectedLocation && (
              <ForecastOverview
                location={selectedLocation} // Pass selected location
                predictions={predictions} // Pass predictions for the forecast
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}

export default HomePage; // Export the HomePage component
