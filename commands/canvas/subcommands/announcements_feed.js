const axios = require('axios');
const {storeAnnouncementFeed} = require('../../../internals/neon');

module.exports = {
    name: "add",
    description: "Create a new announcements feed",
    async execute(interaction, tokenData) {
        const classId = interaction.options.getInteger('class_id');
        const channelId = interaction.channelId; // The channel where the command was executed

        try {
            const feed = await storeAnnouncementFeed(classId, channelId);

            const courseName = await getCourseName(classId, tokenData.token)
            await interaction.editReply({ content: `**Announcements feed for ${courseName}** has been added with feed ID __${feed.id}__. This channel will now get live announcement updates.`});
        } catch (error) {
            console.error('Error creating announcements feed:', error);
            await interaction.editReply({ content: 'Failed to create announcements feed. Maybe just check canvas next time idk.'});
        }
    }
};

async function getCourseName(courseId, accessToken) {
    const url = `https://iusd.instructure.com/api/v1/courses/${courseId}`;
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return response.data.name; 
    } catch (error) {
        console.error('Error fetching course details:', error);
        return null; 
    }
}