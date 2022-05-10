const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spook')
        .setDescription('Suggests a random spook from the syllabus!'),
    async execute(interaction) {
        await interaction.reply(`How about...`);
    },
};
