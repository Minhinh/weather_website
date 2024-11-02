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
    Alert,
} from '@mui/material';

function Homepage() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [accidentWarning, setAccidentWarning] = useState('');
    const [rainfallWarning, setRainfallWarning] = useState('');

    useEffect(() => {
        fetch("http://127.0.0.1:8000/locations")
            .then(response => response.json())
            .then(data => setLocations(data))
            .catch(error => console.error("Error fetching locations:", error));
    }, []);

    const handlePredict = () => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: selectedLocation }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let adjustedAccidents = data.total_accidents;
                if (data.rainfall > 70) {
                    adjustedAccidents += 2;  // Add 2 if rainfall > 70
                } else if (data.rainfall > 65) {
                    adjustedAccidents += 1;  // Add 1 if rainfall > 50
                }

                setPredictions({ ...data, total_accidents: adjustedAccidents });
                setRainfallWarning(data.rainfall > 50 ? 'High rainfall expected, take precautions!' : '');
                setAccidentWarning(adjustedAccidents > 2 ? 'High accident risk due to weather conditions!' : '');
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching prediction:", error);
                setLoading(false);
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
                            <Typography variant="body1">Predicted Rainfall: {predictions.rainfall} mm</Typography>
                            <Typography variant="body1">Total Accidents Predicted: {predictions.total_accidents}</Typography>
                        </Box>
                    )}

                    {accidentWarning && (
                        <Alert severity="warning" style={{ marginTop: '20px' }}>
                            {accidentWarning}
                        </Alert>
                    )}

                    {rainfallWarning && (
                        <Alert severity="warning" style={{ marginTop: '20px' }}>
                            {rainfallWarning}
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

export default Homepage;
