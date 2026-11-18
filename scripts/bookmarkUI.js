/**
 * Bookmark UI Module
 * Handles bookmark button interactions and event delegation
 */

import { toggleBookmark, updateButtonState, isBookmarked } from "./bookmarks.js";

// Track if global listener is initialized
let globalListenerInitialized = false;

/**
 * Extract recipe data from a recipe box element
 * @param {HTMLElement} recipeBox - The .recipe-box article element
 * @returns {Object} Recipe data object
 */
function getRecipeDataFromBox(recipeBox) {
    const nameEl = recipeBox.querySelector(".recipe-name");
    const imgEl = recipeBox.querySelector(".recipe-img");

    return {
        idMeal: recipeBox.dataset.recipeId,
        strMeal: nameEl ? nameEl.textContent : "",
        strMealThumb: imgEl ? imgEl.src : "",
        strCategory: recipeBox.dataset.category || "",
        strArea: recipeBox.dataset.area || "",
    };
}

/**
 * Handle bookmark button click
 * @param {Event} event - Click event
 */
function handleBookmarkClick(event) {
    const button = event.target.closest(".bookmark-btn");
    if (!button) return;

    const recipeBox = button.closest(".recipe-box");

    if (!recipeBox) return;

    const recipe = getRecipeDataFromBox(recipeBox);

    if (!recipe.idMeal || recipe.idMeal === "RECIPE_ID") {
        console.warn("Recipe ID not available yet");
        return;
    }

    toggleBookmark(recipe, button);
}

/**
 * Initialize global event delegation for bookmark buttons (call once)
 */
function initGlobalListener() {
    if (globalListenerInitialized) return;

    document.addEventListener("click", handleBookmarkClick);
    globalListenerInitialized = true;
}

/**
 * Initialize bookmark button states for all buttons in container
 * Also ensures global click listener is set up
 * @param {HTMLElement} container - Container element (default: document)
 */
export function initBookmarkButtonStates(container = document) {
    // Ensure global listener is active
    initGlobalListener();

    const buttons = container.querySelectorAll(".bookmark-btn");

    buttons.forEach(button => {
        const recipeBox = button.closest(".recipe-box");
        if (recipeBox) {
            const recipeId = recipeBox.dataset.recipeId;
            if (recipeId && recipeId !== "RECIPE_ID") {
                const bookmarked = isBookmarked(recipeId);
                updateButtonState(button, bookmarked);
            }
        }
    });
}

/**
 * Update a single bookmark button's state
 * @param {HTMLElement} button - The bookmark button element
 * @param {boolean} bookmarked - Whether the recipe is bookmarked
 */
export function setButtonBookmarked(button, bookmarked) {
    updateButtonState(button, bookmarked);
}

// Backward compatibility - does nothing (global listener handles clicks)
export function initBookmarkButtons(container = document) {
    initGlobalListener();
}