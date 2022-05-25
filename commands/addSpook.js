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
            option.setName('seen')
                .setDescription('Have we watched it?')
                .setRequired(false)
                .addChoices({
                    name: 'yes',
                    value: 'true'
                })
                .addChoices({
                    name: 'no',
                    value: 'false'
                })
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
        const haveWatched = interaction.options.getString('seen');
        const movieString = `${movieTitle} (${movieYear})`;

        let syllabus = await checkExisting();
        let alreadyExists = !!syllabus.find(spook =>
            spook === movieString)

        //TEST
        console.log(movieString);
        console.log("Already on the syllabus = " + alreadyExists);
        console.log("Have we watched it? = " + haveWatched);

        //I THINK I NEED A SEPARATE CHECK FUNCTION THAT LOOKS TO SEE IF IT'S ON THE "WATCHED" LIST OVER IN SYLLABUS.JS

        if (alreadyExists === true) {
            if (seen === true) {
                await interaction.reply(`We've already watched that.......`);
            } else {
                await interaction.reply(`That spook is already on the syllabus!`);
            }
        } else if (movieYear.length !== 4) { // YEAR CAN ONLY BE 4 CHARACTERS
            await interaction.reply(`That's not a real year......... I'm not adding that :(`);
        } else {
            //pass inputs to db
/*            await client.connect();
            await addSpook(client, {
                title: `${movieTitle}`,
                year: parseInt(movieYear),
                director: `${movieDir}`,
                seen: seen
            });*/
            await interaction.reply(`New spook added: ${movieTitle} (${movieYear}) ${seen}!`);
        }
        await client.close();
    }
};

async function addSpook(client, newSpook){
    const result = await client.db("spooky_film_club").collection("syllabus").insertOne(newSpook);
    console.log(`New spook added with the following id: ${result.insertedId}`);
    return result;
}