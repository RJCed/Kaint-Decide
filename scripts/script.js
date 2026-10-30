const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebar-btn");

// toggle the sidebar open/closed when the button is clicked
sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});
