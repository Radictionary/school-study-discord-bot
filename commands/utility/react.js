const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("react").setDescription("Reacts with the message").addStringOption((option) => option.setName("emoji").setDescription("The emoji to react with").setRequired(false)),
	async execute(interaction) {
		const message = await interaction.reply({ content: "You can react with Unicode emojis!", fetchReply: true });
		message.react(interaction.options.getString("emoji"));
	},
};
