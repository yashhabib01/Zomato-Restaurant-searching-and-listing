import { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import CheckIcon from '@mui/icons-material/Check';

// Import the GoogleGenerativeAI  class from the library
import { GoogleGenerativeAI  } from '@google/generative-ai';

// Access the API key from environment variables (using Vite convention)
const API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY;

// Initialize the Generative AI model conditionally
let model = undefined; // Initialize as undefined

if (!API_KEY) {
  console.error('Gemini API key not found. Please set VITE_APP_GEMINI_API_KEY in your .env file.');
  // TODO: Display a user-friendly error on the UI indicating the missing API key
} else {
  // Choose a model that supports multimodal input (text and images)
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (e) {
    console.error('Failed to initialize Gemini model:', e);
    // TODO: Display a user-friendly error on the UI indicating model initialization failure
  }
}

function ImageSearch({ onCuisinesDetected , setIsModalOpen}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectedCuisines, setDetectedCuisines] = useState([]);
  const [appliedCuisines, setAppliedCuisines] = useState([]);
  const fileInputRef = useRef(null);

  // Add a state to hold potential API errors for UI display
  const [apiError, setApiError] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setApiError(null); // Clear previous errors on new image select
    }
  };

  const fileToGenerativePart = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove data url prefix and return the base64 data
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            mimeType: file.type,
            data: base64Data
          }
        });
      };
      reader.onerror = reject; // Handle file reading errors
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    // Check if the model was successfully initialized before proceeding
    if (!selectedImage) {
        setApiError('Please select an image first.');
        return;
    }
    if (!model) {
        setApiError('AI model not available. Please check API key configuration.');
        setLoading(false); // Ensure loading is false if upload is blocked
        return; 
    }

    setLoading(true);
    setDetectedCuisines([]); // Clear previous detections
    setAppliedCuisines([]); // Clear applied cuisines on new upload
    setApiError(null); // Clear previous API errors

    try {
      // Convert the selected image to a format the API accepts
      const imagePart = await fileToGenerativePart(selectedImage);

      // Define the prompt with the instruction to limit cuisines
      const prompt = "Analyze this food image and list at most 3 distinct cuisines that are represented. Respond only with a comma-separated list of cuisine names. Do not include any other text.";

      // Call the Gemini API
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              imagePart,
            ],
          },
        ],
      });
      const response = result.response;
      const text = response.text();

      // Parse the response text (assuming comma-separated cuisine names)
      const detected = text.split(',').map(cuisine => cuisine.trim()).filter(cuisine => cuisine.length > 0);

      setDetectedCuisines(detected);
     
    } catch (error) {
      console.error('Error detecting cuisines with Gemini API:', error);
      // Display a user-friendly error message on the UI
      setApiError('Failed to detect cuisines. Please try again.');
    } finally {
      
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    resetToDefault();
    setApiError(null); // Clear errors on reset
  };

  const handleChipDelete = (cuisineToDelete) => {
    const newCuisines = detectedCuisines.filter(c => c !== cuisineToDelete);
    setDetectedCuisines(newCuisines);
    if (appliedCuisines.includes(cuisineToDelete)) {
      const newAppliedCuisines = appliedCuisines.filter(c => c !== cuisineToDelete);
      setAppliedCuisines(newAppliedCuisines);
      onCuisinesDetected(newAppliedCuisines);
    }
  };

  const handleApplyCuisines = () => {
    setAppliedCuisines(detectedCuisines);
    onCuisinesDetected(detectedCuisines);
    resetToDefault(); // Reset after applying
    setIsModalOpen(false)
  };

  const resetToDefault = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setDetectedCuisines([]);
    setAppliedCuisines([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            
            {!previewUrl ? (
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<CloudUploadIcon />}
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  width: '100%',
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Upload Food Image
              </Button>
            ) : (
              <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <img
                  src={previewUrl}
                  alt="Selected food"
                  style={{
                    width: '100%',
                    height: '120px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
           {/* Show upload button, loading spinner, or nothing based on state */}
           {!previewUrl && !loading && (
             <Box sx={{ textAlign: 'center' }}>
               <Typography variant="body2" color="text.secondary">
                 Upload an image to detect cuisines.
               </Typography>
             </Box>
           )}
           {previewUrl && !detectedCuisines.length && !loading && (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading || !model} // Disable if loading or model is not available
                startIcon={<ImageIcon />}
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                  }
                }}
              >
                Detect Cuisines
              </Button>
            </Box>
          )}
          {loading && (
             <Box sx={{ textAlign: 'center' }}>
               <CircularProgress size={24} />
               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                 Detecting cuisines...
               </Typography>
             </Box>
          )}
           {/* Display API errors */} 
           {apiError && (
             <Box sx={{ textAlign: 'center' }}>
               <Alert severity="error" sx={{ mt: 2 }}>{apiError}</Alert>
             </Box>
           )}
        </Grid>

        <Grid item xs={12} md={4}>
          {detectedCuisines.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
                Detected Cuisines:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {detectedCuisines.map((cuisine) => (
                  <Chip
                    key={cuisine}
                    label={cuisine}
                    size="small"
                    onDelete={() => handleChipDelete(cuisine)}
                    sx={{
                      m: 0.5,
                      '& .MuiChip-deleteIcon': {
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark'
                        }
                      }
                    }}
                  />
                ))}
              </Stack>
              {detectedCuisines.length > 0 && appliedCuisines.length === 0 && (
                <Button
                  variant="contained"
                  onClick={handleApplyCuisines}
                  startIcon={<CheckIcon />}
                  sx={{
                    mt: 2,
                    py: 0.5,
                    px: 2,
                    borderRadius: 2,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Apply Cuisines
                </Button>
              )}
               {appliedCuisines.length > 0 && (
                 <Typography variant="body2" sx={{ mt: 2, color: 'success.main' }}>
                   Cuisines applied to filter! Upload new image to detect again.
                 </Typography>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ImageSearch; 