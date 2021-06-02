const navToggleButton = document.querySelector("#js-toggle-nav");
const nav = document.querySelector("#js-nav");

navToggleButton.addEventListener("click", () => {
    nav.classList.toggle("show");
});
