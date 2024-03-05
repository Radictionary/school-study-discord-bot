const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("google")
		.setDescription("Searches Google to answer a question")
		// Add a string option for the user's search query
		.addStringOption((option) => option.setName("query").setDescription("The query to search for").setRequired(true)),
	async execute(interaction) {
		// Retrieve the query option from the interaction
		const query = interaction.options.getString("query");

		// Construct the Google search URL with the user's query
		const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

		// Reply with the Google search URL
		await interaction.reply({ content: `Here's your Google search link: ${searchUrl}` });
	},
};