//This command prints the whole syllabus, using the array from syllabus.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const {printSyllabus} = require("../syllabus");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('syllabus')
        .setDescription('Prints the entire current to-watch list.'),
    async execute(interaction) {
        let printedSyllabus = await printSyllabus();
        await interaction.reply(printedSyllabus);
    }
};