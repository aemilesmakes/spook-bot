const { SlashCommandBuilder } = require('@discordjs/builders');

/*
This command goes "aah!"
*/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boo')
        .setDescription('Replies with aaah!'),
    async execute(interaction) {
        await interaction.reply('Aaah!');
    },
};