/*
A command that prints all the other commands that SpookBot can do.
*/

const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with SpookBot'),
    async execute(interaction) {
        let help = await printHelp();
        await interaction.reply(help);
    },
};

async function printHelp() {
    let helpString = "I'm SpookBot! You can ask me to do the following:\n\n";
    helpString += "**/spook** = suggests [x] random spooks from the unwatched list, where [x] is a number you give me\n";
    helpString += "**/add** = add a movie to the syllabus (can be unwatched OR watched)\n";
    helpString += "**/watch** = mark a movie on the to-watch list as seen, and add the date that we watched it\n";
    helpString += "**/boo** = aah!\n";

    return helpString;
}