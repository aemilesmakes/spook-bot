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
 * Converts the object array of watched spooks into a string, so SpookBot can print it in Discord.
 * Uses date-and-time package to make the date nicer.
 *
 * @return object array of all watched spooks
 */
async function stringSeen() {
    let seenSpooks = await getSeenSpooks();
    let stringSeen = "";

    for (let i = 0; i < seenSpooks.length; i++) {
        let dateWatched = date.parse((seenSpooks[i].date_assigned).substring(0,10),'YYYY-MM-DD');
        let dateClean = date.format(dateWatched,'MMM DD, YYYY')
        stringSeen += `${seenSpooks[i].title} (${seenSpooks[i].year}) - ${dateClean}\n`
    }
    return stringSeen;
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

module.exports = {
    getToWatch,
    checkExistingToWatch,
    checkExistingSeen,
    stringSeen,
    stringToWatch
}