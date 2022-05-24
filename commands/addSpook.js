// Add a spook to the database
const { SlashCommandBuilder } = require('@discordjs/builders');
const { client } = require('../connect.js');
const { checkExisting } = require("../syllabus");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add a new spook to the to-watch list!')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('What\'s it called?')
                .setRequired(true)
        ).addStringOption(option =>
            option.setName('year')
                .setDescription('What year did it come out?')
                .setRequired(true)
        ).addStringOption(option =>
            option.setName('director')
                .setDescription('Who directed it?')
                .setRequired(false)
        ),
    async execute(interaction) {
        //get inputs from command in discord
        const movieTitle = interaction.options.getString('title');
        const movieYear = interaction.options.getString('year');
        const movieDir = interaction.options.getString('director');

        const movie = `${movieTitle} (${movieYear})`;
        let syllabus = await checkExisting();
        let alreadyExists = syllabus.find(spook =>
            spook === movie)
        console.log(alreadyExists);

        if (alreadyExists === true) {
            await interaction.reply(`That spook is already on the syllabus!`);
        } else if (movieYear.length !== 4) { // YEAR CAN ONLY BE 4 CHARACTERS
            await interaction.reply(`That's not a real year......... I'm not adding that :(`);
        } else {
            //pass inputs to db
/*            await client.connect();
            await addSpook(client, {
                title: `${movieTitle}`,
                year: parseInt(movieYear),
                director: `${movieDir}`,
                seen: false
            });*/
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