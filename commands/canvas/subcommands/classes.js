const axios = require("axios");

module.exports = {
    name: "classes",
    async execute(interaction, tokenData) {
        const baseUrl = 'https://iusd.instructure.com/api/v1';
        const endpoint = '/courses';
        const url = `${baseUrl}${endpoint}`;

        let formattedResponse = ''; 
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${tokenData.token}`
                },
                params: {
                    'enrollment_state': 'active', 
                    'per_page': 100 // Adjust based on expected maximum number of courses
                }
            });

            if (response.data && response.data.length > 0) {
                formattedResponse = response.data.map(course => `**Course Name:** ${course.name}\t(${course.id})`).join('\n');
            } else {
                formattedResponse = 'No active courses found or unable to retrieve courses.';
            }
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            formattedResponse = 'There was an error fetching your courses. Please try again later.';
        }
        await interaction.editReply("Course IDs are in parentheses\n\n" + formattedResponse)
       
    },
};
