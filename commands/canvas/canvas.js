const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { getCanvasToken } = require("../../internals/neon");

// Load subcommands
const subcommands = {};
const subcommandsPath = path.join(__dirname, "subcommands");
const subcommandFiles = fs.readdirSync(subcommandsPath).filter((file) => file.endsWith(".js"));

for (const file of subcommandFiles) {
	const subcommand = require(path.join(subcommandsPath, file));
	subcommands[subcommand.name] = subcommand;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("canvas")
		.setDescription("Interact with Canvas LMS")
		.addSubcommandGroup(subcommandGroup =>
			subcommandGroup
				.setName('account')
				.setDescription('Manage your Canvas account')
				.addSubcommand(subcommand =>
					subcommand
						.setName("details")
						.setDescription("Check your Canvas account details"))
				.addSubcommand(subcommand =>
					subcommand
						.setName("logout")
						.setDescription("Disconnect your canvas account")))
		// .addSubcommand((subcommand) => subcommand.setName("account").setDescription("Check your Canvas account details"))
		.addSubcommand((subcommand) => subcommand.setName("classes").setDescription("Check your Canvas classes").addBooleanOption((option) => option.setName("public_message").setDescription("The bot's response to this command will be publicly seen").setRequired(false)))
		// .addSubcommand((subcommand) => subcommand.setName("logout").setDescription("Disconnect your canvas account"))
		.addSubcommand((subcommand) =>
			subcommand
				.setName("announcements")
				.setDescription("Check the announcements of a class")
				.addIntegerOption((option) => option.setName("class_id").setDescription("The class to take announcements from").setRequired(true))
				.addIntegerOption((option) => option.setName("quantity").setDescription("The number of most recent announcements to show").setRequired(false))
				.addBooleanOption((option) => option.setName("public_message").setDescription("The bot's response to this command will be publicly seen").setRequired(false))
		)
		.addSubcommandGroup(subcommandGroup =>
			subcommandGroup
				.setName('announcements_feed')
				.setDescription('Gives live updates on new announcements')
				.addSubcommand(subcommand =>
					subcommand
						.setName("add")
						.setDescription("Create a new announcements feed")
						.addIntegerOption((option) => option.setName("class_id").setDescription("The class for the feed").setRequired(true))
						.addBooleanOption((option) => option.setName("public_message").setDescription("The bot's response to this command will be publicly seen").setRequired(false))
						)
						
				.addSubcommand(subcommand => 
					subcommand
						.setName("list")
						.setDescription("List announcement feeds in this server")
						.addBooleanOption((option) => option.setName("public_message").setDescription("The bot's response to this command will be publicly seen").setRequired(false))
					)
				.addSubcommand(subcommand =>
					subcommand
						.setName("delete")
						.setDescription("Delete an announcements feed")
						.addIntegerOption((option) => option.setName("class_id").setDescription("The class for the feed").setRequired(true))
						.addBooleanOption((option) => option.setName("public_message").setDescription("The bot's response to this command will be publicly seen").setRequired(false))
					)),
	async execute(interaction) {
		const boolValue = interaction.options.getBoolean("public_message")
		if ((boolValue || boolValue == null) && interaction.options.getSubcommand() != "details" && interaction.options.getSubcommand() != "logout") {
			await interaction.deferReply();
		}
		else {
			await interaction.deferReply({ ephemeral: true });
		}

		if (interaction.user.bot == true) {
			return
		}
		const subcommand = subcommands[interaction.options.getSubcommand()];
		if (subcommand) {
			let tokenData = await getCanvasToken(interaction.user.id)
			if (tokenData.token == null) {
				await interaction.editReply({ content: "You have not connected to your canvas account. Please check your DMs for intructions.", ephemeral: true })
				const dmChannel = await interaction.user.createDM();
				await dmChannel.send("Please reply to this message with your Canvas token. I am not responsible for any actions done with this token. Do not share this token with anyone. You can find this by going to your __Canvas Account Settings>Approved Integrations>New Access Token__:");
				return
			} else {
				await subcommand.execute(interaction, tokenData);
			}
		} else {
			console.log("Subcommand not found");
			interaction.editReply("Your command got lost")
		}
	},
};