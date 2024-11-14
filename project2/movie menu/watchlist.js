const watchlistContainer = document.getElementById('watchlistMovies');

function loadWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlistContainer.innerHTML = '';

    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = '<p>Your Watchlist is empty.</p>';
    } else {
        watchlist.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500/${movie.posterPath}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <button onclick="removeFromWatchlist(${movie.id})">Remove from Watchlist</button>
            `;
            watchlistContainer.appendChild(movieCard);
        });
    }
}

function removeFromWatchlist(id) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(movie => movie.id !== id);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    loadWatchlist();
}

document.addEventListener('DOMContentLoaded', loadWatchlist);
