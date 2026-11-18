// JS file for the Search Results page

import { searchRecipes } from "./request.js";
import { setSearchInputValue } from "./search.js";
import { renderRecipeCards } from "./recipeCard.js";

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
    // Pre-fill search input with current query
    setSearchInputValue(query);
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

    // Use shared render function which includes bookmark initialization
    renderRecipeCards(container, meals);
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