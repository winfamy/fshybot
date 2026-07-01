const axios = require("axios");
const {
  RAIDHELPER_API_KEY,
  DISCORD_STANDARDS_SERVERID,
} = require("../../config.json");
const logger = require("../../includes/logger");

module.exports = {
  async getRaidplan(eventId) {
    const response = await axios({
      validateStatus: (status) => status >= 200 && status < 300 || status == 403, 
      method: "GET",
      url: `https://raid-helper.xyz/api/v4/comps/${eventId}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      },
    });

    return response.data !== "" ? response.data : null;
  },
};
