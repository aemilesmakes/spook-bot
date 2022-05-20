//This module gets the to-watch list from MongoDB and puts it into an array.
const { client } = require('./connect.js');

/*
Gets the to-watch list as an array, sorted by year, oldest to newest
 */

async function getSyllabus() {
    await client.connect();

    const cursor = client.db("spooky_film_club").collection("syllabus").find(
        {
            seen: { $eq: false },
        }).sort({ year: 1 });

    const results = await cursor.toArray();

    if (results.length > 0) {
        return results;
    } else {
        console.log(`No spooks found. :(`);
    }
    await client.close();
}

/*
Get an array that's just the movie title + year, for matching purposes.
 */

async function matchSyllabus() {
    let syllabus = await getSyllabus();
    const arraySyllabus = [];

    for (let i = 0; i < syllabus.length; i++) {
        arraySyllabus.push(`${syllabus[i].title} (${syllabus[i].year})`);
    }
    await client.close();
    return arraySyllabus;
}


/*
Prints the to-watch list as a string, for Discord
 */

async function stringSyllabus() {
    let syllabus = await getSyllabus();
    let stringSyllabus = "";

    for (let i = 0; i < syllabus.length; i++) {
        stringSyllabus += `${syllabus[i].title} (${syllabus[i].year})\n`
    }
    return stringSyllabus;
}

module.exports = {
    getSyllabus,
    matchSyllabus,
    stringSyllabus
}