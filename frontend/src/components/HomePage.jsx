import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Card,
    CardContent,
    TextField,
    Alert,
    Popper,
    Paper,
    Grid,
    ClickAwayListener,
} from '@mui/material';
import { motion } from 'framer-motion';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterIcon from '@mui/icons-material/Water';
import './HomePage.css'; // Import your CSS for animations

function Homepage() {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accidentWarning, setAccidentWarning] = useState('');
    const [rainfallWarning, setRainfallWarning] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [backgroundStyles, setBackgroundStyles] = useState({});

    // Fetch locations
    useEffect(() => {
        fetch("http://127.0.0.1:8000/locations")
            .then(response => response.json())
            .then(data => {
                setLocations(data);
                setFilteredLocations(data); // Initialize with all locations
                // Randomly select a location for initial display
                const randomLocation = data[Math.floor(Math.random() * data.length)];
                setSelectedLocation(randomLocation);
                fetchPredictions(randomLocation); // Fetch predictions for the random location
            })
            .catch(error => console.error("Error fetching locations:", error));
    }, []);

    const fetchPredictions = (location) => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location }),
        })
            .then(response => response.json())
            .then(data => {
                setPredictions(data);
                const humidity = data[0]?.humidity_9am || 0;
                setBackgroundStyles(getBackgroundStyles(humidity)); // Update background styles
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching prediction:", error);
                setLoading(false);
            });
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchInput(query);
        const matches = locations.filter(location => location.toLowerCase().includes(query));
        setFilteredLocations(matches);
        setAnchorEl(event.currentTarget); // Show dropdown
    };

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        fetchPredictions(location); // Fetch predictions for the selected location
        setAnchorEl(null);
        setSearchInput(''); // Clear the search input
    };

    const handleDropdownClose = () => {
        setAnchorEl(null);
    };

    const getBackgroundStyles = (humidity) => {
        if (humidity > 70) {
            return {
                className: 'rainy-background',
            };
        } else if (humidity > 30) {
            return {
                className: 'cloudy-background',
            };
        }
        return {
            className: 'sunny-background',
        };
    };

    // Calculate average temperature
    const calculateAverageTemp = () => {
        if (predictions.length > 0) {
            const maxTemp = predictions[0].max_temp;
            const minTemp = predictions[0].min_temp;
            return ((maxTemp + minTemp) / 2).toFixed(1);
        }
        return 0;
    };

    // Get weather condition based on predictions
    const getWeatherCondition = () => {
        if (predictions.length > 0) {
            if (predictions[0].rainfall > 0) {
                return 'Rainy Day';
            }
            if (predictions[0].max_temp > 30) {
                return 'Sunny Day';
            }
            return 'Cloudy Day';
        }
        return '';
    };

    const weatherCondition = getWeatherCondition();
    const averageTemp = calculateAverageTemp();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={backgroundStyles.className}
            style={{ height: "100vh", color: "white", padding: "20px" }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {/* Left Section */}
                    <Grid item xs={4}>
                        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#BBDEFB" }}>
                            Weather Prediction
                        </Typography>

                        <TextField
                            fullWidth
                            label="Search Location"
                            variant="outlined"
                            onChange={handleSearchChange}
                            value={searchInput}
                            style={{ marginBottom: "20px", backgroundColor: "#1C2331", color: "white" }}
                            InputLabelProps={{ style: { color: '#BBDEFB' } }}
                        />

                        {/* Show filtered locations */}
                        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
                            <Paper>
                                <ClickAwayListener onClickAway={handleDropdownClose}>
                                    <Box>
                                        {filteredLocations.map((location, index) => (
                                            <Typography
                                                key={index}
                                                onClick={() => handleLocationClick(location)}
                                                style={{ padding: "10px", cursor: "pointer", backgroundColor: '#f0f0f0', color: '#000' }}
                                            >
                                                {location}
                                            </Typography>
                                        ))}
                                    </Box>
                                </ClickAwayListener>
                            </Paper>
                        </Popper>

                        {loading && <CircularProgress color="inherit" />}

                        {/* Average Temperature Box */}
                        {predictions.length > 0 && (
                            <Card style={{ marginTop: "20px", padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                                <CardContent>
                                    <Typography variant="h5" align="center">Average Temperature: {averageTemp}°C</Typography>
                                    <Typography variant="h6" align="center">{weatherCondition}</Typography>
                                    <Typography variant="body1" align="center">
                                        {weatherCondition === 'Rainy Day' ? 'Today the expectation is rainy, with a high temp of ' + predictions[0].max_temp + '°C. Grab your umbrella when going outside.' :
                                         weatherCondition === 'Sunny Day' ? 'Expect a sunny day with high temp of ' + predictions[0].max_temp + '°C. Enjoy the sunshine!' :
                                         'It might be cloudy today with a high temp of ' + predictions[0].max_temp + '°C. Stay safe!'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {/* Humidity and Max Temp Boxes */}
                        {predictions.length > 0 && (
                            <Grid container spacing={2} style={{ marginTop: "20px" }}>
                                <Grid item xs={6}>
                                    <Card style={{ padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                                        <CardContent>
                                            <Typography variant="h6" align="center">Humidity</Typography>
                                            <Typography variant="body1" align="center">{predictions[0].humidity_9am}%</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card style={{ padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                                        <CardContent>
                                            <Typography variant="h6" align="center">Max Temperature</Typography>
                                            <Typography variant="body1" align="center">{predictions[0].max_temp}°C</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {/* Warning Messages */}
                        <Box mt={2}>
                            {rainfallWarning && <Alert severity="warning">{rainfallWarning}</Alert>}
                            {accidentWarning && <Alert severity="warning">{accidentWarning}</Alert>}
                        </Box>
                    </Grid>

                    {/* Right Section (to be updated later) */}
                    <Grid item xs={8}>
                        {/* Placeholder for the right section */}
                        <Typography variant="h5">Right Section (to be completed)</Typography>
                    </Grid>
                </Grid>
            </Container>
        </motion.div>
    );
}

export default Homepage;
