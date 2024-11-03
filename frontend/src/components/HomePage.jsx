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
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Popper,
    Paper,
    Grid2,
    ClickAwayListener,
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

function Homepage() {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accidentWarning, setAccidentWarning] = useState('');
    const [rainfallWarning, setRainfallWarning] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [randomLocations, setRandomLocations] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/locations")
            .then(response => response.json())
            .then(data => {
                setLocations(data);
                setRandomLocations(getRandomLocations(data, 3));
            })
            .catch(error => console.error("Error fetching locations:", error));
    }, []);

    const getRandomLocations = (locationsList, count) => {
        const shuffled = locationsList.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const matches = locations.filter(location => location.toLowerCase().includes(query));
        setFilteredLocations(matches);
        setAnchorEl(event.currentTarget);
    };

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        setLoading(true);
        setAnchorEl(null);

        fetch(`http://127.0.0.1:8000/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location }),
        })
            .then(response => response.json())
            .then(data => {
                let adjustedAccidents = data.map(d => {
                    let accidents = d.total_accidents;
                    if (d.rainfall > 70) accidents += 2;
                    else if (d.rainfall > 65) accidents += 1;
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

    const handleDropdownClose = () => {
        setAnchorEl(null);
    };

    const getGradientBackground = (rainfall) => {
        if (rainfall > 50) return 'linear-gradient(to right, #4b79a1, #283e51)';
        if (rainfall > 70) return 'linear-gradient(to right, #gray, #a8c0ff)';
        return 'linear-gradient(to right, #56ccf2, #2f80ed)';
    };

    return (
        <Container maxWidth="lg" style={{ padding: "20px", backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}>
            <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: "bold", color: "#BBDEFB" }}>
                Weather Prediction
            </Typography>

            {/* Location Search Input */}
            <TextField
                fullWidth
                label="Search Location"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginBottom: "20px", backgroundColor: "#1C2331", color: "white" }}
                InputLabelProps={{ style: { color: '#BBDEFB' } }}
            />

            {/* Location Dropdown */}
            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
                <ClickAwayListener onClickAway={handleDropdownClose}>
                    <Paper elevation={3}>
                        <List>
                            {filteredLocations.map((location, index) => (
                                <ListItem button key={index} onClick={() => handleLocationClick(location)}>
                                    <ListItemText primary={location} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </ClickAwayListener>
            </Popper>

            {/* Loading Spinner */}
            {loading && <CircularProgress color="inherit" />}

            {/* Main Weather Display */}
            <Box mt={4}>
                <Grid2 container spacing={3}>
                    <Grid2 item xs={12} md={8}>
                        {selectedLocation && predictions.length > 0 && (
                            <Card style={{
                                background: getGradientBackground(predictions[0].rainfall),
                                padding: "20px",
                                color: "#ECEFF1"
                            }}>
                                <Typography variant="h3" align="center">{predictions[0].max_temp}°C</Typography>
                                <Typography variant="h6" align="center">{selectedLocation} - {predictions[0].condition}</Typography>
                                <Typography variant="body2" align="center">
                                    "Expect {predictions[0].description}. Take necessary precautions."
                                </Typography>
                            </Card>
                        )}
                    </Grid2>

                    <Grid2 item xs={12} md={4}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {rainfallWarning && <Alert severity="warning">{rainfallWarning}</Alert>}
                            {accidentWarning && <Alert severity="warning">{accidentWarning}</Alert>}
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>

            {/* Forecast Display */}
            {predictions.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h5" align="center">5-Day Forecast</Typography>
                    <Grid2 container spacing={3} mt={2}>
                        {predictions.slice(0, 5).map((prediction, index) => (
                            <Grid2 item xs={12} sm={6} md={4} key={index}>
                                <Card style={{
                                    background: getGradientBackground(prediction.rainfall),
                                    color: "#ECEFF1",
                                    padding: "10px",
                                    borderRadius: "10px",
                                }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>{prediction.dayName}</Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <WbSunnyIcon /> <Typography>Min: {prediction.min_temp}°C</Typography>
                                            <WbSunnyIcon /> <Typography>Max: {prediction.max_temp}°C</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <OpacityIcon /> <Typography>Humidity: {prediction.humidity_9am}%</Typography>
                                            <AirIcon /> <Typography>Wind: {prediction.wind_speed_3pm} km/h</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CloudIcon /> <Typography>Rainfall: {prediction.rainfall} mm</Typography>
                                            <ThunderstormIcon /> <Typography>Accidents: {prediction.total_accidents}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>
            )}
        </Container>
    );
}

export default Homepage;