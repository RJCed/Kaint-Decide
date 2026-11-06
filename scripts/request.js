const randomRecipeURL = "https://www.themealdb.com/api/json/v1/1/random.php";
const categoriesURL = "https://www.themealdb.com/api/json/v1/1/categories.php";
const searchURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";


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
