// SearchLocation.jsx
import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Paper,
} from "@mui/material";

function SearchLocation({ locations, setSelectedLocation, fetchPredictions }) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLocationChange = (event, value) => {
    if (value) {
      setSelectedLocation(value);
      fetchPredictions(value);
    }
  };

  return (
    <Autocomplete
      options={locations}
      getOptionLabel={(option) => option}
      onChange={handleLocationChange}
      onInputChange={(event, value) => setInputValue(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a location"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      PaperComponent={(props) => (
        <Paper style={{ maxHeight: 200, overflow: "auto" }} {...props} />
      )}
    />
  );
}

export default SearchLocation;
