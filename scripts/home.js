
// JS file for the Homepage

const recipeImg = document.querySelectorAll(".recipe-img");
const recipeName = document.querySelectorAll(".recipe-name");

const randomRecipeURL = "https://www.themealdb.com/api/json/v1/1/random.php";

// Get random recipe data from TheMealDB
async function getRandomRecipe() {
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

// Change Display and Recipe name in home page
async function displayRandomRecipes() {
    for (let i = 0; i < recipeImg.length; i++) {
        const recipe = await getRandomRecipe();

        if (!recipe) continue;

        recipeImg[i].src = recipe.strMealThumb;
        recipeImg[i].alt = recipe.strMeal;

        recipeName[i].textContent = recipe.strMeal;
    }
}

displayRandomRecipes();

