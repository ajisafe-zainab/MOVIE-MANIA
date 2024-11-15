
//List of API URLs
const moviesUrl = ['https://jsonfakery.com/movies/infinite-scroll','https://api.sampleapis.com/movies/comedy','https://dummyapi.online/api/movies'];
//Function to fetch data from a single URL with error handling
const fetchMovieData = async (url)=>{
try{
const result = await fetch(url);
if(!result.ok){
    throw new Error(`Error ${result.status}:${result.statusText}`);
};
const data = await result.json();
return data?.data || data;
}
catch(error){
    console.error(`Failed to fetch data from ${url}:`,error.message);
    return null; //return null if there's an error
}
};

//Function to normalise and combine movie data from different APIs
const serializeMovieData = (moviesArray)=>{
    //Flatten array of arrays and filter out any null or empty results
    const flattenedMovies = moviesArray?.data?.filter(Boolean) || moviesArray.flat().filter(Boolean);
    console.log(flattenedMovies);
// Normalize each movie to a consistent structure
  return flattenedMovies.map(movie =>{
    return{
        id: movie.id || null,
        movie_id:movie.movie_id || null,
        title: movie.movie || movie.original_title || movie.title ||'Unknown Title',
        rating: movie.rating || movie.vote_average || null,
        image:movie.image || movie.poster_path || movie.posterURL || null,
        imdbURL:movie.imdb_url || `https://www.imdb.com/title/${movie.imdbId}` || null,
        releaseDate: movie.release_date || null
    };
  });
};



// Keep track of all loaded movies
let allLoadedMovies = []; // Store all movies initially loaded for saerch purpose

const fetchAllMovies = async () => {
    const moviesData = await Promise.all(moviesUrl.map((url) => fetchMovieData(url)));
    const serializedMovies = serializeMovieData(moviesData);
    console.log(moviesData.filter(Boolean)); // Filter out null values from failed requests.
    console.log(serializedMovies);
    allLoadedMovies = serializedMovies; // Store all loaded movies
    return serializedMovies;
};


//Function to create and render movies;
function moviesRenderer(lists){
    const moviesContainer = document.querySelector('.movies-container');
    
    lists.forEach((list) => {
    const movieBox = document.createElement('div');
    movieBox.classList.add('movie-box');
    
    const movieImage = document.createElement('img');
    movieImage.classList.add('movie-image');
    movieImage.src = list.image;
    movieImage.alt = list.title;
    
    const movieId = document.createElement('h2');
    movieId.classList.add('movie-id');
    movieId.textContent = `ID: ${list.id || 'N/A'}`;

    const movieTitle = document.createElement('h2');
    movieTitle.classList.add('movie-title');
    movieTitle.textContent = list.title; 
    
    const movieUrl = document.createElement('a');
    movieUrl.classList.add('movie-url');
    movieUrl.href = list.imdbURL;
    movieUrl.target = '_blank';
    movieUrl.textContent = 'IMDB';
    
    const movieReleaseDate = document.createElement('h4');
    movieReleaseDate.classList.add('movie-date');
    movieReleaseDate.textContent = `Release Date: ${list.releaseDate}`;
    
    const movieRating = document.createElement('p');
    movieRating.classList.add('movie-rating');
    movieRating.textContent = `Rating: ${list.rating}`;
    
    movieBox.appendChild(movieImage);
    movieBox.appendChild(movieId);
    movieBox.appendChild(movieUrl);
    movieBox.appendChild(movieReleaseDate);
    movieBox.appendChild(movieRating);
    
    
    moviesContainer.appendChild(movieBox);

    }
  );
};

document.addEventListener("DOMContentLoaded", async () => {
    const listOfMovies = await fetchAllMovies();
    if (listOfMovies) {
        moviesRenderer(listOfMovies);
        implementSearch(); // Initialize search functionality
    } else {
        console.error('Failed to load movie data.');
    }

    renderWatchlist();
    
    // Add watchlist toggle button functionality if it exists
    const watchlistToggleBtn = document.querySelector('.watchlist-toggle');
    if (watchlistToggleBtn) {
        watchlistToggleBtn.addEventListener('click', () => {
            const watchlistContainer = document.querySelector('.watchlist-container');
            if (watchlistContainer) {
                const isVisible = watchlistContainer.style.display !== 'none';
                watchlistContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    renderWatchlist(); // Update watchlist when showing
                }
            }
        });
    }
});



