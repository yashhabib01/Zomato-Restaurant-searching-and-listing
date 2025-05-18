import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Rating,
  Chip,
  Stack,
  Skeleton,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useNavigate } from 'react-router-dom';
import { getRestaurants } from '../services/api';

function RestaurantList({ searchText, cuisines, page, onPageChange, location }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRestaurants({
          page,
          limit: itemsPerPage,
          name: searchText,
          cuisines,
          latitude: location?.lat,
          longitude: location?.lng,
        });

        console.log(response);
        setRestaurants(response.data);

        if(response?.data?.length === 0){
          // toast.info("No more records found")
          onPageChange(page > 1 ? page-1: page)
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError(error.message || 'Failed to fetch restaurants');
        onPageChange(page > 1 ? page-1: page)
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchText, cuisines, page, location, itemsPerPage]);

  const handleCardClick = (id) => {
    navigate(`/${id}`);
  };

  const handleLimitChange = (event) => {
    setItemsPerPage(event.target.value);
    onPageChange(1); // Reset to first page when changing limit
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <Skeleton variant="rectangular" height={150} />
              <CardContent>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={24} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No restaurants found matching your criteria
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {restaurants.map((restaurant) => (
          <Grid 
            item 
            key={restaurant.restaurantId}
            sx={{
              width: '100%',
              display: 'flex'
            }}
          >
            <Card 
              sx={{ 
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                }
              }}
              onClick={() => handleCardClick(restaurant.restaurantId)}
            >
              <CardMedia
                component="img"
                height="160"
                image={restaurant.photoUrl || 'https://source.unsplash.com/random/800x600/?restaurant'}
                alt={restaurant.name}
                sx={{
                  objectFit: 'cover',
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  aspectRatio: '16/9',
                  width: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 2.5,
                height: '100%',
                minHeight: '180px',
                backgroundColor: '#ffffff',
                width: '100%'
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                    mb: 0.5,
                    color: '#1a1a1a',
                    letterSpacing: '0.01em'
                  }}
                >
                  {restaurant.name}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1,
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  p: 0.8,
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease'
                }}>
                  <Rating 
                    value={parseFloat(restaurant.aggregateRating)}
                    precision={0.1}
                    size="small"
                    readOnly
                    sx={{ color: '#FFB800' }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                    ({restaurant.aggregateRating}) - {restaurant.votes} votes
                  </Typography>
                </Box>
                
                <Stack 
                  direction="row" 
                  spacing={0.5} 
                  flexWrap="wrap" 
                  useFlexGap 
                  sx={{ mb: 1 }}
                >
                  {restaurant.cuisines.map((cuisine) => (
                    <Chip 
                      key={cuisine}
                      label={cuisine}
                      size="small"
                      sx={{ 
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        fontWeight: 500,
                        borderRadius: '6px',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                        }
                      }}
                    />
                  ))}
                </Stack>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: 'text.secondary',
                  mt: 'auto',
                  pt: 1.5,
                  borderTop: '1px solid rgba(0,0,0,0.08)'
                }}>
                  <LocationOnIcon sx={{ 
                    fontSize: 18, 
                    mr: 0.8, 
                    color: 'primary.main',
                    opacity: 0.9
                  }} />
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.875rem',
                    color: '#666666',
                    fontWeight: 500
                  }}>
                    {restaurant.address}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: 2,
          mt: 4, 
          mb: 4 
        }}>
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>

          <Typography variant="body1" sx={{ mx: 2 }}>
           {page}
          </Typography>

          <Button
            variant="outlined"
            endIcon={<NavigateNextIcon />}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>

          <FormControl sx={{ minWidth: 120, ml: 2 }}>
            <InputLabel id="items-per-page-label">Per Page</InputLabel>
            <Select
              labelId="items-per-page-label"
              value={itemsPerPage}
              label="Per Page"
              onChange={handleLimitChange}
              size="small"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>
    </Box>
  );
}

export { RestaurantList }; 