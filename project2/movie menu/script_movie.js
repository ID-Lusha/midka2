const apiKey = 'af8fbbd491dc732efadcdc36b64f06b1';

const searchInput = document.getElementById('searchInput');
const moviesContainer = document.getElementById('movies');
const movieModal = document.getElementById('movieModal');
const movieDetails = document.getElementById('movieDetails');
const closeModal = document.querySelector('.close');
const sortSelect = document.getElementById('sortSelect');

searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    const sortBy = sortSelect.value;
    if (query.length > 2) {
        searchMovies(query, sortBy);
    }
});

sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    const query = searchInput.value;
    if (query.length > 2) {
        searchMovies(query, sortBy);
    } else {
        getSortedMovies(sortBy);
    }
});

async function searchMovies(query, sortBy = 'popularity.desc') {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}&language=ru-RU`);
    const data = await response.json();
    const sortedMovies = sortMovies(data.results, sortBy);
    displayMovies(sortedMovies);
}

async function getSortedMovies(sortBy) {
    const baseUrl = 'https://api.themoviedb.org/3/discover/movie?';
    const url = `${baseUrl}api_key=${apiKey}&sort_by=${sortBy}&language=ru-RU`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

function sortMovies(movies, sortBy) {
    switch (sortBy) {
        case 'popularity.desc':
            return movies.sort((a, b) => b.popularity - a.popularity);
        case 'popularity.asc':
            return movies.sort((a, b) => a.popularity - b.popularity);
        case 'release_date.desc':
            return movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        case 'release_date.asc':
            return movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        case 'vote_average.desc':
            return movies.sort((a, b) => b.vote_average - a.vote_average);
        case 'vote_average.asc':
            return movies.sort((a, b) => a.vote_average - b.vote_average);
        default:
            return movies;
    }
}

function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        const isInWatchlist = isMovieInWatchlist(movie.id);

        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <button onclick="getMovieDetails(${movie.id})">View Details</button>
            <button id="watchlistButton-${movie.id}" onclick="saveToWatchlist(${movie.id}, '${movie.title}', '${movie.poster_path}', this)">
                ${isInWatchlist ? 'In Watchlist' : '❤️ Watchlist'}
            </button>
        `;
        moviesContainer.appendChild(movieCard);
    });
}

function isMovieInWatchlist(id) {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    return watchlist.some(movie => movie.id === id);
}

async function getMovieDetails(movieId) {
    const baseUrl = 'https://api.themoviedb.org/3/movie/';
    try {
        const detailsResponse = await fetch(`${baseUrl}${movieId}?api_key=${apiKey}&language=ru-RU`);
        const details = await detailsResponse.json();

        const creditsResponse = await fetch(`${baseUrl}${movieId}/credits?api_key=${apiKey}&language=ru-RU`);
        const credits = await creditsResponse.json();

        const reviewsResponse = await fetch(`${baseUrl}${movieId}/reviews?api_key=${apiKey}&language=ru-RU`);
        const reviews = await reviewsResponse.json();

        const videosResponse = await fetch(`${baseUrl}${movieId}/videos?api_key=${apiKey}&language=ru-RU`);
        const videos = await videosResponse.json();

        showMovieModal(details, credits, reviews, videos);
    } catch (error) {
        console.error("Ошибка при получении данных о фильме:", error);
    }
}

function showMovieModal(details, credits, reviews, videos) {
    const cast = credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
    const crew = credits.crew.slice(0, 5).map(member => `${member.job}: ${member.name}`).join(', ');
    const trailer = videos.results.length > 0 ? `https://www.youtube.com/watch?v=${videos.results[0].key}` : 'Трейлер не доступен';

    movieDetails.innerHTML = `
        <h2>${details.title}</h2>
        <img src="https://image.tmdb.org/t/p/w500/${details.poster_path}" alt="${details.title}">
        
        <h3>Synopsis:</h3>
        <p>${details.overview}</p>

        <h3>Rating:</h3>
        <p>${details.vote_average} / 10</p>

        <h3>Runtime:</h3>
        <p>${details.runtime} minutes</p>

        <h3>Cast:</h3>
        <p>${cast || 'No cast information available'}</p>

        <h3>Crew:</h3>
        <p>${crew || 'No crew information available'}</p>

        <h3>Reviews:</h3>
        <p>${reviews.results.length > 0 ? reviews.results[0].content : 'No reviews available'}</p>

        <h3>Watch Trailer:</h3>
        <a href="${trailer}" target="_blank">Watch on YouTube</a>
    `;
    movieModal.style.display = 'block';
}

closeModal.onclick = () => {
    movieModal.style.display = 'none';
};

function saveToWatchlist(id, title, posterPath, buttonElement) {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const movieIndex = watchlist.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        watchlist.push({ id, title, posterPath });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        
        buttonElement.textContent = 'In Watchlist';
        buttonElement.disabled = true; 
    } else {
        buttonElement.textContent = 'In Watchlist'; 
    }
}
