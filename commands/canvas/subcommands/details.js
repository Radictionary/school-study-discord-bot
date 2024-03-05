module.exports = {
	name: "details",
	async execute(interaction, tokenData) {
		await interaction.editReply(`**Canvas Account Connected.** Canvas Token Stored for: ${tokenData.duration.years} years, ${tokenData.duration.days} days, and ${tokenData.duration.minutes} minutes`);
	},
};
