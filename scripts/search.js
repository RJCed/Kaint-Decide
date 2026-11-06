// Global search functionality - handles search form submission across all pages

const SEARCH_RESULTS_URL = "searchResults.html";

/**
 * Initialize search forms on the page
 * Converts .search divs to forms if needed and attaches submit handlers
 */
export function initSearch() {
    const searchForms = document.querySelectorAll(".search");

    searchForms.forEach(form => {
        // If it's not already a form, wrap it
        if (form.tagName !== "FORM") {
            wrapSearchDiv(form);
        } else {
            attachSearchHandler(form);
        }
    });
}

/**
 * Wrap a .search div in a form element
 */
function wrapSearchDiv(searchDiv) {
    const input = searchDiv.querySelector(".search-input");
    if (!input) return;

    // Create form
    const form = document.createElement("form");
    form.className = "search";
    form.action = SEARCH_RESULTS_URL;
    form.method = "get";

    // Move children to form
    while (searchDiv.firstChild) {
        form.appendChild(searchDiv.firstChild);
    }

    // Ensure input has name="q"
    if (!input.name) {
        input.name = "q";
    }

    // Replace div with form
    searchDiv.parentNode.replaceChild(form, searchDiv);

    attachSearchHandler(form);
}

/**
 * Attach submit handler to search form
 */
function attachSearchHandler(form) {
    form.addEventListener("submit", (e) => {
        const input = form.querySelector(".search-input");
        const query = input?.value?.trim();

        if (!query) {
            e.preventDefault();
            input?.focus();
            return;
        }

        // Allow normal form submission to searchResults.html?q=...
    });
}

/**
 * Set search input value (useful for pre-filling on results page)
 */
export function setSearchInputValue(value) {
    const inputs = document.querySelectorAll(".search-input");
    inputs.forEach(input => {
        input.value = value;
    });
}

/**
 * Get current search query from any search input
 */
export function getSearchInputValue() {
    const input = document.querySelector(".search-input");
    return input?.value?.trim() || "";
}