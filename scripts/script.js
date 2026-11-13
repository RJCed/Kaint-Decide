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