// Initialize watchlist from localStorage or create empty array
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Function to save watchlist to localStorage
function saveWatchlist() {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

// Toggle movie in watchlist
function toggleWatchlist(movie) {
    const index = watchlist.findIndex(item => item.id === movie.id);
    if (index === -1) {
        // Add to watchlist
        watchlist.push(movie);
        saveWatchlist();
        return true;
    } else {
        // Remove from watchlist
        watchlist.splice(index, 1);
        saveWatchlist();
        return false;
    }
}

// Check if movie is in watchlist
function isInWatchlist(movieId) {
    return watchlist.some(movie => movie.id === movieId);
}

// Render watchlist
function renderWatchlist() {
    const watchlistContainer = document.querySelector('.watchlist-displayer');
    if (!watchlistContainer) return;

    watchlistContainer.innerHTML = '';

    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = '<p>Your watchlist is empty</p>';
        return;
    }

    watchlist.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('watchlist-item');
        
        movieItem.innerHTML = `
            <div class="watchlist-movie-info">
                <img src="${movie.image || '/placeholder-image.jpg'}" 
                     alt="${movie.title}" 
                     class="watchlist-movie-image"
                     onerror="this.src='/placeholder-image.jpg'">
                <div class="watchlist-movie-details">
                    <h3>${movie.title}</h3>
                    <p>Rating: ${movie.rating || 'N/A'}</p>
                    ${movie.releaseDate ? `<p>Release Date: ${movie.releaseDate}</p>` : ''}
                </div>
            </div>
            <button class="remove-from-watchlist" data-movie-id="${movie.id}">
                Remove
            </button>
        `;

        watchlistContainer.appendChild(movieItem);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-from-watchlist').forEach(button => {
        button.addEventListener('click', (e) => {
            const movieId = e.target.dataset.movieId;
            const movieToRemove = watchlist.find(m => m.id === movieId);
            if (movieToRemove) {
                toggleWatchlist(movieToRemove);
                renderWatchlist();
                // Update the main movie list UI if it exists
                updateMovieListUI();
            }
        });
    });
}

// Update the main movies list UI to reflect watchlist status
function updateMovieListUI() {
    const movieBoxes = document.querySelectorAll('.movie-box');
    movieBoxes.forEach(movieBox => {
        const movieId = movieBox.dataset.movieId;
        const watchlistButton = movieBox.querySelector('.watchlist-button');
        if (watchlistButton) {
            watchlistButton.textContent = isInWatchlist(movieId) 
                ? 'Remove from Watchlist' 
                : 'Add to Watchlist';
            watchlistButton.classList.toggle('in-watchlist', isInWatchlist(movieId));
        }
    });
}

// Update the moviesRenderer function to include watchlist functionality
function moviesRenderer(lists) {
    const moviesContainer = document.querySelector('.movies-container');
    if (!moviesContainer) return;
    
    moviesContainer.innerHTML = '';
    
    lists.forEach((movie) => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box');
        movieBox.dataset.movieId = movie.id; // Add movie ID to the element
        
        movieBox.innerHTML = `
            <img class="movie-image" 
                 src="${movie.image || '/placeholder-image.jpg'}" 
                 alt="${movie.title}"
                 onerror="this.src='/placeholder-image.jpg'">
            <h2 class="movie-id">ID: ${movie.id || 'N/A'}</h2>
            <h2 class="movie-title">${movie.title}</h2>
            ${movie.imdbURL ? `<a class="movie-url" href="${movie.imdbURL}" target="_blank">IMDB</a>` : ''}
            ${movie.releaseDate ? `<h4 class="movie-date">Release Date: ${movie.releaseDate}</h4>` : ''}
            <p class="movie-rating">Rating: ${movie.rating || 'N/A'}</p>
            <button class="watchlist-button ${isInWatchlist(movie.id) ? 'in-watchlist' : ''}">
                ${isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
        `;
        
        // Add watchlist toggle functionality
        const watchlistButton = movieBox.querySelector('.watchlist-button');
        watchlistButton.addEventListener('click', () => {
            const isNowInWatchlist = toggleWatchlist(movie);
            watchlistButton.textContent = isNowInWatchlist 
                ? 'Remove from Watchlist' 
                : 'Add to Watchlist';
            watchlistButton.classList.toggle('in-watchlist', isNowInWatchlist);
            renderWatchlist(); // Update the watchlist display
        });
        
        moviesContainer.appendChild(movieBox);
    });
}


// Search functionality
function implementSearch() {
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show all movies
            moviesRenderer(allLoadedMovies);
            return;
        }

        // Filter movies based on search term
        const filteredMovies = allLoadedMovies.filter(movie => {
            const searchableTerms = [
                movie.title,
                movie.releaseDate,
                movie.rating?.toString()
            ].filter(Boolean); // Remove null/undefined values

            return searchableTerms.some(term => 
                term.toLowerCase().includes(searchTerm)
            );
        });

        // Render filtered results
        moviesRenderer(filteredMovies);

        // Update UI to show search results count
        updateSearchResultsCount(filteredMovies.length);
    });
}

// Show how many results were found
function updateSearchResultsCount(count) {
    const searchResultsCount = document.querySelector('.search-results-count');
    if (searchResultsCount) {
        searchResultsCount.textContent = count === 0 
            ? 'No movies found' 
            : `Found ${count} movie${count === 1 ? '' : 's'}`;
    }
}

