//Your OMDB API key
const apiKey = '2f6808ea';

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const yearInput = document.getElementById('year-input');
const typeSelect = document.getElementById('type-select');
const moviesGrid = document.getElementById('movies-grid');
const detailsSection = document.getElementById('details-section');
const detailsContainer = document.getElementById('movie-details');
const backBtn = document.getElementById('back-btn');
const watchlistSection = document.getElementById('watchlist-section');
const watchlistGrid = document.getElementById('watchlist-grid');
const searchLink = document.getElementById('search-link');
const watchlistLink = document.getElementById('watchlist-link');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);
backBtn.addEventListener('click', showSearchSection);
searchLink.addEventListener('click', showSearchSection);
watchlistLink.addEventListener('click', showWatchlistSection);

// Fetch Movies from OMDB API
function fetchMovies(query, year, type) {
    if (!query) {
        moviesGrid.innerHTML = '<p>Please enter a movie title.</p>';
        return;
    }
    
    fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            if (data.Response === "True") {
                displayMovies(data.Search);
            } else {
                moviesGrid.innerHTML = `<p>${data.Error}</p>`;
            }
        })
}

// Display Movies
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title} (${movie.Year})</h3>
            <button onclick="showMovieDetails('${movie.imdbID}')">Details</button>
            <button onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
        `;
        moviesGrid.appendChild(movieCard);
    });
}

// Show Movie Details
function showMovieDetails(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                detailsSection.style.display = 'block';
                moviesGrid.style.display = 'none';
                watchlistSection.style.display = 'none';
                detailsContainer.innerHTML = `
                    <img src="${data.Poster}" alt="${data.Title}">
                    <h2>${data.Title} (${data.Year})</h2>
                    <p><strong>Plot:</strong> ${data.Plot}</p>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Cast:</strong> ${data.Actors}</p>
                    <p><strong>Rating:</strong> ${data.imdbRating}</p>
                    if(movie.Response ==='true){
                    
                    <p><a href='https://www.imdb.com/?ref_=login/${movie.imdb}'</a></p>
            }

                `;
            } else {
                detailsContainer.innerHTML = `<p>${data.Error}</p>`;
            }
        })
        .catch(() => {
            detailsContainer.innerHTML = '<p>Error fetching data. Try again later.</p>';
        });
}

// Show Search Section
function showSearchSection() {
    detailsSection.style.display = 'none';
    watchlistSection.style.display = 'none';
    moviesGrid.style.display = 'grid';
}

// Show Watchlist Section
function showWatchlistSection() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlistSection.style.display = 'block';
    moviesGrid.style.display = 'none';
    detailsSection.style.display = 'none';
    watchlistGrid.innerHTML = '';
    watchlist.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title} (${movie.Year})</h3>
            <button onclick="showMovieDetails('${movie.imdbID}')">Details</button>
            <button onclick="removeFromWatchlist('${movie.imdbID}')">Remove from Watchlist</button>
        `;
        watchlistGrid.appendChild(movieCard);
    });
}
// Show Movie Details
function showMovieDetails(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                detailsSection.style.display = 'block';
                moviesGrid.style.display = 'none';
                watchlistSection.style.display = 'none';
                detailsContainer.innerHTML = `
                    <img src="${data.Poster}" alt="${data.Title}">
                    <h2>${data.Title} (${data.Year})</h2>
                    <p><strong>Plot:</strong> ${data.Plot}</p>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Cast:</strong> ${data.Actors}</p>
                    <p><strong>Rating:</strong> ${data.imdbRating}</p>
                    <p><a href="https://www.imdb.com/title/${imdbID}" target="_blank">View on IMDb</a></p> <!-- IMDb link -->
                `;
            } else {
                detailsContainer.innerHTML = `<p>${data.Error}</p>`;
            }
        })
        .catch(() => {
            detailsContainer.innerHTML = '<p>Error fetching data. Try again later.</p>';
        });
}


// Add Movie to Watchlist
function addToWatchlist(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
                if (!watchlist.some(movie => movie.imdbID === imdbID)) {
                    watchlist.push(data);
                    localStorage.setItem('watchlist', JSON.stringify(watchlist));
                    alert('Movie added to watchlist!');
                } else {
                    alert('Movie is already in your watchlist.');
                }
            } else {
                alert(`Error: ${data.Error}`);
            }
        })
        .catch(() => {
            alert('Error adding movie to watchlist. Try again later.');
        });
}

// Remove Movie from Watchlist
function removeFromWatchlist(imdbID) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    showWatchlistSection(); 
}

// Handle Search Form Submission
function handleSearch(event) {
    event.preventDefault();
    const query = searchInput.value.trim();

    const type = typeSelect.value;
    fetchMovies(query,  type);
    showSearchSection();
}
