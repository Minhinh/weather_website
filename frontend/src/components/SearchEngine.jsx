import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SearchEngine = ({ query, setQuery, search }) => {
  return (
    <form onSubmit={search}>
      <TextField
        variant="outlined"
        placeholder="Search City"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            search(e); // Trigger the search function when the Enter key is pressed
          }
        }}
        style={{ margin: "10px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={search}
        style={{ marginTop: "10px" }}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchEngine;
