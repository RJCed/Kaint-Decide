// JS file for the Search Results page

import { searchRecipes } from "./request.js";

// Get search query from URL parameters
function getSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
}

// Display search query in the label
function displaySearchQuery(query) {
    const queryElement = document.getElementById("search-query");
    if (queryElement) {
        queryElement.textContent = query;
    }
}

// Create recipe card HTML (consistent with home page)
function createRecipeCard(meal) {
    const article = document.createElement("article");
    article.className = "recipe-box";
    article.dataset.recipeId = meal.idMeal;

    article.innerHTML = `
        <div class="recipe-image">
            <img class="recipe-img"
                src="./images/placeholder.jpg"
                data-src="${meal.strMealThumb}"
                alt="${meal.strMeal}">
            <button
                class="bookmark-btn"
                type="button"
                aria-label="Bookmark recipe"
                aria-pressed="false"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.8l2.8 5.7 6.3.9-4.55 4.43
                            1.07 6.25L12 17.1l-5.62 2.95
                            1.07-6.25L2.9 9.4l6.3-.9L12 2.8z"/>
                </svg>
            </button>
        </div>
        <div class="recipe-info">
            <img src="./images/recipeIcon.svg" alt="">
            <h2 class="recipe-name">${meal.strMeal}</h2>
        </div>
    `;

    // Load actual image after placeholder
    const img = article.querySelector(".recipe-img");
    img.addEventListener("load", () => {
        img.classList.add("loaded");
    });
    img.src = meal.strMealThumb;

    return article;
}

// Display search results
function displaySearchResults(meals) {
    const container = document.getElementById("search-results-box");

    if (!meals || meals.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>No recipes found for your search.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";
    meals.forEach(meal => {
        const card = createRecipeCard(meal);
        container.appendChild(card);
    });
}

// Show loading state
function showLoading() {
    const container = document.getElementById("search-results-box");
    container.innerHTML = `
        <div class="loading">
            <p>Searching recipes...</p>
        </div>
    `;
}

// Show error state
function showError() {
    const container = document.getElementById("search-results-box");
    container.innerHTML = `
        <div class="error">
            <p>Failed to load search results. Please try again.</p>
        </div>
    `;
}

// Initialize search results page
async function initSearchResults() {
    const query = getSearchQuery();
    displaySearchQuery(query);

    if (!query) {
        showError();
        return;
    }

    showLoading();
    const meals = await searchRecipes(query);

    if (meals === null) {
        showError();
    } else {
        displaySearchResults(meals);
    }
}

initSearchResults();