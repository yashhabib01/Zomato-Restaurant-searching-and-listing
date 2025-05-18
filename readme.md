# Restaurant Search Application

This application combines location-based search with filtering capabilities. Whether you're looking for a specific cuisine, exploring restaurants in a new area, or searching by restaurant name, our platform makes it easy to find exactly what you're craving.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation Guide](#installation-guide)
- [API Endpoints](#api-endpoints)
- [Core Logic](#core-logic)
- [Improvements](#improvements)

## Overview

The Restaurant Search Application implements advanced geospatial and text search capabilities using MongoDB's powerful features:

- **Geospatial Search**: Utilizes MongoDB's 2dsphere indexing for efficient location-based queries, enabling precise restaurant searches within specified radius and coordinates
- **Atlas Search Integration**: Implements MongoDB Atlas Search for full-text search capabilities across restaurant names, cuisines, and descriptions
- **Real-time Filtering**: Dynamic filtering system combining geospatial queries with text search for instant results
- **RESTful API Architecture**: Node.js backend with Express.js providing scalable and maintainable API endpoints
- **React Frontend**: Modern UI implementation using React with Material-UI components for responsive design
- **Performance Optimization**: Indexed queries and efficient data structures for sub-second response times

## Tech Stack

### Frontend

- React.js
- Material-UI
- Axios for API calls
- React Router for navigation

### Backend

- Node.js
- Express.js
- MongoDB + Atlas Search
  - 2dsphere indexing for geospatial queries
  - Atlas Search for full-text search
  - Aggregation pipeline for complex queries
- Google Gemini AI for image-based cuisine recognition
- RESTful API architecture

## Installation Guide

### Backend Setup

1. **Prerequisites**

   - Node.js (v14 or higher)
   - MongoDB Atlas account
   - Git

2. **Clone and Setup**

   ```bash
   # Clone the repository
   git clone <repository-url>
   cd server

   # Install dependencies
   npm install
   ```

3. **Environment Configuration**

   - Create a `.env` file in the server directory
   - Add the following environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     PORT=5000
     ```

4. **Database Setup**

   - Create a MongoDB Atlas cluster
   - Enable Atlas Search in your cluster
   - Configure Atlas Search index with the following mapping:
     ```json
     {
       "mappings": {
         "dynamic": false,
         "fields": {
           "name": {
             "type": "string"
           },
           "description": {
             "type": "string"
           },
           "cuisine": {
             "type": "string"
           }
         }
       }
     }
     ```
   - Import the restaurant data:
     ```bash
     npm run import-data
     ```

5. **Start the Server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

   The server will start on http://localhost:5000

### Frontend Setup

1. **Prerequisites**

   - Node.js (v14 or higher)
   - npm or yarn package manager

2. **Setup**

   ```bash
   # Navigate to frontend directory
   cd frontend

   # Install dependencies
   npm install
   ```

3. **Environment Configuration**

   - Create a `.env` file in the frontend directory
   - Add the following environment variables:
     ```
     VITE_APP_GEMINI_API_KEY="*"
     VITE_SERVER_URL=http://localhost:5000
     ```

4. **Start Development Server**

   ```bash
   # Start development server
   npm run dev
   ```

   The frontend will start on http://localhost:5173

## API Endpoints

### 1. Get Restaurants List

`GET /api/restaurants`

Retrieves a paginated list of restaurants with optional filtering and location-based search.

**Query Parameters:**

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 5)
- `latitude` : Latitude for location-based search
- `longitude` : Longitude for location-based search
- `radius` (optional): Search radius in meters (default: 3000)
- `name` (optional): Search term for restaurant name or description
- `cuisines` (optional): Comma-separated list of cuisines to filter by
- `image` (optional): Base64 encoded image for cuisine recognition using Gemini AI

**Example Request:**

```bash
GET /api/restaurants?latitude=40.7128&longitude=-74.0060&radius=3000&cuisines=Italian,Japanese&page=1&limit=5
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "restaurantId": "123",
      "name": "Pasta Paradise",
      "cuisines": ["Italian"],
      "rating": 4.5,
      "priceRange": "$$"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 5,
    "pages": 10
  }
}
```

### 2. Get Restaurant by ID

`GET /api/restaurants/:id`

Retrieves detailed information about a specific restaurant.

**Path Parameters:**

- `id`: Restaurant ID

**Example Request:**

```bash
GET /api/restaurants/123
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "restaurantId": "123",
    "name": "Pasta Paradise",
    "description": "Authentic Italian cuisine",
    "cuisines": ["Italian", "Mediterranean"],
    "rating": 4.5,
    "priceRange": "$$",
    "address": "123 Main St, New York, NY",
    "phone": "+1-555-0123",
    "website": "https://pastaparadise.com"
  }
}
```

## Core Logic

### Indexing Strategy

1. **2dsphere Index for Location**

   - Enables efficient geospatial queries and radius-based searches
   - Index on `location` field with coordinates

2. **Atlas Search Index for Text**

   - Provides full-text search with fuzzy matching on `name`, `description`, and `cuisine` fields
   - Optimized for text-based queries with relevance scoring

3. **Combined Indexing Approach**
   - Atlas Search excels at text search but has limitations with geospatial queries
   - 2dsphere provides efficient location-based filtering
   - Using both indexes together provides:
     - Fast text search with Atlas Search
     - Accurate location filtering with 2dsphere
     - Optimal performance for combined queries
     - Better scalability for large datasets

## Improvements

### 1. Elasticsearch Integration

- Better text search performance and handling of large datasets
- More flexible query options and improved relevance scoring

### 2. Redis Caching Layer

- Cache frequent searches to reduce database load
- Faster response times for repeated queries
