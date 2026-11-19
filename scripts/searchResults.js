// JS file for the Search Results page
// Handles two modes via URL parameters:
//   searchResults.html?q=...  -> search recipes by name
//   searchResults.html?c=...  -> show all recipes of a category

import { searchRecipes, getRecipesByCategory } from "./request.js";
import { setSearchInputValue } from "./search.js";
import { renderRecipeCards } from "./recipeCard.js";

// Get URL parameters: ?q= search query, ?c= category
function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        query: params.get("q") || "",
        category: params.get("c") || "",
    };
}

// Set the label heading (prefix + name shown in quotes)
function displayHeading(prefix, name) {
    const prefixElement = document.getElementById("results-prefix");
    const nameElement = document.getElementById("search-query");
    if (prefixElement) prefixElement.textContent = prefix;
    if (nameElement) nameElement.textContent = name;
}

// Display a list of recipes as cards
function displayResults(meals, category, emptyMessage) {
    const container = document.getElementById("search-results-box");

    if (!meals || meals.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>${emptyMessage}</p>
            </div>
        `;
        return;
    }

    // Use shared render function which includes bookmark initialization
    renderRecipeCards(container, meals);

    // Category results (filter.php) don't include the category name,
    // so tag the cards manually (keeps bookmarks saved from here consistent)
    if (category) {
        container.querySelectorAll(".recipe-box").forEach(box => {
            box.dataset.category = category;
        });
    }
}

// Show loading state
function showLoading(message) {
    const container = document.getElementById("search-results-box");
    container.innerHTML = `
        <div class="loading">
            <p>${message}</p>
        </div>
    `;
}

// Show error state
function showError(message) {
    const container = document.getElementById("search-results-box");
    container.innerHTML = `
        <div class="error">
            <p>${message}</p>
        </div>
    `;
}

// Initialize search results page (handles both ?q= search and ?c= category)
async function initSearchResults() {
    const { query, category } = getParams();

    // Category mode: show all recipes of that category
    if (category) {
        displayHeading("Recipes in category", category);
        document.title = `${category} - Kain't Decide?`;
        showLoading(`Loading ${category} recipes...`);

        const meals = await getRecipesByCategory(category);

        if (meals === null) {
            showError(`Failed to load ${category} recipes. Please try again.`);
        } else {
            displayResults(meals, category, "No recipes found in this category.");
        }
        return;
    }

    // Search mode
    displayHeading("Search Results for", query);
    // Pre-fill search input with current query
    setSearchInputValue(query);

    if (!query) {
        showError("Failed to load search results. Please try again.");
        return;
    }

    showLoading("Searching recipes...");
    const meals = await searchRecipes(query);

    if (meals === null) {
        showError("Failed to load search results. Please try again.");
    } else {
        displayResults(meals, "", "No recipes found for your search.");
    }
}

initSearchResults();
