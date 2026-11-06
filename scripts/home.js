// JS file for the Homepage

import { getRandomRecipe, getCategories } from "./request.js";
import { initSearch } from "./search.js";

const recipeImg = document.querySelectorAll(".recipe-img");
const recipeName = document.querySelectorAll(".recipe-name");
const categoryImg = document.querySelectorAll(".catImg");

// Initialize search
initSearch();

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

async function displayCategories() {
    const categories = await getCategories();
    for (let i = 0; i < categoryImg.length; i++) {
        categoryImg[i].src = categories[i].strCategoryThumb;
        categoryImg[i].alt = categories[i].strCategory;
    }
}

displayCategories();
displayRandomRecipes();

