const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boo')
        .setDescription('Replies with aaah!'),
    async execute(interaction) {
        await interaction.reply('Aaah!');
    },
};