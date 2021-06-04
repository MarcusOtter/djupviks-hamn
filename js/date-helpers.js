export function addDays(date, days) {
    const output = new Date(date);
    output.setDate(output.getDate() + days);
    return output;
}

export function setHour(date, hour) {
    const output = new Date(date);
    output.setHours(hour); 
    output.setMinutes(0);
    output.setSeconds(0);
    output.setMilliseconds(0);
    return output;
}

export function getPrettyName(date) {
    return `${date.getDate()} ${getSweMonthName(date)} ${date.toLocaleTimeString().substring(0, 5)}`;
}

export function isoString(date) {
    return date.toISOString().replace(".000Z", "Z");
}

function getSweMonthName(date) {
    switch(date.getMonth()) {
        case 0: return "Jan";
        case 1: return "Feb";
        case 2: return "Mar";
        case 3: return "Apr";
        case 4: return "Maj";
        case 5: return "Jun";
        case 6: return "Jul";
        case 7: return "Aug";
        case 8: return "Sep";
        case 9: return "Okt";
        case 10: return "Nov";
        case 11: return "Dec";
    }
}
