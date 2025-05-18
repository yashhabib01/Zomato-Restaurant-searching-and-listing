import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Paper,
  Typography,
  Chip,
  Stack,
  Button,
  Modal,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ImageSearch from "./ImageSearch"
import { debounce } from 'lodash';

// Common cuisine options - you might want to move this to a separate config file
const CUISINE_OPTIONS = [
  'Italian',
  'Japanese',
  'Chinese',
  'Indian',
  'Mexican',
  'Thai',
  'Mediterranean',
  'American',
  'French',
  'Korean',
  'Vietnamese',
  'Greek',
  'Spanish',
  'Middle Eastern',
  'Caribbean',
];

function FilterSection({ onFiltersChange, initialCuisines = [] , onCuisinesDetected }) {
  const [searchText, setSearchText] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState(initialCuisines);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update selected cuisines when initialCuisines changes
  useEffect(() => {
    setSelectedCuisines(initialCuisines);
  }, [initialCuisines]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((text) => {
      onFiltersChange({ name: text, cuisines: selectedCuisines });
    }, 300),
    [selectedCuisines]
  );

  // Handle search text changes
  useEffect(() => {
    debouncedSearch(searchText);
    return () => debouncedSearch.cancel();
  }, [searchText, debouncedSearch]);

  // Handle cuisine selection changes
  const handleCuisineChange = (event, newValue) => {
    setSelectedCuisines(newValue);
    onFiltersChange({ name: searchText, cuisines: newValue });
  };

  

 





  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Stack spacing={2}>
        {/* Name Search Field with Image Search Button */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search restaurants by name and description"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
                '&:hover': {
                  '& > fieldset': { borderColor: 'primary.main' },
                },
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              minWidth: '140px',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            Image Search
          </Button>
        </Box>

        {/* Cuisine Selection */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
            Filter by Cuisine:
          </Typography>
          <Autocomplete
            multiple
            options={CUISINE_OPTIONS}
            value={selectedCuisines}
            onChange={handleCuisineChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select cuisines..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                  },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                  sx={{
                    m: 0.5,
                    '& .MuiChip-deleteIcon': {
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark',
                      },
                    },
                  }}
                />
              ))
            }
            sx={{
              '& .MuiAutocomplete-inputRoot': {
                padding: '3px 9px',
              },
            }}
          />
        </Box>
      </Stack>

      {/* Image Search Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="image-search-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{
          position: 'relative',
          width: '90%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#666',
            },
          },
        }}>
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 3,
              color: 'primary.main',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Image Search
          </Typography>
          <ImageSearch onCuisinesDetected={onCuisinesDetected} setIsModalOpen={setIsModalOpen} />
        </Box>
      </Modal>
    </Paper>
  );
}

export default FilterSection; 