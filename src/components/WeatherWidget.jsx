import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Cloud,
  WbSunny,
  Opacity,
  Air,
  Refresh,
  LocationOn,
} from '@mui/icons-material';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock weather data - in production, replace with real API
  const fetchWeather = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWeather({
        temperature: 28,
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 12,
        location: 'Farm Location',
        icon: 'sunny',
      });
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <WbSunny />;
      case 'cloudy': return <Cloud />;
      default: return <Cloud />;
    }
  };

  if (loading) {
    return <CircularProgress size={24} color="inherit" />;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={`${weather.condition}, ${weather.temperature}°C`}>
        <Chip
          icon={getWeatherIcon(weather.condition)}
          label={`${weather.temperature}°C`}
          size="small"
          color="inherit"
          variant="outlined"
        />
      </Tooltip>
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
        <Opacity fontSize="small" />
        <Typography variant="caption">{weather.humidity}%</Typography>
        <Air fontSize="small" sx={{ ml: 1 }} />
        <Typography variant="caption">{weather.windSpeed}km/h</Typography>
      </Box>
      <IconButton size="small" onClick={fetchWeather} color="inherit">
        <Refresh fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default WeatherWidget;