//This command prints the to-watch list, using the array from syllabus.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stringToWatch } = require("../syllabus");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('syllabus')
        .setDescription('Prints the entire current to-watch list.'),
    async execute(interaction) {
        await interaction.reply("Visit spookyfilm.club to see the syllabus!");
    }
};