const apiKey = '466b1ac9799b4a989fbe03617ffa62de';
const searchInput = document.getElementById('searchInput');
const recipesContainer = document.getElementById('recipes');
const recipeModal = document.getElementById('recipeModal');
const recipeDetails = document.getElementById('recipeDetails');
const closeModal = document.querySelector('.close');
const favoritesContainer = document.getElementById('favorites');
const backToSearchBtn = document.getElementById('backToSearchBtn');
const viewFavoritesBtn = document.getElementById('viewFavoritesBtn');

async function searchRecipes(query) {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`);
    const data = await response.json();
    displayRecipes(data.results);
}

searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    if (query.length > 2) {
        searchRecipes(query);
    }
});

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>Ready in ${recipe.readyInMinutes} mins</p>
            <button onclick="getRecipeDetails(${recipe.id})">View Recipe</button>
            <button class="favorite-btn" onclick="toggleFavorite(${recipe.id}, '${recipe.title}', '${recipe.image}')">
                ❤️ Favorite
            </button>
        `;
        recipesContainer.appendChild(recipeCard);
        updateFavoriteButton(recipe.id);
    });
}

async function getRecipeDetails(id) {
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
    const recipe = await response.json();
    showRecipeModal(recipe);
}

function showRecipeModal(recipe) {
    recipeDetails.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>Ingredients:</h3>
        <ul>
            ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
        </ul>
        <h3>Instructions:</h3>
        <p>${recipe.instructions || 'No instructions available.'}</p>
        <h3>Nutritional Info:</h3>
        <p>Calories: ${recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 'N/A'}</p>
    `;
    recipeModal.style.display = 'block';
}

closeModal.onclick = () => {
    recipeModal.style.display = 'none';
};

function toggleFavorite(id, title, image) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(fav => fav.id === id);

    if (index === -1) {
        favorites.push({ id, title, image });
        alert(`${title} added to favorites!`);
    } else {
        favorites.splice(index, 1);
        alert(`${title} removed from favorites.`);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(id);
}

function updateFavoriteButton(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.some(fav => fav.id === id);

    const buttons = document.querySelectorAll('.favorite-btn');

    buttons.forEach(button => {
        if (button.onclick.toString().includes(id)) {
            if (isFavorite) {
                button.textContent = '❤️ Added to Favorites';
                button.style.color = 'red';
            } else {
                button.textContent = '❤️ Favorite';
                button.style.color = '';
            }
        }
    });
}

function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorites yet.</p>';
        return;
    }

    favoritesContainer.innerHTML = '';
    favorites.forEach(fav => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${fav.image}" alt="${fav.title}">
            <h3>${fav.title}</h3>
            <button onclick="getRecipeDetails(${fav.id})">View Recipe</button>
        `;
        favoritesContainer.appendChild(recipeCard);
    });
}

backToSearchBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

viewFavoritesBtn.addEventListener('click', () => {
    window.location.href = 'favorites.html';
});

if (window.location.pathname.includes('favorites.html')) {
    showFavorites();
} else {
    viewFavoritesBtn.style.display = 'block';
}
