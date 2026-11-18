/**
 * Bookmarks Page Module
 * Handles rendering and managing bookmarked recipes on the bookmarks page
 */

import { getBookmarks } from "./bookmarks.js";
import { renderRecipeCards } from "./recipeCard.js";

// Get the bookmarks container
const container = document.getElementById("bookmarks-container");

/**
 * Render all bookmarked recipes
 */
function renderBookmarks() {
    const bookmarks = getBookmarks();

    if (!bookmarks || bookmarks.length === 0) {
        container.innerHTML = `
            <div class="no-results empty-bookmarks">
                <p>No bookmarked recipes yet.</p>
                <p class="empty-hint">Start exploring and bookmark your favorites!</p>
            </div>
        `;
        return;
    }

    // Render using shared recipe card function
    renderRecipeCards(container, bookmarks);
}

/**
 * Listen for storage changes (in case bookmarks updated from another tab)
 */
window.addEventListener("storage", (event) => {
    if (event.key === "kaint-decide-bookmarks") {
        renderBookmarks();
    }
});

/**
 * Listen for local bookmarks changes (same tab)
 */
window.addEventListener("bookmarks-changed", renderBookmarks);

// Initial render
document.addEventListener("DOMContentLoaded", renderBookmarks);