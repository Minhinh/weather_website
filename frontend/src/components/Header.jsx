// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from "@mui/material";

function Header() {
  return (
    <AppBar position="static" style={{ backgroundColor: "#7dcbe4" }}>
      <Toolbar style={{ justifyContent: "center" }}>
        <Typography 
          variant="h6" 
          style={{ 
            marginRight: "auto", 
            padding: "0 200px", // Padding for space around title
            color: "white" 
          }}>
          Weather Prediction App
        </Typography>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          margin: "0 200px" 
        }}>
          <Button color="inherit" component={Link} to="/" style={{ margin: "0 10px" }}>
            <i className="fas fa-home"></i> Home
          </Button>
          <Button color="inherit" component={Link} to="/statistics" style={{ margin: "0 10px" }}>
            <i className="fas fa-chart-bar"></i> Statistics
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
