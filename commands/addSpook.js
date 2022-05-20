// Add a spook to the database
const { SlashCommandBuilder } = require('@discordjs/builders');
const { client } = require('../connect.js');
const { printSyllabus } = require('../syllabus.js');

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
        const movieYear = interaction.options.getString('year');
        const movieDir = interaction.options.getString('director');

        if (movieYear.length !== 4) { // YEAR CAN ONLY BE 4 CHARACTERS
            await interaction.reply(`That's not a real year......... I'm not adding that :(`);
        } else {
            //pass inputs to db
            await client.connect();
            await addSpook(client, {
                title: `${movieTitle}`,
                year: `${movieYear}`,
                director: `${movieDir}`,
                seen: 'false'
            });
            await interaction.reply(`New spook added: ${movieTitle} (${movieYear})!`);
        }
        await client.close();
    }
};

async function addSpook(client, newSpook){
    const result = await client.db("spooky_film_club").collection("syllabus").insertOne(newSpook);
    console.log(`New spook added with the following id: ${result.insertedId}`);
    return result;
}