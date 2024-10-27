import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const Forecast = ({ weather, toDate }) => {
  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card style={{ width: "300px", textAlign: "center", backgroundColor: "#b2dfdb" }}>
        <CardContent>
          <Typography variant="h5" component="div" style={{ color: "#004d40" }}>
            {weather.data.city}
          </Typography>
          <Typography variant="subtitle1">{toDate()}</Typography>
          <Typography variant="h6" style={{ fontWeight: "bold", color: "#00796b" }}>
            {weather.data.temperature.current}°C
          </Typography>
          <Typography variant="body2" style={{ color: "#004d40" }}>
            {weather.data.condition.description}
          </Typography>
          <Typography variant="body2" style={{ marginTop: "10px" }}>
            Wind Speed: {weather.data.wind.speed} km/h
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Forecast;
