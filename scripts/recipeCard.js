/**
 * Shared Recipe Card Module
 * Creates recipe card HTML elements with bookmark functionality
 */

import { initBookmarkButtons, initBookmarkButtonStates } from "./bookmarkUI.js";

/**
 * Create a recipe card article element
 * @param {Object} meal - Recipe data from TheMealDB API
 * @returns {HTMLElement} Article element with recipe card
 */
export function createRecipeCard(meal) {
    const article = document.createElement("article");
    article.className = "recipe-box";
    article.dataset.recipeId = meal.idMeal;
    article.dataset.category = meal.strCategory || "";
    article.dataset.area = meal.strArea || "";

    // Clicking the card opens the recipe page (handled globally in script.js)
    article.setAttribute("tabindex", "0");
    article.setAttribute("role", "link");
    article.setAttribute("aria-label", `View recipe: ${meal.strMeal}`);

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

/**
 * Initialize bookmark functionality for recipe cards in a container
 * @param {HTMLElement} container - Container with recipe cards
 */
export function initBookmarkButtonsInContainer(container) {
    initBookmarkButtons(container);
    initBookmarkButtonStates(container);
}

/**
 * Render multiple recipe cards into a container
 * @param {HTMLElement} container - Target container element
 * @param {Array} meals - Array of recipe objects
 */
export function renderRecipeCards(container, meals) {
    container.innerHTML = "";

    if (!meals || meals.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>No recipes found.</p>
            </div>
        `;
        return;
    }

    meals.forEach(meal => {
        const card = createRecipeCard(meal);
        container.appendChild(card);
    });

    // Initialize bookmark buttons for newly added cards
    initBookmarkButtonsInContainer(container);
}