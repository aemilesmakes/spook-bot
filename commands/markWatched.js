const { SlashCommandBuilder } = require('@discordjs/builders');
const {alreadyOnToWatch, getValidDateObject} = require("../validation");
const {client} = require("../connect");
const {getSpookID} = require("../syllabus");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('watch')
        .setDescription('Mark a spook from the to-watch list as watched')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('What\'s the title?')
                .setRequired(true)
        ).addStringOption(option =>
            option.setName('year')
                .setDescription('What year did it come out?')
                .setRequired(true)
        ).addStringOption(option =>
            option.setName('date-watched')
                .setDescription('When did we watch it?')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const movieTitle = interaction.options.getString('title');
            const movieYearString = interaction.options.getString('year');
            const dateWatchedString = interaction.options.getString('date-watched');
            const movieString = `${movieTitle} (${movieYearString})`;

            let alreadyExistsToWatch = await alreadyOnToWatch(movieString);
            let movieYearInt = parseInt(movieYearString);
            let validDateObject = await getValidDateObject(dateWatchedString);

            if (!alreadyExistsToWatch) {
                await interaction.reply({
                    content: `"*${movieTitle}* (${movieYearString})" is not on the to-watch list, so I can't mark it "watched". Embarrassing...`,
                    ephemeral: true
                });
            } else if (validDateObject === null){
                await interaction.reply({
                    content: `ERROR: "${dateWatchedString}" is not a valid date. Do better.`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `Just to double check...\n\n**Movie**: *${movieTitle}* (${movieYearString})\n**Watched On**: ${dateWatchedString}\n\nIs that right? (y/n)`,
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

                                await markWatched(client,movieTitle,movieYearInt,
                                    {
                                        date_assigned: validDateObject,
                                        seen: true
                                    });

                                interaction.followUp({
                                    content:`Spook updated!`,
                                    ephemeral: true
                                });

                            } else {
                                interaction.followUp({
                                    content:`Oh, never mind...`,
                                    ephemeral: true
                                });
                            }
                        });
                });
            }
        } catch {
            console.error();
        }
    }
};

/**
 * Mark a movie on the to-watch list as watched, and add the date it was watched.
 * @param client
 * @param title
 * @param year
 * @param updatedData
 * @return {Promise<void>}
 */
async function markWatched(client, title, year, updatedData) {

    //get ID to be updated
    let spookID = await getSpookID(title, year);

    const result = await client.db("spooky_film_club").collection("syllabus")
        .updateOne({ _id: spookID }, { $set: updatedData });

    //console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}