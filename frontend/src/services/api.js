import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const serverUrl = import.meta.env.VITE_SERVER_URL;

export const getRestaurants = async ({
  page = 1,
  limit = 5,
  name,
  cuisines,
  latitude,
  longitude,
  radius = 3000,
}) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);

    if (name) params.append("name", name);
    if (cuisines?.length) params.append("cuisines", cuisines.join(","));
    if (latitude) params.append("latitude", latitude);
    if (longitude) params.append("longitude", longitude);
    if (radius) params.append("radius", radius);

    const response = await api.get(
      `${serverUrl}/restaurants?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRestaurantById = async (id) => {
  try {
    const response = await api.get(`${serverUrl}/restaurants/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addReview = async (restaurantId, rating, comment, date) => {
  try {
    const response = await api.put(`${serverUrl}/restaurants/addReview`, {
      restaurantId: restaurantId,
      rating: rating,
      comment: comment,
      date: date,
    });
  } catch (error) {}
};
