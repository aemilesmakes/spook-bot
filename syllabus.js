//This is where all the functions related to querying and parsing the syllabus live.

const { client } = require('./connect.js');
const date = require('date-and-time');

/**
 * Query the DB for the whole list of movies in the DB, watched & unwatched (all spooks).
 * List is automatically sorted by release year.
 *
 * @return results (array, ALL spooks)
 */
async function getAllSpooks() {
    await client.connect();

    const cursor = client.db("spooky_film_club").collection("syllabus").find(
        {
        }).sort({ year: 1 });

    const results = await cursor.toArray();

    if (results.length > 0) {
        return results;
    } else {
        console.log(`No spooks found. :(`);
    }
    await client.close();
}

/**
 * Query the DB for ONLY movies that we've watched, and sort those movies by date watched.
 * Returns an object array.
 *
 * @return results (array, seen spooks only)
 */
async function getSeenSpooks() {
    await client.connect();

    const cursor = client.db("spooky_film_club").collection("syllabus").find(
        {
            seen: true
        }).sort({ date_assigned: 1 });

    const results = await cursor.toArray();

    if (results.length > 0) {
        return results;
    } else {
        console.log(`No spooks found... Boo........`);
    }
    await client.close();
}

/**
 * Gets the to-watch list as an object array, for querying with getSingleSpook.
 *
 * @return toWatch object array
 */
async function getToWatch() {
    let syllabus = await getAllSpooks();
    const toWatch = [];

    for (let i = 0; i < syllabus.length; i++) {
        if(syllabus[i].seen === false) {
            toWatch.push(syllabus[i]);
        }
    }
    return toWatch;
}

/**
 * Take the getToWatch array -> convert it into an array of JUST the movie title + movie year.
 * This is for checking against when a new spook is added using the addSpook command.
 *
 * @return array (movie title + year, unwatched spooks ONLY)
 */
async function checkExistingToWatch() {
    let syllabus = await getToWatch();
    const arrayToWatch = [];

    for (let i = 0; i < syllabus.length; i++) {
        arrayToWatch.push(`${syllabus[i].title} (${syllabus[i].year})`);
    }

    return arrayToWatch;
}

/**
 * Take the getSeenSpooks array -> convert it into an array of JUST the movie title + movie year.
 * This is for checking against when a new spook is added using the addSpook command.
 * @return array (movie title + year, watched spooks ONLY)
 */
async function checkExistingSeen() {
    let syllabus = await getSeenSpooks();
    const arraySeen = [];

    for (let i = 0; i < syllabus.length; i++) {
        arraySeen.push(`${syllabus[i].title} (${syllabus[i].year})`);
    }

    return arraySeen;
}

/**
 * Takes the date_assigned value from the DB and converts it into a formatted date string.
 * @param dateWatched
 * @return {Promise<string>}
 */

async function formatDateWatched(dateWatched) {
    let oldDate = new Date(dateWatched);
    return date.format(oldDate, 'MMM D, YYYY');
}

async function formattedSeenSpooks() {
    let seenSpooks = await getSeenSpooks();

    for (let i = 0; i < seenSpooks.length; i++) {
        let dateWatched = seenSpooks[i].date_assigned;
        seenSpooks[i].date_assigned = await formatDateWatched(dateWatched);
    }

    return seenSpooks;
}

/**
 * Converts the to-watch object array into a string, so SpookBot can print it in Discord.
 *
 * @return object array of spooks-to-watch
 */

async function stringToWatch() {
    let syllabus = await getAllSpooks();
    let stringSyllabus = "";

    for (let i = 0; i < syllabus.length; i++) {
        if(syllabus[i].seen === false) {
            stringSyllabus += `${syllabus[i].title} (${syllabus[i].year})\n`
        }
    }
    return stringSyllabus;
}

/**
 * Get the ID of a specific spook, if given the title and year.
 * @param title
 * @param year
 * @return {Promise<*>}
 */
async function getSpookID(title, year) {
    let spooks = await getToWatch();
    let specificSpook = spooks.find(spook => (spook.title === title && spook.year === year));
    return specificSpook._id;
}

module.exports = {
    getSeenSpooks,
    getToWatch,
    checkExistingToWatch,
    checkExistingSeen,
    formatDateWatched,
    formattedSeenSpooks,
    stringToWatch,
    getSpookID
}