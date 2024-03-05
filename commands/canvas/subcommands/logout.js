const { removeUserInformation } = require("../../../internals/neon");

module.exports = {
    name: "logout",
    async execute(interaction, tokenData) {
        try {
            await removeUserInformation(interaction.user.id);
            await interaction.editReply("**Canvas Account Disconnected.** Canvas Token removed from my database.");
        } catch (error) {
            console.error("Failed to remove user information:", error);
            await interaction.editReply("Failed to disconnect your Canvas Account. Please try again later or contact support.");
        }
    },
};
