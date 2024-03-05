const axios = require("axios");

module.exports = {
    name: "announcements",
    async execute(interaction, tokenData) {
        const classId = interaction.options.getInteger('class_id');
        const quantity = interaction.options.getInteger('quantity') || 5; // Default to 5 announcements if not specified
        const baseUrl = 'https://iusd.instructure.com/api/v1';

        try {
            const response = await axios.get(`${baseUrl}/announcements`, {
                headers: { 'Authorization': `Bearer ${tokenData.token}` },
                params: {
                    context_codes: [`course_${classId}`],
                    per_page: quantity 
                }
            });

            const announcements = response.data;
            let replyMessage = announcements.length > 0 ?
                announcements.slice(0, quantity) // Ensure the slice of the array based on 'quantity'
                    .map((announcement, index) => {
                        const plainTextMessage = stripHtml(announcement.message); 
                        return `**${index + 1}. ${announcement.title}**\n${plainTextMessage}`;
                    }).join('\n\n') :
                'No announcements found for the specified class.';

            await interaction.editReply({ content: replyMessage, ephemeral: true });
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
            await interaction.editReply({ content: 'There was an error fetching the announcements.', ephemeral: true });
        }
    },
};

function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
}
