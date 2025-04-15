const axios = require("axios");
const {
  RAIDHELPER_API_KEY,
  DISCORD_STANDARDS_SERVERID,
} = require("../../config.json");

module.exports = {
  async getEvent(eventId) {
    try {
      let response = await axios({
        method: "GET",
        url: `https://raid-helper.dev/api/v2/events/${eventId}`,
        headers: {
          Authorization: RAIDHELPER_API_KEY,
        },
      });

      return response.data;
    } catch (error) {
      console.log("fuck");
    }
  },
};
