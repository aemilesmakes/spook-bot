//This is the command for getting a random spook from the to-watch list.
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getSyllabus } = require('../syllabus.js');

let suggestArray = [
    "How about",
    "Maybe...",
    "Here's a thought:",
    "What about",
    "Have you considered:",
    "Survey says:",
    "THE FATES DECREE..."
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spook')
        .setDescription('Suggests a random spook from the to-watch list!'),
    async execute(interaction) {
        try {
            let spook = await getSingleSpook();
            let suggest = suggestArray[Math.floor(Math.random() * suggestArray.length)];
            await interaction.reply(`${suggest} ${spook.title} (${spook.year})?`);
        }
        catch {
            console.error();
        }
    }
};

async function getSingleSpook() {
        let syllabus = await getSyllabus();
        let random = Math.floor(Math.random() * syllabus.length);
        return syllabus[random];
}