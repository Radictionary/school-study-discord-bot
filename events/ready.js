const { Events } = require("discord.js");
const {ActivityType} = require("discord.js")

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity({
			type: ActivityType.Competing,
			name: "Education",
			state: "Teaching school Teaching school Teaching school Teaching school Teaching school Teaching school Teaching school Teaching school "
		})
	},
};
