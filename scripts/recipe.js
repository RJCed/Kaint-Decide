// JS file for the Recipe detail page (recipe.html?id=<idMeal>)
// Fetches the full recipe from TheMealDB lookup endpoint and renders:
// meal name, category (link to category results), area/country, meal image,
// ingredients + measurements, instructions and an embedded YouTube tutorial.

import { getRecipeById } from "./request.js";
import { isBookmarked, toggleBookmark, updateButtonState } from "./bookmarks.js";

const content = document.getElementById("recipe-content");

/* ------------------ STATES ------------------ */

function showLoading(message = "Loading recipe...") {
    content.innerHTML = `
        <div class="loading">
            <p>${message}</p>
        </div>
    `;
}

function showError(html) {
    content.innerHTML = `
        <div class="error">
            <p>${html}</p>
        </div>
    `;
}

/* ------------------ HELPERS ------------------ */

// Escape API strings before injecting them into innerHTML
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[ch]));
}

// Extract the 11-char video id from a YouTube watch / share / embed URL
function getYouTubeId(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.split("/")[1] || null;
        }
        return parsed.searchParams.get("v");
    } catch {
        const match = String(url).match(
            /(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
        );
        return match ? match[1] : null;
    }
}

// Collect strIngredient1..20 / strMeasure1..20 into a clean list
function getIngredients(meal) {
    const items = [];
    for (let i = 1; i <= 20; i++) {
        const name = String(meal[`strIngredient${i}`] || "").trim();
        if (!name) continue;
        const measure = String(meal[`strMeasure${i}`] || "").trim();
        items.push({ name, measure });
    }
    return items;
}

// API instructions use \r\n line breaks: blank line = new paragraph,
// single line break = <br> inside the same paragraph
function renderInstructions(text) {
    return escapeHtml(text)
        .split(/\r?\n\r?\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => `<p>${paragraph.replace(/\r?\n/g, "<br>")}</p>`)
        .join("");
}

/* ------------------ RENDER ------------------ */

function renderRecipe(meal) {
    const categoryLink = meal.strCategory
        ? `searchResults.html?c=${encodeURIComponent(meal.strCategory)}`
        : null;

    // The area filter expects the country name (strCountry, e.g. "Turkey"),
    // falling back to the strArea adjective (e.g. "Turkish") if missing.
    const areaLink = (meal.strCountry || meal.strArea)
        ? `searchResults.html?a=${encodeURIComponent(meal.strCountry || meal.strArea)}`
        : null;

    const areaText = [meal.strArea, meal.strCountry]
        .filter((part) => part && String(part).trim())
        .join(" · ");

    const ingredients = getIngredients(meal);
    const ingredientsHtml = ingredients.length > 0
        ? `<ul class="ingredients-list">
            ${ingredients.map((ing) => `
                <li>
                    <span class="ingredient-name">${escapeHtml(ing.name)}</span>
                    <span class="ingredient-measure">${escapeHtml(ing.measure)}</span>
                </li>
            `).join("")}
        </ul>`
        : `<p class="ingredients-empty">No ingredients listed for this recipe.</p>`;

    const videoId = getYouTubeId(meal.strYoutube);
    const videoHtml = videoId
        ? `
        <section class="recipe-panel recipe-detail__video">
            <h2 class="panel-title">Video Tutorial</h2>
            <div class="video-wrapper">
                <iframe
                    src="https://www.youtube.com/embed/${videoId}"
                    title="${escapeHtml(meal.strMeal)} - video tutorial"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    loading="lazy"
                ></iframe>
            </div>
            <a class="video-link" href="${escapeHtml(meal.strYoutube)}" target="_blank" rel="noopener noreferrer">
                Watch on YouTube &rarr;
            </a>
        </section>
    `
        : "";

    content.innerHTML = `
        <article class="recipe-detail" data-recipe-id="${escapeHtml(meal.idMeal)}">
            <div class="recipe-image recipe-detail__image">
                <img class="recipe-img loaded"
                    src="${escapeHtml(meal.strMealThumb)}"
                    alt="${escapeHtml(meal.strMeal)}">
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

            <div class="recipe-detail__meta">
                <h1 class="recipe-detail__title">${escapeHtml(meal.strMeal)}</h1>
                <div class="recipe-detail__tags">
                    ${categoryLink
                        ? `<a class="recipe-detail__category" href="${categoryLink}">${escapeHtml(meal.strCategory)}</a>`
                        : ""}
                    ${areaLink
                        ? `<a class="recipe-detail__area" href="${areaLink}">${escapeHtml(areaText)}</a>`
                        : ""}
                </div>
            </div>

            <section class="recipe-panel recipe-detail__ingredients">
                <h2 class="panel-title">Ingredients</h2>
                ${ingredientsHtml}
            </section>

            <section class="recipe-panel recipe-detail__instructions">
                <h2 class="panel-title">Instructions</h2>
                <div class="instructions-text">${renderInstructions(meal.strInstructions)}</div>
            </section>

            ${videoHtml}
        </article>
    `;

    document.title = `${meal.strMeal} - Kain't Decide?`;

    // Bookmark button - same behavior as on the recipe cards
    const bookmarkBtn = content.querySelector(".bookmark-btn");
    updateButtonState(bookmarkBtn, isBookmarked(meal.idMeal));
    bookmarkBtn.addEventListener("click", () => toggleBookmark(meal, bookmarkBtn));
}

/* ------------------ INIT ------------------ */

async function initRecipePage() {
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
        showError(`No recipe specified. <a href="index.html">Back to home</a>`);
        return;
    }

    showLoading();

    const meal = await getRecipeById(id);

    if (!meal) {
        showError(`Recipe not found. <a href="index.html">Back to home</a>`);
        return;
    }

    renderRecipe(meal);
}

initRecipePage();
