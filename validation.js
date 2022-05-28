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

module.exports = {
    alreadyOnToWatch,
    alreadyOnSeen,
    checkMovieYearValid
}