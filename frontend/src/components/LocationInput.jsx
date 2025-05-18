import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';

function LocationInput({ onLocationSelect }) {
  const [tabValue, setTabValue] = useState(0);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLocationSet, setIsLocationSet] = useState(false);

  // Load saved location from localStorage
  useEffect(() => {
    const savedLocation = sessionStorage.getItem('userLocation');
    if (savedLocation) {
      const { lat, lng } = JSON.parse(savedLocation);
      setLatitude(lat);
      setLongitude(lng);
      onLocationSelect({ lat, lng });
      setIsLocationSet(true);
    }
  }, [onLocationSelect]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    saveLocation(lat, lng);
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        saveLocation(lat, lng);
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const saveLocation = (lat, lng) => {
    const location = { lat, lng };
    sessionStorage.setItem('userLocation', JSON.stringify(location));
    onLocationSelect(location);
    setIsLocationSet(true);
  };

  if (isLocationSet) {
    return null;
  }

  return (
    <Fade in={!isLocationSet}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 3,
          maxWidth: '600px',
          mx: 'auto',
          borderRadius: 2,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            color: 'primary.main',
            fontWeight: 600,
            mb: 3
          }}
        >
          Set Your Location
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ 
            mb: 3,
            '& .MuiTab-root': {
              minWidth: 0,
              flex: 1,
              fontSize: '1rem',
              textTransform: 'none',
              fontWeight: 500
            }
          }}
          centered
        >
          <Tab 
            icon={<MyLocationIcon />} 
            label="Current Location" 
            iconPosition="start"
          />
          <Tab 
            icon={<LocationOnIcon />} 
            label="Manual Input" 
            iconPosition="start"
          />
        </Tabs>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 1
            }}
          >
            {error}
          </Alert>
        )}

        {tabValue === 0 ? (
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={getCurrentLocation}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <MyLocationIcon />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                }
              }}
            >
              {loading ? 'Getting Location...' : 'Use Current Location'}
            </Button>
          </Box>
        ) : (
          <Box 
            component="form" 
            onSubmit={handleManualSubmit}
            sx={{
              '& .MuiTextField-root': {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main'
                  }
                }
              }
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                fullWidth
                type="number"
                inputProps={{ step: "any" }}
                required
                placeholder="e.g., 40.7128"
              />
              <TextField
                label="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                fullWidth
                type="number"
                inputProps={{ step: "any" }}
                required
                placeholder="e.g., -74.0060"
              />
            </Box>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                }
              }}
            >
              Set Location
            </Button>
          </Box>
        )}
      </Paper>
    </Fade>
  );
}

export default LocationInput; 