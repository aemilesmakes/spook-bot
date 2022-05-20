//This command prints the whole syllabus, using the array from syllabus.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stringSyllabus } = require("../syllabus");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('syllabus')
        .setDescription('Prints the entire current to-watch list.'),
    async execute(interaction) {
        let syllabus = await stringSyllabus();
        await interaction.reply(syllabus);
    }
};