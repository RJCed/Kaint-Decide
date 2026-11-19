// JS file for the Homepage

import { getRandomRecipe, getCategories } from "./request.js";
import { initBookmarkButtonStates } from "./bookmarkUI.js";
import { getBookmarks } from "./bookmarks.js";

const recipeImg = document.querySelectorAll(".recipe-img");
const recipeName = document.querySelectorAll(".recipe-name");
const categoryImg = document.querySelectorAll(".catImg");
const recipeBoxes = document.querySelectorAll(".recipe-box");

// Number of recipe cards shown in the gallery (matches the static HTML slots)
const GALLERY_SIZE = recipeBoxes.length;

/**
 * Fill a single gallery card slot with a recipe's data
 * @param {number} index - Slot index (0-based)
 * @param {Object} recipe - Recipe object (idMeal, strMeal, strMealThumb, ...)
 */
function fillCard(index, recipe) {
    if (!recipe || index >= recipeBoxes.length) return;

    const img = recipeImg[index];
    const name = recipeName[index];
    const box = recipeBoxes[index];

    // Reset loaded state, set placeholder first, then load actual image
    img.classList.remove("loaded");
    img.src = "./images/placeholder.jpg";
    img.alt = recipe.strMeal;
    img.dataset.src = recipe.strMealThumb;

    // Use onload (not addEventListener) so re-renders don't stack handlers
    img.onload = () => {
        img.classList.add("loaded");
    };
    img.src = recipe.strMealThumb;

    name.textContent = recipe.strMeal;

    // Update recipe box data attributes for bookmark functionality
    box.dataset.recipeId = recipe.idMeal;
    box.dataset.category = recipe.strCategory || "";
    box.dataset.area = recipe.strArea || "";
}

/**
 * Display gallery recipes:
 *  - Random recipes first
 *  - Bookmarked recipes fill the remaining slots (up to GALLERY_SIZE total)
 *  - If 4+ bookmarks, only the first 4 are shown (no room for random)
 *  - Random recipes skip any already shown (no duplicates)
 */
async function displayGalleryRecipes() {
    const bookmarks = getBookmarks();
    const shownIds = new Set();

    // How many bookmarked recipes will be shown (capped at GALLERY_SIZE)
    const bookmarkedToShow = bookmarks.slice(0, GALLERY_SIZE);
    // Remaining slots go to random recipes, placed FIRST
    const randomCount = GALLERY_SIZE - bookmarkedToShow.length;

    // 1. Fill the first slots with random recipes (avoiding duplicates)
    for (let i = 0; i < randomCount; i++) {
        let recipe = null;
        let attempts = 0;

        // Try a few times to get a random recipe not already shown
        while (attempts < 10 && !recipe) {
            const candidate = await getRandomRecipe();
            if (candidate && !shownIds.has(candidate.idMeal)) {
                recipe = candidate;
                shownIds.add(candidate.idMeal);
            }
            attempts++;
        }

        if (recipe) {
            fillCard(i, recipe);
        }
    }

    // 2. Fill the remaining slots with bookmarked recipes
    for (let i = 0; i < bookmarkedToShow.length; i++) {
        fillCard(randomCount + i, bookmarkedToShow[i]);
        shownIds.add(bookmarkedToShow[i].idMeal);
    }

    // Initialize bookmark button states after recipes are loaded
    initBookmarkButtonStates();
}

async function displayCategories() {
    const categories = await getCategories();
    for (let i = 0; i < categoryImg.length; i++) {
        categoryImg[i].src = categories[i].strCategoryThumb;
        categoryImg[i].alt = categories[i].strCategory;
    }
}

// Note: the gallery is intentionally NOT re-rendered on "bookmarks-changed".
// Bookmarking/unbookmarking only toggles the button state — the gallery
// composition (random first, then bookmarks) is set once on page load and
// will reflect new bookmarks on the next visit.

displayCategories();
displayGalleryRecipes();
