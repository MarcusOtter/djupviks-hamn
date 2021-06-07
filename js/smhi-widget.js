import { getPrettyName, isoString } from "./date-helpers.js";

const ICON_PATH = "resources/img/icons/";
const WIDGET = document.querySelector("#smhi-widget");

async function fetchData(url) {
    const promise = await fetch(url);
    const data = await promise.json();
    return data;
}

export async function loadWeatherWidget(longitude, latitude, desiredForecastDateTimes) {
    if (!WIDGET) { return; }

    const allData = await fetchData(`https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`);
    const validTimes = await fetchData("https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/validtime.json");
    if (!allData || !validTimes) { return; }

    desiredForecastDateTimes = desiredForecastDateTimes.filter(t => validTimes.validTime.includes(isoString(t)));
    if (!desiredForecastDateTimes || desiredForecastDateTimes.length === 0) { return; }
    
    const container = document.createElement("div");
    for(const forecastDateTime of desiredForecastDateTimes) {
        const forecastData = getForecastDataForDateTime(allData, forecastDateTime);
        if (!forecastData) { continue; }

        const title = getPrettyName(forecastDateTime);
        const temperature   = getForecastParameterValues(forecastData, "t")[0];
        const cloudLevel    = getForecastParameterValues(forecastData, "tcc_mean")[0];
        const windSpeed     = getForecastParameterValues(forecastData, "ws")[0];
        const windDirection = getForecastParameterValues(forecastData, "wd")[0];

        const forecastBox = createForecastBox(title, temperature, cloudLevel, windSpeed, windDirection);
        container.append(forecastBox);
    }

    if (container.children.length === 0) { return; }
    const heading = createElementWithAttributes("h2", { innerText: "Väderprognos" })
    WIDGET.append(heading, container);
}

function createForecastBox(title, temperature, cloudLevel, windSpeed, windDirection) {
    const heading = createElementWithAttributes("h3", { innerText: title });

    const temperatureListItem = createForecastListItem(`${temperature} °C`, getTemperatureImageSource(temperature), "Temperatur:");
    const cloudListItem = createForecastListItem(getCloudTitle(cloudLevel), getCloudImageSource(cloudLevel), "Molnighet:");
    const windListItem = createForecastListItem(getWindTitle(windSpeed, windDirection), ICON_PATH + "vind.svg", "Vindhastighet:", windDirection);

    const ul = createElementWithChildren("ul", [temperatureListItem, cloudListItem, windListItem]);
    return createElementWithChildren("article", [heading, ul]);
}

function createForecastListItem(paragraphText, imageSource, imageAlt, imageRotation) {
    const temperatureParagraph = createElementWithAttributes("p", { innerText: paragraphText });
    const temperatureImage = createElementWithAttributes("img", {
        src: imageSource,
        alt: imageAlt,
        width: 22,
        height: 22
    });

    if (imageRotation) {
        // https://en.wikipedia.org/wiki/Wind_direction
        temperatureImage.style.transform = `rotate(${90 + imageRotation}deg)`;
    }

    return createElementWithChildren("li", [temperatureImage, temperatureParagraph]);
}

function getWindTitle(windSpeed, windDirection) {
    return `${windSpeed} m/s ${getWindCompassDirection(windDirection)}`;
}

function getWindCompassDirection(windDirection) {
    if ((windDirection >= 0 && windDirection <= 22.5) || 
        (windDirection <= 360 && windDirection > 337.5)) { return "N"; }

    if (windDirection <= 67.5)  { return "NO"; }
    if (windDirection <= 112.5) { return "O"; }
    if (windDirection <= 157.5) { return "SO"; }
    if (windDirection <= 202.5) { return "S"; }
    if (windDirection <= 247.5) { return "SV"; }
    if (windDirection <= 292.5) { return "V"; }
    if (windDirection <= 337.5) { return "NV"; }
}

// http://www.smhi.se/kunskapsbanken/molnighet-och-molnmangd-1.1514
function getCloudTitle(cloudLevel) {
    if (cloudLevel === 0)  { return "Molnfritt"; }
    if (cloudLevel <= 4)   { return "Lite moln"; }
    if (cloudLevel <= 7)   { return "Mycket moln"; }
    if (cloudLevel === 8)  { return "Mulet"; }
}

function getCloudImageSource(cloudLevel) {
    if (cloudLevel === 0)  { return ICON_PATH + "sol.svg"; }
    if (cloudLevel <= 4)   { return ICON_PATH + "lite-moln.svg"; }
    if (cloudLevel <= 8)   { return ICON_PATH + "moln.svg"; }
}

function getTemperatureImageSource(temperature) {
    if (temperature <= 0)  { return ICON_PATH + "kallt.svg"; }
    if (temperature <= 10) { return ICON_PATH + "svalt.svg"; }
    if (temperature <= 20) { return ICON_PATH + "ljummet.svg"; }
    if (temperature <= 30) { return ICON_PATH + "varmt.svg"; }
    if (temperature  > 30) { return ICON_PATH + "hett.svg"; }
}

function getForecastDataForDateTime(data, validDateTime) {
    for (const timeSeries of data.timeSeries) {
        if (timeSeries.validTime === isoString(validDateTime)) { return timeSeries; }
    }
}

function getForecastParameterValues(forecastData, parameterName) {
    for (const parameter of forecastData.parameters) {
        if (parameter.name === parameterName) { return parameter.values; }
    }
}

function createElementWithChildren(elementTag, children) {
    const element = document.createElement(elementTag);
    if (children && children.length > 0) {
        element.append(...children);
    }

    return element;
}

function createElementWithAttributes(elementTag, attributes) {
    const element = document.createElement(elementTag);
    if (!attributes) { return element; }

    return Object.assign(element, attributes);
}
