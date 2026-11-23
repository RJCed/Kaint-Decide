// This JS file handle global Javascript function (have the same function in all pages)

const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebar-btn");

// toggle the sidebar open/closed when the button is clicked
sidebarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("open");
});

// close sidebar when clicking outside of it
document.addEventListener("click", (e) => {
    if (sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        e.target !== sidebarBtn) {
        sidebar.classList.remove("open");
    }
});


/* ---------------- RECIPE CARD NAVIGATION ---------------- */
// Clicking a recipe card opens its recipe page (recipe.html?id=<idMeal>).
// Clicks on the bookmark button are ignored here so bookmarking still works.

function openRecipePage(recipeBox) {
    const id = recipeBox.dataset.recipeId;
    if (!id || id === "RECIPE_ID") return;
    window.location.href = `recipe.html?id=${encodeURIComponent(id)}`;
}

document.addEventListener("click", (e) => {
    if (e.target.closest(".bookmark-btn")) return; // let the bookmark handler toggle
    const box = e.target.closest(".recipe-box");
    if (box) openRecipePage(box);
});

// Keyboard support: Enter / Space on a focused card opens the recipe page
document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.target.closest(".bookmark-btn")) return;
    const box = e.target.closest(".recipe-box");
    if (box) {
        e.preventDefault();
        openRecipePage(box);
    }
});

// Make existing (static) cards keyboard-focusable.
// Dynamically rendered cards get these attributes in recipeCard.js.
document.querySelectorAll(".recipe-box").forEach(box => {
    box.setAttribute("tabindex", "0");
    box.setAttribute("role", "link");
});



