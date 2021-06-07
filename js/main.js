import { loadWeatherWidget } from "./smhi-widget.js";
import { addDays, setHour } from "./date-helpers.js";

const navToggleButton = document.querySelector("#js-toggle-nav");
const nav = document.querySelector("#js-nav");

navToggleButton.addEventListener("click", () => {
    nav.classList.toggle("show");
});

const today = new Date();
const tomorrow = addDays(today, 1);
loadWeatherWidget(
    18.1489, // longitude
    57.3081, // latitude
    [        // times to show data for
        setHour(today, 6),
        setHour(today, 12),
        setHour(today, 18),
        setHour(tomorrow, 6),
        setHour(tomorrow, 12),
        setHour(tomorrow, 18),
    ]
);
