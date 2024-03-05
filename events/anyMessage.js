const { Events } = require("discord.js");
const { storeCanvasToken } = require("../internals/neon.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) { 
        if (message.author.bot) {
            return;
        }

        if (message.channel.type == 1) {
            const userId = message.author.id;
            const token = message.content; // Consider adding validation here

            await storeCanvasToken(userId, token); 

            message.channel.send("Your Canvas token has been securely stored. You can now use the Canvas-related commands.");
        }
    },
};
