// WeatherInfoCard.jsx
import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

function WeatherInfoCard({ title, value, icon }) {
  return (
    <Card
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        height: "100px",
        textAlign: "center",
        padding: "30px",
        margin: "5px",
      }}
    >
       <CardContent >
        {/* Set a fixed size for the icon */}
        <div style={{ fontSize: "10px"}}>
          {icon}
        </div>
        <Grid container spacing={1} alignItems="center" justifyContent="center">
          <Grid item>
            <Typography 
              variant="h6" 
              align="center" 
              style={{ color: "white", fontSize: "14px" }} // Title font size
            >
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography 
              variant="h4" 
              align="center" 
              style={{ color: "white", fontSize: "32px" }} // Value font size
            >
              {value}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default WeatherInfoCard;
