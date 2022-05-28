const { SlashCommandBuilder } = require('@discordjs/builders');
const { client } = require('../connect.js');
const date = require('date-and-time');
const {alreadyOnToWatch, alreadyOnSeen, checkMovieYearValid} = require("../validation");

/**
 * Command that takes input about a movie (title*, year of release*, date watched, director), checks
 * those inputs to make sure they're valid, and then adds that movie to the database if all checks pass.
 *
 * @type {{data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, execute(*): Promise<void>}}
 */
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
        try {
            //get inputs from command in discord
            const movieTitle = interaction.options.getString('title');
            const movieYearString = interaction.options.getString('year');
            const movieDir = interaction.options.getString('director');
            const dateWatchedString = interaction.options.getString('date-watched');
            const movieString = `${movieTitle} (${movieYearString})`;

            //set some flags/null values
            let movieSeenBool = false;
            let dateWatched = null;
            let validDate = null;
            let validYear = null;
            let alreadyExistsToWatch = false;
            let alreadyExistsSeen = false;

            validYear = await checkMovieYearValid(movieYearString);
            alreadyExistsToWatch = await alreadyOnToWatch(movieString);
            alreadyExistsSeen = await alreadyOnSeen(movieString);

            //set movieSeenBool to true IF a value has been passed in to the date-watched parameter
            if (dateWatchedString != null) {
                movieSeenBool = true;
                dateWatched = date.parse(dateWatchedString, 'M/D/Y');
                validDate = date.isValid(dateWatchedString, 'M/D/Y');
            }

            //perform checks
            if (alreadyExistsSeen === true) {
                await interaction.reply(`We've already watched that.......`); //if it's on the "watched" list
            } else if (alreadyExistsToWatch === true) {
                await interaction.reply(`That spook is already on the to-watch list!`); //if it's on the to-watch list
            } else if (validYear === false) {
                await interaction.reply(`Hm, \"${movieYearString}\" is NOT a valid year. Use YYYY format instead!`); //if "year" value is not 4 digits
            } else if (validDate !== null && validDate !== true) {
                await interaction.reply(`Hm, ${dateWatched} is NOT a valid date. Use MM/DD/YY format, instead!`);
            } else {

                //build confirmation string
                let confirmationString = "Here's what you're adding... \n\n";
                confirmationString += `**Movie Title**: *${movieTitle}*\n`;
                confirmationString += `**Year Released**: ${movieYearString}\n`;
                if (movieDir != null) {
                    confirmationString += `**Directed By**: ${movieDir}\n`;
                }
                if (dateWatched != null) {
                    confirmationString += `**Date Watched**: ${dateWatchedString}\n`;
                }
                confirmationString += `\nDoes this look correct? (y/n)`;

                //confirm spook info
                await interaction.reply({
                    content: confirmationString,
                    ephemeral: true
                }).then(() => {
                    const filter = m => interaction.user.id === m.author.id;

                    //watch for responses for 30 seconds
                    interaction.channel.awaitMessages({filter, time: 30000, max: 1, errors: ['time']})
                        .then(async messages => {
                            //allow for Y/y N/n
                            const response = (messages.first().content).toLowerCase();
                            //if 'y' response
                            if (response === 'y') {

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

                                interaction.followUp(`"*${movieTitle}* (${movieYearString})" has been added to the syllabus!`);
                                //if 'n' response
                            } else if (response === 'n') {
                                interaction.followUp(`Oh, okay! Never mind, I guess...`);
                                //if any other response
                            } else {
                                interaction.followUp(`Invalid response...`);
                            }
                        })
                        .catch(() => {
                            //if no response w/in 20 seconds
                            interaction.followUp('You didn\'t respond in time... Never mind, I guess...');
                        });
                });
            }
            await client.close();
        } catch {
            console.error();
        }
    }
};

/**
 * Adds the movie + information from the command input into the database
 * @param client
 * @param newSpook
 * @return {Promise<*>}
 */
async function addSpook(client, newSpook){
    const result = await client.db("spooky_film_club").collection("syllabus").insertOne(newSpook);
    console.log(`New spook added with the following id: ${result.insertedId}`);
    return result;
}
