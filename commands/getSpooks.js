const { SlashCommandBuilder } = require('@discordjs/builders');
const { getToWatch } = require('../syllabus.js');

/**
 * Command that takes int x as input and returns x number of random spooks from the to-watch list.
 * @type {{data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, execute(*): Promise<void>}}
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('spook')
        .setDescription('Suggests [x] random spooks from the to-watch list!')
        .addIntegerOption(option =>
            option.setName('how-many')
                .setDescription('How many spooks do you want me to suggest?')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            let numSpooks = interaction.options.getInteger('how-many');
            let randomSpookString = await getRandomSpooksString(numSpooks);
            await interaction.reply(`${randomSpookString}`);
        }
        catch {
            console.error();
        }
    }
};


//Array that contains all of SpookBot's random suggestion openers.
let suggestArray = [
    "How about...",
    "Maybe...",
    "Here's a thought:",
    "What about...",
    "Have you considered:",
    "Survey says:",
    "THE FATES DECREE..."
]

/**
 * Get a random suggestion phrase from the array.
 * @return {Promise<`${string}\n\n`>}
 */
async function getRandomSuggest() {
    let suggestStart;
    let random = Math.floor(Math.random() * suggestArray.length);
    suggestStart =  `${suggestArray[random]}\n\n`;
    return suggestStart;
}

/**
 * Returns an array of random numbers.
 * @param len (the length of the to-watch array, to determine the highest possible number that should be generated)
 * @param num (the number of random numbers to add to the array)
 * @return array of integers
 */
async function getRandomNums(len, num) {
    let firstRandom = Math.floor(Math.random() * len);
    let randomArray = [];
    let random;
    let i = 0;

    randomArray.push(firstRandom);

    while (i < num-1) {
        random = Math.floor(Math.random() * len);
        if (!randomArray.includes(random)) {
            randomArray.push(random);
            i++
        }
    }
    return randomArray;
}

/**
 * Returns the suggested movies from the to-watch list corresponding with the random numbers generated
 * using getRandomNums method, formatted as a string for SpookBot.
 * @param numSpooks
 * @return {Promise<string>}
 */
async function getRandomSpooksString(numSpooks) {
    let toWatch = await getToWatch();
    let suggestion = await getRandomSuggest();
    let suggestedSpooks = "";

    if (numSpooks > toWatch.length) {
        suggestedSpooks = `That's too many spooks, put some back >:(`;
    } else if (numSpooks < 0) {
        suggestedSpooks = 'Negative spooks????? TRY AGAIN.';
    } else if (numSpooks === 0) {
        suggestedSpooks = 'Am I a joke to you. :(';
    } else {
        suggestedSpooks += suggestion;
        let randomNumArray = await getRandomNums(toWatch.length,numSpooks);
        for (let i = 0; i < randomNumArray.length; i++) {
            suggestedSpooks += `*${toWatch[randomNumArray[i]].title}* (${toWatch[randomNumArray[i]].year})\n`
        }
    }
    return suggestedSpooks;
}