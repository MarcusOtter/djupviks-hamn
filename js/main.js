import { loadWeatherWidget } from "./smhi-widget.js";
import { addDays, setHour } from "./date-helpers.js";

const navToggleButton = document.querySelector("#js-toggle-nav");
const nav = document.querySelector("#js-nav");

navToggleButton.addEventListener("click", () => {
    nav.classList.toggle("show");
});

const now = new Date();
const tomorrow = addDays(now, 1);

loadWeatherWidget(now, 18.1489, 57.3081, [
    setHour(now, 6),
    setHour(now, 12),
    setHour(now, 18),
    setHour(tomorrow, 6),
    setHour(tomorrow, 12),
    setHour(tomorrow, 18),
]);
