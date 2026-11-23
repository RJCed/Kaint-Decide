// JS file for the Categories page
// Renders two grids:
//   #categories-container -> meal categories (filter.php?c=)
//   #areas-container      -> countries/cuisines (filter.php?a=) with a live filter input

import { getCategories, getAreas } from "./request.js";

const categoriesContainer = document.getElementById("categories-container");
const areasContainer = document.getElementById("areas-container");
const areasFilterInput = document.getElementById("areas-filter");

// Map TheMealDB strCountry names to ISO 3166-1 alpha-2 codes,
// used for the flag image (flagcdn) and the emoji fallback.
const COUNTRY_CODES = {
    "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "Andorra": "AD",
    "Angola": "AO", "Antigua and Barbuda": "AG", "Argentina": "AR",
    "Armenia": "AM", "Aruba": "AW", "Australia": "AU", "Austria": "AT",
    "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD",
    "Barbados": "BB", "Belarus": "BY", "Belgium": "BE", "Belize": "BZ",
    "Benin": "BJ", "Bermuda": "BM", "Bhutan": "BT", "Bolivia": "BO",
    "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Brazil": "BR",
    "Brunei": "BN", "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI",
    "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", "Cape Verde": "CV",
    "Cayman Islands": "KY", "Central African Republic": "CF", "Chad": "TD",
    "Chile": "CL", "China": "CN", "Colombia": "CO", "Costa Rica": "CR",
    "Croatia": "HR", "Cuba": "CU", "Cyprus": "CY", "Czechia": "CZ",
    "Denmark": "DK", "Djibouti": "DJ", "Dominica": "DM",
    "Dominican Republic": "DO", "DR Congo": "CD", "Ecuador": "EC",
    "Egypt": "EG", "El Salvador": "SV", "Equatorial Guinea": "GQ",
    "Eritrea": "ER", "Estonia": "EE", "Ethiopia": "ET", "Faroe Islands": "FO",
    "Fiji": "FJ", "Finland": "FI", "France": "FR", "Gabon": "GA",
    "Gambia": "GM", "Georgia": "GE", "Germany": "DE", "Ghana": "GH",
    "Gibraltar": "GI", "Greece": "GR", "Greenland": "GL", "Grenada": "GD",
    "Guadeloupe": "GP", "Guam": "GU", "Guatemala": "GT", "Guernsey": "GG",
    "Guinea": "GN", "Guinea-Bissau": "GW", "Guyana": "GY", "Haiti": "HT",
    "Honduras": "HN", "Hong Kong": "HK", "Hungary": "HU", "Iceland": "IS",
    "India": "IN", "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ",
    "Ireland": "IE", "Israel": "IL", "Italy": "IT", "Ivory Coast": "CI",
    "Jamaica": "JM", "Japan": "JP", "Jersey": "JE", "Jordan": "JO",
    "Kazakhstan": "KZ", "Kenya": "KE", "Kosovo": "XK", "Kuwait": "KW",
    "Kyrgyzstan": "KG", "Laos": "LA", "Latvia": "LV", "Lebanon": "LB",
    "Lesotho": "LS", "Liberia": "LR", "Libya": "LY", "Liechtenstein": "LI",
    "Lithuania": "LT", "Luxembourg": "LU", "Madagascar": "MG", "Malawi": "MW",
    "Malaysia": "MY", "Maldives": "MV", "Mali": "ML", "Malta": "MT",
    "Mauritius": "MU", "Mexico": "MX", "Moldova": "MD", "Mongolia": "MN",
    "Montenegro": "ME", "Morocco": "MA", "Mozambique": "MZ", "Myanmar": "MM",
    "Namibia": "NA", "Nepal": "NP", "Netherlands": "NL", "New Zealand": "NZ",
    "Nicaragua": "NI", "Niger": "NE", "Nigeria": "NG", "North Korea": "KP",
    "North Macedonia": "MK", "Norway": "NO", "Oman": "OM", "Pakistan": "PK",
    "Palestine": "PS", "Panama": "PA", "Papua New Guinea": "PG",
    "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Poland": "PL",
    "Portugal": "PT", "Puerto Rico": "PR", "Qatar": "QA",
    "Republic of the Congo": "CG", "Romania": "RO", "Russia": "RU",
    "Rwanda": "RW", "Saint Lucia": "LC", "Samoa": "WS", "San Marino": "SM",
    "Saudi Arabia": "SA", "Senegal": "SN", "Serbia": "RS",
    "Seychelles": "SC", "Sierra Leone": "SL", "Singapore": "SG",
    "Slovakia": "SK", "Slovenia": "SI", "Solomon Islands": "SB", "Somalia": "SO",
    "South Africa": "ZA", "South Korea": "KR", "South Sudan": "SS",
    "Spain": "ES", "Sri Lanka": "LK", "Sudan": "SD", "Suriname": "SR",
    "Sweden": "SE", "Switzerland": "CH", "Syria": "SY", "Taiwan": "TW",
    "Tajikistan": "TJ", "Tanzania": "TZ", "Thailand": "TH", "Togo": "TG",
    "Tonga": "TO", "Trinidad and Tobago": "TT", "Tunisia": "TN",
    "Turkey": "TR", "Turkmenistan": "TM", "Tuvalu": "TV", "Uganda": "UG",
    "Ukraine": "UA", "United Arab Emirates": "AE", "United Kingdom": "GB",
    "United States": "US", "Uruguay": "UY", "Uzbekistan": "UZ",
    "Vanuatu": "VU", "Venezuela": "VE", "Vietnam": "VN", "Yemen": "YE",
    "Zambia": "ZM", "Zimbabwe": "ZW",
};

