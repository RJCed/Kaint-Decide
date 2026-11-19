// JS file for the Categories page

import { getCategories } from "./request.js";

const categoriesContainer = document.getElementById("categories-container");

// Show loading state in the categories grid
function showLoading() {
    categoriesContainer.innerHTML = `
        <div class="loading">
            <p>Loading categories...</p>
        </div>
    `;
}

// Show error state in the categories grid
function showError() {
    categoriesContainer.innerHTML = `
        <div class="error">
            <p>Failed to load categories. Please try again.</p>
        </div>
    `;
}

/**
 * Create a single category card (links to the category's recipes
 * on the search results page)
 * @param {Object} category - Category object from TheMealDB (strCategory, strCategoryThumb, ...)
 * @returns {HTMLElement} Anchor element with the category card
 */
function createCategoryCard(category) {
    const card = document.createElement("a");
    card.className = "category-card";
    card.href = `searchResults.html?c=${encodeURIComponent(category.strCategory)}`;
    card.dataset.category = category.strCategory;
    card.setAttribute("aria-label", `View ${category.strCategory} recipes`);

    card.innerHTML = `
        <span class="category-card-img">
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
        </span>
        <span class="category-card-name">${category.strCategory}</span>
    `;

    return card;
}

/**
 * Render ALL categories into the grid
 * @param {Array} categories - Array of category objects
 */
function displayCategories(categories) {
    categoriesContainer.innerHTML = "";

    categories.forEach(category => {
        categoriesContainer.appendChild(createCategoryCard(category));
    });
}

// Load all categories on page load
async function initCategoriesPage() {
    showLoading();
    const categories = await getCategories();

    if (categories === null) {
        showError();
    } else {
        displayCategories(categories);
    }
}

initCategoriesPage();
