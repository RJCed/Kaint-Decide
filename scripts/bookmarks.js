/**
 * Bookmark Storage Module
 * Handles localStorage persistence for bookmarked recipes
 */

const BOOKMARKS_KEY = "kaint-decide-bookmarks";

/**
 * Get all bookmarked recipes from localStorage
 * @returns {Array} Array of bookmarked recipe objects
 */
export function getBookmarks() {
    try {
        const data = localStorage.getItem(BOOKMARKS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Failed to parse bookmarks from localStorage:", error);
        return [];
    }
}

/**
 * Save bookmarks array to localStorage
 * @param {Array} bookmarks - Array of recipe objects
 */
function saveBookmarks(bookmarks) {
    try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
        console.error("Failed to save bookmarks to localStorage:", error);
    }
}

/**
 * Check if a recipe is bookmarked
 * @param {string} recipeId - The meal ID (idMeal)
 * @returns {boolean}
 */
export function isBookmarked(recipeId) {
    const bookmarks = getBookmarks();
    return bookmarks.some(bookmark => bookmark.idMeal === recipeId);
}

/**
 * Get a specific bookmark by ID
 * @param {string} recipeId - The meal ID (idMeal)
 * @returns {Object|null} Bookmark object or null
 */
export function getBookmark(recipeId) {
    const bookmarks = getBookmarks();
    return bookmarks.find(bookmark => bookmark.idMeal === recipeId) || null;
}

/**
 * Add a recipe to bookmarks
 * @param {Object} recipe - Recipe object with idMeal, strMeal, strMealThumb, etc.
 * @returns {boolean} True if added, false if already exists
 */
export function saveBookmark(recipe) {
    const bookmarks = getBookmarks();

    if (bookmarks.some(b => b.idMeal === recipe.idMeal)) {
        return false; // Already bookmarked
    }

    // Store only necessary fields for rendering without API calls
    const bookmarkData = {
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        strCategory: recipe.strCategory || "",
        strArea: recipe.strArea || "",
    };

    bookmarks.push(bookmarkData);
    saveBookmarks(bookmarks);
    return true;
}

/**
 * Remove a recipe from bookmarks
 * @param {string} recipeId - The meal ID (idMeal)
 * @returns {boolean} True if removed, false if not found
 */
export function removeBookmark(recipeId) {
    const bookmarks = getBookmarks();
    const initialLength = bookmarks.length;

    const filtered = bookmarks.filter(bookmark => bookmark.idMeal !== recipeId);

    if (filtered.length === initialLength) {
        return false; // Not found
    }

    saveBookmarks(filtered);
    return true;
}

/**
 * Toggle bookmark state for a recipe
 * @param {Object} recipe - Recipe object
 * @param {HTMLElement} buttonEl - The bookmark button element
 * @returns {boolean} New bookmarked state (true = bookmarked, false = removed)
 */
export function toggleBookmark(recipe, buttonEl) {
    const currentlyBookmarked = isBookmarked(recipe.idMeal);

    if (currentlyBookmarked) {
        removeBookmark(recipe.idMeal);
        updateButtonState(buttonEl, false);
        dispatchBookmarksChanged();
        return false;
    } else {
        saveBookmark(recipe);
        updateButtonState(buttonEl, true);
        dispatchBookmarksChanged();
        return true;
    }
}

/**
 * Dispatch custom event when bookmarks change
 */
function dispatchBookmarksChanged() {
    window.dispatchEvent(new CustomEvent("bookmarks-changed"));
}

/**
 * Update bookmark button visual state
 * @param {HTMLElement} buttonEl - The bookmark button element
 * @param {boolean} isBookmarked - Whether the recipe is bookmarked
 */
export function updateButtonState(buttonEl, isBookmarked) {
    buttonEl.setAttribute("aria-pressed", isBookmarked);
    if (isBookmarked) {
        buttonEl.classList.add("bookmarked");
    } else {
        buttonEl.classList.remove("bookmarked");
    }
}

/**
 * Initialize bookmark button states for all buttons in container
 * @param {HTMLElement} container - Container element (default: document)
 */
export function initBookmarkButtonStates(container = document) {
    const buttons = container.querySelectorAll(".bookmark-btn");

    buttons.forEach(button => {
        const recipeBox = button.closest(".recipe-box");
        if (recipeBox) {
            const recipeId = recipeBox.dataset.recipeId;
            const isBookmarked = isBookmarked(recipeId);
            updateButtonState(button, isBookmarked);
        }
    });
}