// Fallback emoji when no ISO code is known
const DEFAULT_FLAG_EMOJI = "🌍";

/**
 * Convert an ISO alpha-2 code ("AR") into a flag emoji ("🇦🇷")
 * @param {string} code - Two-letter country code
 * @returns {string} Flag emoji
 */
function flagEmoji(code) {
    if (!code || code.length !== 2) return DEFAULT_FLAG_EMOJI;
    return String.fromCodePoint(
        ...[...code.toUpperCase()].map(c => 0x1f1e6 + c.charCodeAt(0) - 65)
    );
}

// Show loading state in a grid container
function showLoading(container, message) {
    container.innerHTML = `
        <div class="loading">
            <p>${message}</p>
        </div>
    `;
}

// Show error state in a grid container
function showError(container, message) {
    container.innerHTML = `
        <div class="error">
            <p>${message}</p>
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
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" loading="lazy">
        </span>
        <span class="category-card-name">${category.strCategory}</span>
    `;

    return card;
}

/**
 * Create a single country card (links to the country's recipes on the
 * search results page via ?a=<strCountry>). Shows the country flag in the
 * same card style as categories, falling back to a flag emoji if the
 * flag image cannot be loaded.
 * @param {Object} area - Area object from TheMealDB (strArea, strCountry)
 * @returns {HTMLElement} Anchor element with the country card
 */
function createAreaCard(area) {
    const country = area.strCountry || area.strArea;
    const code = COUNTRY_CODES[country];

    const card = document.createElement("a");
    card.className = "category-card area-card";
    card.href = `searchResults.html?a=${encodeURIComponent(country)}`;
    card.dataset.country = country;
    card.dataset.area = area.strArea || "";
    card.setAttribute("aria-label", `View ${country} recipes`);

    card.innerHTML = `
        <span class="category-card-img area-card-img"></span>
        <span class="category-card-name">${country}</span>
    `;

    const imgHolder = card.querySelector(".area-card-img");

    if (code) {
        const flagImg = document.createElement("img");
        flagImg.className = "area-flag";
        flagImg.src = `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
        flagImg.alt = "";
        flagImg.loading = "lazy";
        // If the flag image fails to load (offline, blocked CDN),
        // fall back to the flag emoji so the card still shows something.
        flagImg.addEventListener("error", () => {
            const emoji = document.createElement("span");
            emoji.className = "area-flag-emoji";
            emoji.textContent = flagEmoji(code);
            flagImg.replaceWith(emoji);
        });
        imgHolder.appendChild(flagImg);
    } else {
        const emoji = document.createElement("span");
        emoji.className = "area-flag-emoji";
        emoji.textContent = DEFAULT_FLAG_EMOJI;
        imgHolder.appendChild(emoji);
    }

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

/**
 * Render ALL countries into the grid
 * @param {Array} areas - Array of area objects ({ strArea, strCountry })
 */
function displayAreas(areas) {
    areasContainer.innerHTML = "";

    areas.forEach(area => {
        areasContainer.appendChild(createAreaCard(area));
    });
}

/**
 * Live-filter the country cards by country/area name as the user types
 */
function initAreasFilter() {
    if (!areasFilterInput) return;

    areasFilterInput.addEventListener("input", () => {
        const query = areasFilterInput.value.trim().toLowerCase();
        const cards = areasContainer.querySelectorAll(".area-card");
        let visibleCount = 0;

        cards.forEach(card => {
            const haystack = `${card.dataset.country} ${card.dataset.area}`.toLowerCase();
            const matches = query === "" || haystack.includes(query);
            card.classList.toggle("hidden", !matches);
            if (matches) visibleCount++;
        });

        // Show a "no matches" message when the filter hides everything
        let noMatch = areasContainer.querySelector(".no-countries");
        if (visibleCount === 0 && query !== "") {
            if (!noMatch) {
                noMatch = document.createElement("div");
                noMatch.className = "no-countries";
                areasContainer.appendChild(noMatch);
            }
            noMatch.innerHTML = `<p>No countries match "${areasFilterInput.value.trim()}".</p>`;
        } else if (noMatch) {
            noMatch.remove();
        }
    });
}

// Load all categories on page load
async function initCategoriesPage() {
    showLoading(categoriesContainer, "Loading categories...");
    const categories = await getCategories();

    if (categories === null) {
        showError(categoriesContainer, "Failed to load categories. Please try again.");
    } else {
        displayCategories(categories);
    }
}

// Load all countries/cuisines on page load
async function initAreasSection() {
    if (!areasContainer) return;

    showLoading(areasContainer, "Loading countries...");
    const areas = await getAreas();

    if (areas === null) {
        showError(areasContainer, "Failed to load countries. Please try again.");
    } else {
        displayAreas(areas);
    }
}

initCategoriesPage();
initAreasSection();
initAreasFilter();
