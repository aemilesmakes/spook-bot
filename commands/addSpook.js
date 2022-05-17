// Add a spook to the database

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoClient } = require('mongodb');
const { MONGO_URI } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add a new spook to the to-watch list!')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the movie to be added.')
                .setRequired(true)
        ).addStringOption(option =>
            option.setName('year')
                .setDescription('The year the movie you\'re adding came out.')
                .setRequired(true)
        ).addStringOption(option =>
            option.setName('director')
                .setDescription('Who directed this movie?')
                .setRequired(false)
        ),
    async execute(interaction) {
        //get inputs from command in discord
        const movieTitle = interaction.options.getString('title');
        const movieYear = parseInt(interaction.options.getString('year'));
        const movieDir = interaction.options.getString('director');

        // IMPLEMENT SOME CHECKS FTLOG

        //pass inputs to db
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        await addSpook(client, {
            title: `${movieTitle}`,
            year: `${movieYear}`,
            director: `${movieDir}`,
            seen: 'false'
        });
        await interaction.reply(`New spook added: ${movieTitle} (${movieYear})!`);
    }
};

async function addSpook(client, newSpook){
    const result = await client.db("spooky_film_club").collection("syllabus").insertOne(newSpook);
    console.log(`New spook added with the following id: ${result.insertedId}`);
    return result;
}