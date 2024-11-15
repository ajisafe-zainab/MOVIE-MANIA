# Movie Browse & Watchlist Application

## Overview

A dynamic web application for browsing movies, maintaining a personal watchlist, and searching through movie collections. The application fetches movie data from multiple APIs and provides a seamless user experience for managing your movie preferences.

## Features

### 🎬 Movie Browsing

- Fetch and display movies from multiple API sources
- Responsive grid layout for movie cards
- Display key movie information including:
  - Movie title
  - Movie ID
  - Release date
  - Rating
  - Movie poster/image
  - IMDB link

### 📝 Watchlist Management

- Add/remove movies to personal watchlist
- Persistent storage using localStorage
- Sliding watchlist panel
- Visual indicators for watchlisted items
- Real-time watchlist updates

### 🔍 Search Functionality

- Real-time search through loaded movies
- Search across multiple fields:
  - Movie title
  - Release date
  - Rating
- Instant results display
- Result count indicator
- Restores full list when search is cleared

## Demo in Pictures

#### Main UI
![1731534246091](image/README/1731534246091.png)

#### Search functionality in action
![1731534283334](image/README/1731534283334.png)

#### Watchlist functionality in action
![1731534308068](image/README/1731534308068.png)

## Technical Implementation

### Data Sources

```js
const moviesUrl = [
    'https://jsonfakery.com/movies/infinite-scroll',
    'https://api.sampleapis.com/movies/comedy',
    'https://dummyapi.online/api/movies'
];
```

### Core Functions

#### Movie Data Fetching

- `fetchMovieData()`: Fetches data from individual API endpoints
- `serializeMovieData()`: Normalizes movie data from different sources
- `fetchAllMovies()`: Orchestrates fetching from all sources

#### Watchlist Management

- `toggleWatchlist()`: Handles adding/removing movies
- `saveWatchlist()`: Persists watchlist to localStorage
- `renderWatchlist()`: Updates watchlist UI

## Setup & Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd movie-app
```

2. Include the necessary HTML elements:
   Open the index.html file in your browser

## Author

Zainab Ajisafe [zainabajisafe06@gmail.com]
