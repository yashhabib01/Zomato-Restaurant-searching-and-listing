import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import LocationInput from '../components/LocationInput';
import FilterSection from '../components/FilterSection';
import { RestaurantList } from '../components/RestaurantList';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cuisines, setCuisines] = useState(searchParams.get('cuisines')?.split(',') || []);
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [location, setLocation] = useState(null);

  // Log the location state
  useEffect(() => {
    console.log('Home component location state:', location);
  }, [location]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (cuisines.length > 0) params.set('cuisines', cuisines.join(','));
    if (searchText) params.set('search', searchText);
    if (page > 1) params.set('page', page.toString());
    if (location) {
      params.set('lat', location.lat);
      params.set('lng', location.lng);
    }
    setSearchParams(params);
  }, [cuisines, searchText, page, location, setSearchParams]);

  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
  };

  const handleFiltersChange = ({ name, cuisines: newCuisines }) => {
    setSearchText(name);
    setCuisines(newCuisines);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            fontWeight: 700,
            color: 'primary.main',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Restaurant Search
        </Typography>
        
        {!location && <LocationInput onLocationSelect={handleLocationSelect} />}
        
        {location && (
          <>
            <FilterSection 
              onFiltersChange={handleFiltersChange}
              initialCuisines={cuisines}
              onCuisinesDetected={setCuisines}
            />
            <RestaurantList
              searchText={searchText}
              cuisines={cuisines}
              page={page}
              onPageChange={handlePageChange}
              location={location}
            />
          </>
        )}
      </Box>
    </Container>
  );
}

export default Home; 