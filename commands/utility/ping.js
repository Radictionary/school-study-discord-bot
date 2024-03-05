const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong. If it doesn't...Play tennis instead"),
	async execute(interaction) {
		await interaction.reply("Pong!");
	},
};
