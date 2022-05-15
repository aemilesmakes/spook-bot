//This is the command for getting a random spook.

const { SlashCommandBuilder } = require('@discordjs/builders');
const {initSyllabus} = require("../methods/syllabus");

let syllabus = initSyllabus();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spook')
        .setDescription('Suggests a random spook from the syllabus!'),
    async execute(interaction) {
        const randomSpook = syllabus[Math.floor(Math.random() * syllabus.length)];
        let msg = `${randomSpook.spookTitle} (${randomSpook.spookYear})`;
        await interaction.reply(`How about... ${msg}`);
    },
};
