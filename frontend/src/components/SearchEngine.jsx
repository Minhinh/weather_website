// src/components/SearchBar.jsx
import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

function SearchBar({ onSearch }) {
  const [inputs, setInputs] = useState({
    minTemp: "",
    maxTemp: "",
    humidity9am: "",
    humidity3pm: "",
    windSpeed9am: "",
    windSpeed3pm: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(inputs); // Pass the inputs back to the parent component
  };

  return (
    <Box component="form" onSubmit={handleSearch} display="flex" flexDirection="column" alignItems="center">
      <TextField
        name="minTemp"
        label="Min Temperature"
        type="number"
        variant="outlined"
        onChange={handleInputChange}
        style={{ margin: "5px" }}
        required
      />
      <TextField
        name="maxTemp"
        label="Max Temperature"
        type="number"
        variant="outlined"
        onChange={handleInputChange}
        style={{ margin: "5px" }}
        required
      />
      <TextField
        name="humidity9am"
        label="Humidity 9 AM"
        type="number"
        variant="outlined"
        onChange={handleInputChange}
        style={{ margin: "5px" }}
        required
      />
      <TextField
        name="humidity3pm"
        label="Humidity 3 PM"
        type="number"
        variant="outlined"
        onChange={handleInputChange}
        style={{ margin: "5px" }}
        required
      />
      <TextField
        name="windSpeed9am"
        label="Wind Speed 9 AM"
        type="number"
        variant="outlined"
        onChange={handleInputChange}
        style={{ margin: "5px" }}
        required
      />
      <TextField
        name="windSpeed3pm"
        label="Wind Speed 3 PM"
        type="number"
        variant="outlined"
        onChange={handleInputChange}
        style={{ margin: "5px" }}
        required
      />
      <Button variant="contained" color="primary" type="submit" style={{ marginTop: "10px" }}>
        Get Weather Prediction
      </Button>
    </Box>
  );
}

export default SearchBar;
