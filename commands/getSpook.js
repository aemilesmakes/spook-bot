//This is the command for getting a random spook.
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoClient } = require('mongodb');
const { MONGO_URI } = require('../config.json');

let suggestArray = [
    "How about",
    "Maybe...",
    "Here's a thought:",
    "What about",
    "Have you considered"
]
let suggest = suggestArray[Math.floor(Math.random() * suggestArray.length)];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spook')
        .setDescription('Suggests a random spook from the to-watch list!'),
    async execute(interaction) {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        let spook = await getSingleSpook(client);
        //console.log(spook.title);
        await interaction.reply(`${suggest} ${spook.title} (${spook.year})?`);
    }
};

async function getSingleSpook(client) {
    const cursor = client.db("spooky_film_club").collection("syllabus").find(
        {
            seen: { $eq: false },
        });

    const results = await cursor.toArray();

    if (results.length > 0) {
        let random = Math.floor(Math.random() * results.length);
        return results[random];
    } else {
        console.log(`No spooks found. :(`);
    }
}