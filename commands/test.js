const { SlashCommandBuilder } = require('@discordjs/builders');
const {getSyllabus} = require("../syllabus");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Tests various functions!'),
    async execute(interaction) {
        let syllabus = await getSyllabus();
        console.log(syllabus);
        await interaction.reply('Test run!');
    }
};