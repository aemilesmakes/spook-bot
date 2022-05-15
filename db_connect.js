const { MongoClient } = require('mongodb');
const { MONGO_URI } = require('./config.json');
const client = new MongoClient(MONGO_URI);

module.exports = async function connectDB() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();


        console.log("Connected to DB!");
        // Make the appropriate DB calls
        //await  listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

//main().catch(console.error);

async function listDatabases(client) {
    let databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

