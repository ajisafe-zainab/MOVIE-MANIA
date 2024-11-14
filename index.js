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

// //Function to fetch and serialize movie data from all URLs
//  const fetchAllMovies = async () =>{
//     const moviesData = await Promise.all(moviesUrl.map((url)=>fetchMovieData(url)));
//     const serializeMovies = serializeMovieData(moviesData);
//     console.log(moviesData.filter(Boolean)); //Filter out null values from failed requests.
//     console.log(serializeMovies);
//     moviesData.forEach(mov =>{
//         console.log(mov?.slice(0,2));
//     });
//  }
//  //Run the function to fetch and serialize all moviees data 
//    fetchAllMovies();
   

//test
// Function to fetch and serialize movie data from all URLs
const fetchAllMovies = async () => {
    const moviesData = await Promise.all(moviesUrl.map((url) => fetchMovieData(url)));
    const serializeMovies = serializeMovieData(moviesData);
    console.log(moviesData.filter(Boolean)); // Filter out null values from failed requests.
    console.log(serializeMovies);
    return serializeMovies; // Return the serialized movie data
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


// Run the function to fetch and serialize all movie data
document.addEventListener("DOMContentLoaded", async () => {
    const listOfMovies = await fetchAllMovies();
    if (listOfMovies) {
        moviesRenderer(listOfMovies); // Pass listOfMovies to moviesRenderer
    } else {
        console.error('Failed to load movie data.');
    }
});


//   document.addEventListener("DOMContentLoaded", async()=>{
//   const listOfMovies = await fetchAllMovies();
//     (listOfMovies)
//     // if(listOfMovies){
//     //   moviesRenderer(listOfMovies);
//     // }
//     // // else{
//     // //   console.error('Failed to load movie data.')
//     // // }
//    }
//   );


  //WATCHLIST
  let watchlistDisplayer = document.querySelector('.watchlist-displayer');
  let watchlist = document.querySelector('.watchlist');
//   let watch = document.querySelector('.main');
 
  let sign = document.querySelector('.add');
  sign.addEventListener('click',watcher);



document.addEventListener('DOMContentLoaded',loadWatchlist);
function watcher(movie){
    // e.preventDefault();
    let enter = document.querySelector('input');
    let display = document.querySelector('.watchlist-displayer');

    let wrap = document.createElement('div');
    wrap.classList.add('container');  

    if(enter.value ===""){
        alertMessage('Enter movie to add to watchlist','white')
    }
    else{
        saveToLS(movie);
        alertMessage('Movies added to watchlist successfully','pink');
    }

    let tag = document.createElement('li');
    tag.classList.add('val');  
    tag.textContent = enter.value;
    // tag.textContent = '';
    
    let cancel = document.createElement('p');
    cancel.classList.add('canceler');
    cancel.textContent = 'X';

   wrap.appendChild(tag);
   wrap.appendChild(cancel);
   display.appendChild(wrap);

}
watchlistDisplayer.addEventListener('click',removal);

function removal(element){
    if(element.target.classList.contains('deleter')){
        element.target.parentElement.remove();
        alertMessage('movies removed','blue');
        //To remove from the localstorage
        removeFromLS(element.target.parentElement.textContent.slice(0,-1));
    }
}
//A customised alert box
function alertMessage(message,color){
    let paragraph = document.createElement('p');
    paragraph.className = 'message-p';
    paragraph.style.padding = " 5px 5px";
    paragraph.style.backgroundColor = color;
    paragraph.style.color = '#fff';
    paragraph.textContent = message;
    paragraph.style.borderRadius = '10px';
    paragraph.style.textAlign = 'center'
    paragraph.style.width = '50%'
    watch.insertAdjacentElement('beforebegin',paragraph);
    setTimeout(() =>{
        document.querySelector('.message-p').remove();
    },1000)
}

//LOcAL STORAGE
function loadWatchlist(){
    let movies = loadLS();
    movies.forEach(element =>{
        watcher(element);
    });
}
//To load localstorage
function loadLS(){
    let movies;
    if(localStorage.getItem('movie') === null){
     movies = [];
    }
    else{
        movies = JSON.parse(localStorage.getItem('movie'));
    }
    return movies;
}
//To save to localstorage
function saveToLS(movie){
    let movies = loadLS();
    movies.push(movie);
    localStorage.setItem('movie', JSON.stringify(movies));
}
//To remove from localstorage
function removeFromLS(movie){
    let movies = loadLS();
    movies.forEach((mv,index)=>{
        if(mv === movie){
            movies.splice(index,1);
        }
    })
    localStorage.setItem('movie', JSON.stringify(movies));
}
