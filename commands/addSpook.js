// Add a spook to the database
const { SlashCommandBuilder } = require('@discordjs/builders');
const { client } = require('../connect.js');
const { checkExistingToWatch, checkExistingSeen } = require("../syllabus");
const date = require('date-and-time');

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
            option.setName('date-watched')
                .setDescription('If we\'ve watched it, when? (MM/DD/YY format)')
                .setRequired(false)
        ).addStringOption(option =>
            option.setName('director')
                .setDescription('Who directed it?')
                .setRequired(false)
        ),
    async execute(interaction) {
        //get inputs from command in discord
        const movieTitle = interaction.options.getString('title');
        const movieYearString = interaction.options.getString('year');
        const movieDir = interaction.options.getString('director');
        const dateWatchedString = interaction.options.getString('date');
        const movieString = `${movieTitle} (${movieYearString})`;
        let movieSeenBool = false;
        let dateWatched = null;
        let validDate = null;
        let validYear = null;

        //check that movieYearString = a valid year
        const earliestValidYear = new Date(1900);
        const latestValidYear = new Date().getFullYear();
        let movieYear = date.parse(movieYearString,'YYYY');
        let movieYearValid = date.isValid(movieYearString,'YYYY');

        validYear = movieYearValid === true && (movieYear >= earliestValidYear && movieYear <= latestValidYear);

        //check against both the to-watch and already-watched lists
        let toWatch = await checkExistingToWatch();
        let alreadyExistsToWatch = !!toWatch.find(spook =>
            spook === movieString)

        let haveWatched = await checkExistingSeen();
        let alreadyExistsSeen = !!haveWatched.find(spook =>
            spook === movieString)

        //set movieSeenBool to true IF value passed in from SpookBot is "true"
        if (dateWatchedString != null) {
            movieSeenBool = true;
            dateWatched = date.parse(dateWatchedString,'M/D/Y');
            validDate = date.isValid(dateWatchedString,'M/D/Y');
        }

        //perform checks
        if (alreadyExistsSeen === true) {
                await interaction.reply(`We've already watched that.......`); //if it's on the "watched" list
        } else if (alreadyExistsToWatch === true) {
                await interaction.reply(`That spook is already on the to-watch list!`); //if it's on the to-watch list

        } else if (validYear === false) {
            await interaction.reply(`\"${movieYearString}\" is NOT a valid year for a movie to have come out in. Try again.`); //if "year" value is not 4 digits

        } else if (validDate !== null && validDate !== true) {
            await interaction.reply(`Hm, that's not a valid date. Use MM/DD/YY format, instead!`);
        } else {
        //add to db
            await client.connect();
            //pass inputs to db
            await addSpook(client, {
                title: `${movieTitle}`,
                year: parseInt(movieYearString),
                director: `${movieDir}`,
                seen: movieSeenBool,
                date_assigned: dateWatched
            });
            await interaction.reply(`New spook added: ${movieTitle} (${movieYearString}) ${movieSeenBool}!`);
        }
        await client.close();
    }
};

async function addSpook(client, newSpook){
    const result = await client.db("spooky_film_club").collection("syllabus").insertOne(newSpook);
    console.log(`New spook added with the following id: ${result.insertedId}`);
    return result;
}