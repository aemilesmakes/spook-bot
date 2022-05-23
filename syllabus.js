const { client } = require('./connect.js');

/*
Query the DB for the whole list of spooks/syllabus
 */
async function getAllSpooks() {
    await client.connect();

    const cursor = client.db("spooky_film_club").collection("syllabus").find(
        {
        });

    const results = await cursor.toArray();

    if (results.length > 0) {
        return results;
    } else {
        console.log(`No spooks found. :(`);
    }
    await client.close();
}

/*
Get an array from full list of spooks that's JUST the movie title + year, for matching purposes.
 */

async function matchSyllabus() {
    let syllabus = await getAllSpooks();
    const arraySyllabus = [];

    for (let i = 0; i < syllabus.length; i++) {
        arraySyllabus.push(`${syllabus[i].title} (${syllabus[i].year})`);
    }
    await client.close();
    return arraySyllabus;
}

/*
Gets the to-watch list as an object array, sorted by year
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

/*
Prints the to-watch list as a string, for printing in Discord
 */

async function stringSyllabus() {
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
    //getSyllabus,
    //getFullSyllabus,
    getAllSpooks,
    getToWatch,
    matchSyllabus,
    stringSyllabus
}