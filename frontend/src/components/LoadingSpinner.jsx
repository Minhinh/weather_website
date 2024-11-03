// LoadingSpinner.jsx
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
      <CircularProgress color="secondary" />
    </div>
  );
}

export default LoadingSpinner;
