const { REST, Routes } = require("discord.js");
require("dotenv/config");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID), { body: commands });
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });


		//delete slash commands

		// rest
		// 	.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID), { body: [] })
		// 	.then(() => console.log("Successfully deleted all guild commands."))
		// 	.catch(console.error);

		// // // for global commands
		// rest
		// 	.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
		// 	.then(() => console.log("Successfully deleted all application commands."))
		// 	.catch(console.error);

	} catch (error) {
		console.error(error);
	}
})();