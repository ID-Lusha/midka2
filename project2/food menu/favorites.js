const favoritesContainer = document.getElementById('favorites');

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>You have no favorite recipes yet.</p>';
        return;
    }

    favoritesContainer.innerHTML = ''; 
    favorites.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button onclick="removeFavorite(${recipe.id})">Remove from Favorites</button>
        `;
        favoritesContainer.appendChild(recipeCard);
    });
}

function removeFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter(fav => fav.id !== id);

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    displayFavorites(); 
}

document.addEventListener('DOMContentLoaded', displayFavorites);
