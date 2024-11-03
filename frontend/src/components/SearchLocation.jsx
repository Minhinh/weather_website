import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Paper,
} from "@mui/material";

// The SearchLocation component allows users to search for locations using an autocomplete input.
function SearchLocation({
  locations,
  setSelectedLocation,
  fetchPredictions,
  inputValue,
  setInputValue,
}) {
  // Local state to manage loading status of the autocomplete options
  const [loading, setLoading] = useState(false);

  // Handler for when a location is selected from the autocomplete
  const handleLocationChange = (event, value) => {
    // Check if a valid value is selected
    if (value) {
      // Set the selected location in the parent component
      setSelectedLocation(value);
      // Fetch predictions for the selected location
      fetchPredictions(value);
    }
  };

  return (
    // Autocomplete component for location selection
    <Autocomplete
      options={locations} // Set available options from the parent component
      value={inputValue} // Control the current value of the input field
      onChange={handleLocationChange} // Handle location selection
      onInputChange={(event, value) => setInputValue(value)} // Update inputValue state on input change
      renderInput={(params) => (
        <TextField
          {...params} // Spread params from Autocomplete
          label="Search for a location" // Label for the input field
          variant="outlined" // Style variant of the TextField
          fullWidth // Make the input field take full width
          InputProps={{
            ...params.InputProps, // Include original InputProps
            endAdornment: (
              <>
                {loading ? (
                  // Show loading spinner if loading is true
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment} 
              </>
            ),
          }}
          style={{ maxHeight: '56px' }} // Limit the height of the input field to ensure consistency
        />
      )}
      // Custom paper component for displaying options
      PaperComponent={(props) => (
        <Paper style={{ maxHeight: 200, overflow: "auto" }} {...props} />
      )}
      getOptionLabel={(option) => option} // Function to display option labels
      disableClearable // Prevents the clear icon from showing
    />
  );
}

export default SearchLocation;
