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
    ClickAwayListener,
    Button,
    IconButton,
    Switch,
    Grid,
    LinearProgress,
} from '@mui/material';
import { WbSunny, Cloud, Grain, Warning, LocationOn, Brightness4, Brightness7 } from '@mui/icons-material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

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
    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: { main: '#00796b' },
        },
    });

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const adjustedData = data.map(d => ({
                    ...d,
                    total_accidents: d.rainfall > 70 ? d.total_accidents + 2 : d.total_accidents + (d.rainfall > 65 ? 1 : 0),
                }));

                setPredictions(adjustedData);
                setRainfallWarning(adjustedData[0].rainfall > 50 ? 'High rainfall expected, take precautions!' : '');
                setAccidentWarning(adjustedData.some(d => d.total_accidents > 2) ? 'High accident risk due to weather conditions!' : '');
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching prediction:", error);
                setLoading(false);
            });
    };

    const handleDetectLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Assume a backend endpoint handles lat/lon
                const { latitude, longitude } = position.coords;
                setLoading(true);
                fetch(`http://127.0.0.1:8000/predict/location?lat=${latitude}&lon=${longitude}`)
                    .then(response => response.json())
                    .then(data => setPredictions(data))
                    .finally(() => setLoading(false));
            },
            (error) => console.error("Geolocation error:", error)
        );
    };

    const handleDropdownClose = () => setAnchorEl(null);
    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" style={{ padding: "20px" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" gutterBottom style={{ fontWeight: "bold" }}>
                        Weather Prediction
                    </Typography>
                    <IconButton onClick={toggleDarkMode}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Box>

                <TextField
                    fullWidth
                    label="Search Location"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ marginBottom: "20px" }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                />

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

                <Box display="flex" justifyContent="space-around" flexWrap="wrap" mt={2}>
                    {randomLocations.map((location, index) => (
                        <Card
                            key={index}
                            onClick={() => handleLocationClick(location)}
                            variant="outlined"
                            style={{
                                width: "30%",
                                margin: "10px",
                                cursor: "pointer",
                                backgroundColor: selectedLocation === location ? "#e0f7fa" : "white",
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" align="center">{location}</Typography>
                                <Typography variant="body2" align="center">Min Temp: {Math.floor(Math.random() * 10 + 15)}°C</Typography>
                                <Typography variant="body2" align="center">Max Temp: {Math.floor(Math.random() * 15 + 25)}°C</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Button variant="contained" color="primary" onClick={handleDetectLocation} startIcon={<LocationOn />} style={{ margin: "20px auto", display: "block" }}>
                    Detect My Location
                </Button>

                {loading && <CircularProgress style={{ marginTop: 20 }} />}

                {predictions.length > 0 && selectedLocation && (
                    <Box mt={4}>
                        <Typography variant="h5" align="center">Predictions for {selectedLocation}</Typography>
                        {predictions.map((prediction, index) => {
                            const date = new Date();
                            date.setDate(date.getDate() + index);
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

                            return (
                                <Box key={index} mt={2}>
                                    <Typography variant="h6">{dayName}</Typography>
                                    <Typography variant="body1" style={{ color: prediction.max_temp > 30 ? "red" : "blue" 