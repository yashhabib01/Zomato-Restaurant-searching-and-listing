import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Rating,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  CardMedia,
  TextField,
  Button,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { addReview, getRestaurantById } from "../services/api";

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState();
  const [comment, setComment] = useState("");
  console.log(restaurant);

  const fetchRestaurantDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRestaurantById(id);
      if (response.success) {
        setRestaurant(response.data);
      } else {
        setError(response.message || "Restaurant not found");
      }
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching restaurant details:", err);
      setError(err.message || "Failed to load restaurant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]); // Re-fetch if ID changes

  const handleAddReview = async () => {
    try {
      await addReview(id, rating, comment, Date.now());
    } catch (error) {
    } finally {
      fetchRestaurantDetails();
      setRating();
      setComment("");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading restaurant details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!restaurant) {
    return null; // Or some other handling for when restaurant is null after loading
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: 700,
            color: "primary.main",
            mb: 4,
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {restaurant.name}
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Stack spacing={4}>
            <CardMedia
              component="img"
              image={
                restaurant.photoUrl ||
                "https://source.unsplash.com/random/800x600/?restaurant"
              }
              alt={restaurant.name}
              sx={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.02)",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationOnIcon color="primary" /> Restaurant Details
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Description:{" "}
                    <span style={{ color: "#666" }}>
                      {restaurant.description
                        ? restaurant.description
                        : "No Description"}
                    </span>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Address:{" "}
                    <span style={{ color: "#666" }}>{restaurant.address}</span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Locality:{" "}
                    <span style={{ color: "#666" }}>{restaurant.locality}</span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    City:{" "}
                    <span style={{ color: "#666" }}>{restaurant.city}</span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <CurrencyExchangeIcon
                    sx={{ mr: 1.5, color: "primary.main" }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Average Cost for Two:{" "}
                    <span style={{ color: "#666" }}>
                      {restaurant.averageCostForTwo} {restaurant.currency}
                    </span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ReceiptIcon sx={{ mr: 1.5, color: "primary.main" }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Price Range:{" "}
                    <span style={{ color: "#666" }}>
                      {"$".repeat(restaurant.priceRange)}
                    </span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <EventAvailableIcon sx={{ mr: 1.5, color: "primary.main" }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Table Booking:{" "}
                    <span style={{ color: "#666" }}>
                      {restaurant.hasTableBooking
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <DeliveryDiningIcon sx={{ mr: 1.5, color: "primary.main" }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Online Delivery:{" "}
                    <span style={{ color: "#666" }}>
                      {restaurant.hasOnlineDelivery
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.02)",
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Rating sx={{ color: "#FFB800" }} /> Rating & Reviews
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 184, 0, 0.1)",
                      minWidth: "100px",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#FFB800" }}
                    >
                      {restaurant.aggregateRating}
                    </Typography>
                    <Rating
                      value={parseFloat(restaurant.aggregateRating)}
                      precision={0.1}
                      size="small"
                      readOnly
                      sx={{ color: "#FFB800" }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      {restaurant.ratingText}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on {restaurant.votes} reviews
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <RestaurantIcon color="primary" /> Cuisines
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {restaurant.cuisines.map((cuisine) => (
                    <Chip
                      key={cuisine}
                      label={cuisine}
                      color="primary"
                      variant="outlined"
                      sx={{
                        borderRadius: "8px",
                        fontWeight: 500,
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "white",
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.02)",
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Rating sx={{ color: "#FFB800" }} readOnly /> Add Reviews
                </Typography>
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <Rating
                    sx={{ color: "#FFB800" }}
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  <TextField
                    type="string"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comment"
                  />
                  <Button onClick={handleAddReview}>Add Review</Button>
                </Box>
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  Users Reviews
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Raing</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {restaurant.reviews?.map((review) => {
                      return (
                        <TableRow>
                          <TableCell>
                            <Rating value={review.rating} readOnly />
                          </TableCell>
                          <TableCell>{review.comment}</TableCell>
                          <TableCell>{review.date}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default RestaurantDetail;
