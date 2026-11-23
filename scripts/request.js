const randomRecipeURL = "https://www.themealdb.com/api/json/v1/1/random.php";
const lookupByIdURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const categoriesURL = "https://www.themealdb.com/api/json/v1/1/categories.php";
const searchURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const filterByCategoryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
const areasListURL = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
const filterByAreaURL = "https://www.themealdb.com/api/json/v1/1/filter.php?a=";


// Get random recipe data from TheMealDB
export async function getRandomRecipe() {
    // Maximum amount it retry if fetch fails
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(randomRecipeURL);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.meals || data.meals.length === 0) {
                throw new Error("No recipe data received.");
            }

            return data.meals[0];

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt < maxAttempts) {
                console.log("Retrying...");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    console.error("Failed to retrieve recipe after max attempts.");
    return null;
}

// Get a full recipe by its ID (idMeal) - includes instructions, ingredients, measures
export async function getRecipeById(id) {
    // Maximum amount it retry if fetch fails
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(`${lookupByIdURL}${encodeURIComponent(id)}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            // lookup returns {"meals": null} when the id does not exist
            if (!data.meals || data.meals.length === 0) {
                return null;
            }

            return data.meals[0];

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt < maxAttempts) {
                console.log("Retrying...");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    console.error("Failed to retrieve recipe after max attempts.");
    return null;
}

// Get Categories
export async function getCategories() {
    // Maximum amount it retry if fetch fails
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(categoriesURL);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.categories || data.categories.length === 0) {
                throw new Error("No recipe data received.");
            }

            // console.log(data.categories);
            return data.categories;

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt < maxAttempts) {
                console.log("Retrying...");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    console.error("Failed to retrieve category list after max attempts.");
    return null;
}

// Get recipes that belong to a category (e.g. "Beef", "Dessert")
export async function getRecipesByCategory(category) {
    // Maximum amount it retry if fetch fails
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(`${filterByCategoryURL}${encodeURIComponent(category)}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.meals || data.meals.length === 0) {
                return [];
            }

            return data.meals;

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt < maxAttempts) {
                console.log("Retrying...");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    console.error("Failed to retrieve recipes by category after max attempts.");
    return null;
}

// Get all cuisines/countries (areas).
// Each entry is { strArea: "Turkish", strCountry: "Turkey" } — the strArea
// adjective pairs with the strCountry name (e.g. "Argentine" · "Argentina").
export async function getAreas() {
    // Maximum amount it retry if fetch fails
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(areasListURL);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.meals || data.meals.length === 0) {
                throw new Error("No area data received.");
            }

            return data.meals;

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt < maxAttempts) {
                console.log("Retrying...");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    console.error("Failed to retrieve area list after max attempts.");
    return null;
}

// Get recipes that come from a country/cuisine.
// The filter endpoint expects the country name (strCountry, e.g. "Turkey",
// "Argentina", "United States") — not the strArea adjective.
export async function getRecipesByArea(country) {
    // Maximum amount it retry if fetch fails
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(`${filterByAreaURL}${encodeURIComponent(country)}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.meals || data.meals.length === 0) {
                return [];
            }

            return data.meals;

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt < maxAttempts) {
                console.log("Retrying...");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    console.error("Failed to retrieve recipes by area after max attempts.");
    return null;
}

// Search recipes by name
export async function searchRecipes(query) {
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(`${searchURL}${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.meals || data.meals.length === 0) {
                return [];
            }

            return data.meals;

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt < maxAttempts) {
                console.log("Retrying...");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    console.error("Failed to retrieve search results after max attempts.");
    return null;
}
