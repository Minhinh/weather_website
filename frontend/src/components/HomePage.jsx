import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Card,
    CardContent,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';

function Homepage() {
    const [locations, setLocations] = useState([]); // State for locations
    const [selectedLocation, setSelectedLocation] = useState(''); // State for selected location
    const [predictions, setPredictions] = useState(null); // State for weather predictions
    const [loading, setLoading] = useState(false); // State for loading

    // Fetch available locations on component mount
    useEffect(() => {
        fetch("http://127.0.0.1:8000/locations")
            .then(response => response.json())
            .then(data => setLocations(data.locations)) // Update locations state
            .catch(error => console.error("Error fetching locations:", error));
    }, []);

    // Function to handle prediction fetching
    const handlePredict = () => {
        setLoading(true); // Set loading to true before fetching predictions
        // Fetch prediction for selected location
        fetch(`http://127.0.0.1:8000/predict?location=${selectedLocation}`)
            .then(response => response.json())
            .then(data => {
                setPredictions(data.predictions); // Update predictions state
                setLoading(false); // Set loading to false after fetching
            })
            .catch(error => {
                console.error("Error fetching prediction:", error);
                setLoading(false); // Set loading to false in case of error
            });
    };

    return (
        <Container
            maxWidth="md"
            style={{
                padding: "20px",
                backgroundColor: "transparent",
            }}
        >
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                style={{ color: "#00796b", fontWeight: "bold" }}
            >
                Weather Prediction
            </Typography>

            <Card variant="outlined">
                <CardContent>
                    <FormControl fullWidth variant="outlined" style={{ marginBottom: "20px" }}>
                        <InputLabel>Select Location</InputLabel>
                        <Select
                            value={selectedLocation}
                            onChange={e => setSelectedLocation(e.target.value)}
                            label="Select Location"
                        >
                            <MenuItem value="">
                                <em>Select Location</em>
                            </MenuItem>
                            {locations.map((location, index) => (
                                <MenuItem key={index} value={location}>{location}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePredict}
                        disabled={!selectedLocation || loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Get Prediction'}
                    </Button>

                    {predictions && (
                        <Box mt={4}>
                            <Typography variant="h5" align="center">
                                Predictions for {selectedLocation}
                            </Typography>
                            <Typography variant="body1">Min Temperature: {predictions.min_temp} °C</Typography>
                            <Typography variant="body1">Max Temperature: {predictions.max_temp} °C</Typography>
                            <Typography variant="body1">Humidity 9AM: {predictions.humidity_9am} %</Typography>
                            <Typography variant="body1">Humidity 3PM: {predictions.humidity_3pm} %</Typography>
                            <Typography variant="body1">Wind Speed 9AM: {predictions.wind_speed_9am} km/h</Typography>
                            <Typography variant="body1">Wind Speed 3PM: {predictions.wind_speed_3pm} km/h</Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

export default Homepage;
