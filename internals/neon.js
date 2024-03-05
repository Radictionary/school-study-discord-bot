const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});


async function getCanvasToken(userId) {
  try {
    const result = await sql`
            SELECT token, age(updated_at) as duration
            FROM canvas_tokens
            WHERE user_id = ${userId};
        `;

    if (result.length > 0) {
      const { token, duration } = result[0];
      // Convert PostgreSQL interval to years, days, and minutes
      const durationObj = parsePostgresInterval(duration);
      return { token, duration: durationObj };
    } else {
      return { token: null, duration: null };
    }
  } catch (error) {
    console.error('Error retrieving token and duration:', error);
    return { token: null, duration: null };
  }
}

async function storeCanvasToken(userId, token) {
  try {
    await sql`
            INSERT INTO canvas_tokens (user_id, token, updated_at)
            VALUES (${userId}, ${token}, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) DO UPDATE
            SET token = EXCLUDED.token, updated_at = CURRENT_TIMESTAMP;
        `;
    console.log('Token stored/updated successfully');
  } catch (error) {
    console.error('Error storing/updating token:', error);
  }
}

async function removeUserInformation(userId) {
  try {
    await sql`
            DELETE FROM canvas_tokens
            WHERE user_id = ${userId};
        `;
    console.log(`User information for user_id ${userId} has been successfully removed.`);
  } catch (error) {
    console.error(`Error removing user information for user_id ${userId}:`, error);
  }
}

function parsePostgresInterval(interval) {
  const duration = { years: 0, days: 0, hours: 0, minutes: 0 };

  // First, check for a presence of days and years in the interval string
  const dayMatch = interval.match(/(\d+)\sday/);
  const yearMatch = interval.match(/(\d+)\syear/);

  if (dayMatch) {
    duration.days = parseInt(dayMatch[1], 10);
  }

  if (yearMatch) {
    duration.years = parseInt(yearMatch[1], 10);
  }

  // Extract hours, minutes, and seconds from the interval
  // This part assumes the interval string might not always include days or years explicitly
  const timeMatch = interval.match(/((?:-)?\d+):(\d+):(\d+\.\d+)|((?:-)?\d+):(\d+)/);
  if (timeMatch) {
    // Checking for HH:MM:SS format
    if (timeMatch[1] !== undefined) {
      duration.hours = Math.abs(parseInt(timeMatch[1], 10)); // Convert hours to absolute value
      duration.minutes = parseInt(timeMatch[2], 10); // Minutes are captured here
    }
    // Checking for HH:MM format (if applicable)
    else if (timeMatch[4] !== undefined) {
      duration.hours = Math.abs(parseInt(timeMatch[4], 10)); // Convert hours to absolute value
      duration.minutes = parseInt(timeMatch[5], 10); // Minutes are captured here
    }
  }

  return duration;
}


//Polling functions

async function storeAnnouncementFeed(classId, channelId, lastAnnouncementId = '') {
  try {
    const result = await sql`
            INSERT INTO announcement_feeds (class_id, channel_id, last_announcement_id)
            VALUES (${classId}, ${channelId}, ${lastAnnouncementId})
            RETURNING *;`;
    console.log('Feed added:', result[0]);
    return result[0]; // Return the newly inserted feed
  } catch (error) {
    console.error('Error inserting new feed:', error);
    throw error; 
  }
}

async function getFeeds() {
  try {
    const result = await sql`SELECT * FROM announcement_feeds;`;
    return result; // Returns an array of all feeds
  } catch (error) {
    console.error('Error fetching feeds:', error);
    throw error; 
  }
}

async function updateFeedLastAnnouncementId(feedId, lastAnnouncementId) {
  try {
    const result = await sql`
            UPDATE announcement_feeds
            SET last_announcement_id = ${lastAnnouncementId}
            WHERE id = ${feedId}
            RETURNING *;`;
    console.log('Feed updated:', result[0]);
    return result[0]; // Return the updated feed
  } catch (error) {
    console.error('Error updating feed:', error);
    throw error; 
  }
}

async function removeAnnouncementFeed(feedId) {
  try {
    const result = await sql`
            DELETE FROM announcement_feeds
            WHERE id = ${feedId}
            RETURNING *;`;
    console.log('Feed deleted:', result[0]);
    return result[0]; // Return the deleted feed
  } catch (error) {
    console.error('Error deleting feed:', error);
    throw error; 
  }
}


module.exports = { getCanvasToken, storeCanvasToken, removeUserInformation, storeAnnouncementFeed, getFeeds, updateFeedLastAnnouncementId, removeAnnouncementFeed };
