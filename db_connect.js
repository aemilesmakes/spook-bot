const { MongoClient } = require('mongodb');
const { MONGO_URI } = require('./config.json');
const client = new MongoClient(MONGO_URI);

module.exports = async function connectDB() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Connected to DB!");

        // Make the appropriate DB calls
        await  getSingleSpook(client, {
            maximumNumberOfResults: 1
        });

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Connection closed!");
    }
}

//main().catch(console.error);

async function getSingleSpook(client, {
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER} = {}) {
    const cursor = client.db("spooky_film_club").collection("syllabus").find(
        {
            seen: { $eq: false },
        });

    const results = await cursor.toArray();

    if (results.length > 0) {
        let random = Math.floor(Math.random() * results.length);
        console.log(`How about this one: ${results[random].title} (${results[random].year})`);
    } else {
        console.log(`No spooks found. :(`);
    }
}



