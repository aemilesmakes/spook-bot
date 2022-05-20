//This module gets the to-watch list from MongoDB and puts it into an array.
const { client } = require('./connect.js');

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

async function printSyllabus() {
    let syllabus = await getSyllabus();
    let printedSyllabus = "";

    for (let i = 0; i < syllabus.length; i++) {
        printedSyllabus += `${syllabus[i].title} (${syllabus[i].year})\n`
    }
    return printedSyllabus;
}

module.exports = {
    getSyllabus,
    printSyllabus
}
