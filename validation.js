//This is where all the functions related to validating inputs live.

const date = require('date-and-time');
const {checkExistingToWatch, checkExistingSeen} = require("./syllabus");

/**
 * Checks to see if the title+year combo from command input is already on the "to-watch" list
 * @param movieString
 * @return {Promise<boolean>}
 */
async function alreadyOnToWatch(movieString) {
    let toWatch = await checkExistingToWatch();
    return !!toWatch.find(spook =>
        spook === movieString);
}

/**
 * Checks to see if the title+year combo from command input is already on the "watched" list
 * @param movieString
 * @return {Promise<boolean>}
 */
async function alreadyOnSeen(movieString) {
    let haveWatched = await checkExistingSeen();
    return !!haveWatched.find(spook =>
        spook === movieString);
}

/**
 * Checks to see if the value entered for movie release year is a valid year
 * @param movieYearString
 * @return {Promise<boolean>}
 */
async function checkMovieYearValid(movieYearString) {
    return date.isValid(movieYearString, 'YYYY');
}

/**
 * Takes date string input by user for dateWatched and checks to see if the 'year' value is YY or YYYY; if YY, adds leading '20'
 * @param dateWatchedString
 * @return updated dateWatchedString
 */
async function formatDateWatchedYear(dateWatchedString) {

    let dateArray = await dateWatchedString.split("/");
    let shortYear = dateArray[2]

    if(shortYear.length === 2) {
        let longYear = 20 + shortYear;
        dateWatchedString = `${dateArray[0]}/${dateArray[1]}/${longYear}`;
    }
    return dateWatchedString;
}

/**
 * Checks a date string to see if it's valid per M/D/YYYY format
 * @param dateWatchedString
 * @return {Promise<boolean>}
 */
async function validateDateWatched(dateWatchedString) {
    let checkValid = await date.preparse(dateWatchedString, 'M/D/YYYY');
    return date.isValid(checkValid);
}


async function getValidDateObject(unformattedDateString) {
    //if year is YY, add '20'  to make it YYYY
    let dateWatchedString = await formatDateWatchedYear(unformattedDateString);
    //check to see if the formatted dateWatched string is valid
    let isValid = await validateDateWatched(dateWatchedString);
    if (isValid) {
        //turn valid formatted string into a date object
        return date.parse(dateWatchedString, 'M/D/YYYY');
    } else {
        return null;
    }
}


module.exports = {
    alreadyOnToWatch,
    alreadyOnSeen,
    checkMovieYearValid,
    formatDateWatchedYear,
    validateDateWatched,
    getValidDateObject
}