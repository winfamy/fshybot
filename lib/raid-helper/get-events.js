const axios = require("axios");
const {
  RAIDHELPER_API_KEY,
  DISCORD_STANDARDS_SERVERID,
} = require("../../config.json");
const { ConnectionVisibility } = require("discord.js");

module.exports = {
  async getEvents() {
    try {
      let response = await axios({
        method: "GET",
        url: `https://raid-helper.dev/api/v4/servers/${DISCORD_STANDARDS_SERVERID}/events`,
        headers: {
          Authorization: RAIDHELPER_API_KEY,
        },
      });

      return response.data.postedEvents;
    } catch (e) {
      console.log("no events")
      console.log(e)
    }
  },
};
