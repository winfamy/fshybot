const axios = require("axios");
const {
  RAIDHELPER_API_KEY,
  DISCORD_STANDARDS_SERVERID,
} = require("../../config.json");
const logger = require("../../lib/logger");

module.exports = {
  async getRaidplan(eventId) {
    try {
      const response = await axios({
        method: "GET",
        url: `https://raid-helper.dev/api/raidplan/${eventId}`,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        },
      });

      return response.data !== "" ? response.data : null;
    } catch (e) {
      logger.error(e);
    }
  },
};
