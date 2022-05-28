const { SlashCommandBuilder } = require('@discordjs/builders');
const {alreadyOnToWatch} = require("../validation");
const date = require("date-and-time");

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
            let validDate = date.isValid(dateWatchedString, 'M/D/Y');

            if (!alreadyExistsToWatch) {
                await interaction.reply({
                    content: `"*${movieTitle}* (${movieYearString})" is not on the to-watch list, so I can't mark it "watched". Embarrassing...`,
                    ephemeral: true
                });
            } else if (!validDate){
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
                                interaction.followUp(`Great!`);

                                //THIS IS WHERE WE UPDATE THE RECORD IN THE DATABASE


                            } else {
                                interaction.followUp(`Never mind, then...`);
                            }
                        });
                });
            }
        } catch {
            console.error();
        }
    }
};