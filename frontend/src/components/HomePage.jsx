import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Card,
    CardContent,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Alert,
} from '@mui/material';

function Homepage() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accidentWarning, setAccidentWarning] = useState('');
    const [rainfallWarning, setRainfallWarning] = useState('');

    useEffect(() => {
        fetch("http://127.0.0.1:8000/locations")
            .then(response => response.json())
            .then(data => setLocations(data))
            .catch(error => console.error("Error fetching locations:", error));
    }, []);

    const handleLocationChange = (location) => {
        setSelectedLocation(location);
        setLoading(true);
        fetch(`http://127.0.0.1:8000/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: location }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let adjustedAccidents = data.map((d) => {
                    let accidents = d.total_accidents;
                    if (d.rainfall > 70) {
                        accidents += 2; // Adjust based on rainfall
                    } else if (d.rainfall > 65) {
                        accidents += 1; // Adjust based on rainfall
                    }
                    return { ...d, total_accidents: accidents };
                });

                setPredictions(adjustedAccidents);
                setRainfallWarning(adjustedAccidents[0].rainfall > 50 ? 'High rainfall expected, take precautions!' : '');
                setAccidentWarning(adjustedAccidents.some(d => d.total_accidents > 2) ? 'High accident risk due to weather conditions!' : '');
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching prediction:", error);
                setLoading(false);
            });
    };

    return (
        <Container maxWidth="md" style={{ padding: "20px", backgroundColor: "transparent" }}>
            <Typography variant="h4" align="center" gutterBottom style={{ color: "#00796b", fontWeight: "bold" }}>
                Weather Prediction
            </Typography>

            <Card variant="outlined">
                <CardContent>
                    <FormControl fullWidth variant="outlined" style={{ marginBottom: "20px" }}>
                        <InputLabel>Select Location</InputLabel>
                        <Select
                            value={selectedLocation}
                            onChange={e => handleLocationChange(e.target.value)}
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

                    {loading && <CircularProgress />}

                    {predictions.length > 0 && (
                        <Box mt={4}>
                            <Typography variant="h5" align="center">Predictions for {selectedLocation}</Typography>
                            {predictions.map((prediction, index) => {
                                const date = new Date();
                                date.setDate(date.getDate() + index);
                                const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
                                const formattedDate = date.toLocaleDateString('en-US', options);

                                return (
                                    <Box key={index} mt={2}>
                                        <Typography variant="h6">{formattedDate}</Typography>
                                        <Typography variant="body1">Min Temperature: {prediction.min_temp} °C</Typography>
                                        <Typography variant="body1">Max Temperature: {prediction.max_temp} °C</Typography>
                                        <Typography variant="body1">Humidity 9AM: {prediction.humidity_9am} %</Typography>
                                        <Typography variant="body1">Humidity 3PM: {prediction.humidity_3pm} %</Typography>
                                        <Typography variant="body1">Wind Speed 9AM: {prediction.wind_speed_9am} km/h</Typography>
                                        <Typography variant="body1">Wind Speed 3PM: {prediction.wind_speed_3pm} km/h</Typography>
                                        <Typography variant="body1">Predicted Rainfall: {prediction.rainfall} mm</Typography>
                                        <Typography variant="body1">Total Accidents Predicted: {prediction.total_accidents}</Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}

                    {accidentWarning && (
                        <Alert severity="warning" style={{ marginTop: '20px' }}>{accidentWarning}</Alert>
                    )}

                    {rainfallWarning && (
                        <Alert severity="warning" style={{ marginTop: '20px' }}>{rainfallWarning}</Alert>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

export default Homepage;
