document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  // Check if themeToggle exists before adding event listeners
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      if (htmlElement.classList.contains("dark")) {
        htmlElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        htmlElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    });

    // Load theme from localStorage on page load
    if (localStorage.getItem("theme") === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  } else {
    console.error("Theme toggle button not found");
  }
});
