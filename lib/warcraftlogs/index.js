const axios = require("axios");
// const sampleData = require("../../data.json")
const {
  WARCRAFTLOGS_CLIENT_ID,
  WARCRAFTLOGS_CLIENT_SECRET,
} = require("../../config.json");
const { ENVIRONMENT } = require("../../config.json");
const logger = require("../../includes/logger");

const generateAccessToken = async function () {
  let response = await axios({
    method: "POST",
    url: "https://www.warcraftlogs.com/oauth/token",
    data: {
      grant_type: "client_credentials",
    },
    auth: {
      username: WARCRAFTLOGS_CLIENT_ID,
      password: WARCRAFTLOGS_CLIENT_SECRET,
    },
  });

  return response.data.access_token;
};

const constructGuildQuery = function (zoneId, page, metric = "dps") {
  return `
    query {
      characterData {
				characters(guildID: 724649, limit: 100, page: ${page}) {
					has_more_pages,
					total,
					last_page,
					data {
						classID,
						zoneRankings(metric: ${metric}, size: 20),
						name
					}
				}
			}
		}
  `;
};

const pullGuildCharacterPage = async function (
  access_token,
  zoneId,
  page,
  metric,
) {
  const url = "https://sod.warcraftlogs.com/api/v2/client";
  const query = constructGuildQuery(zoneId, page, metric);
  const response = await axios({
    method: "POST",
    url: url,
    data: { query: query },
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });

  logger.debug(response.data);
  console.log(response.data);
  return response.data.data.characterData.characters;
};

const fetchMetricData = async function (access_token, zoneId, metric = "dps") {
  logger.debug(`Fetching metric data for ${zoneId} ${metric}`);
  let page = 1;
  logger.debug(`pullGuildCharacterPage page ${page}`);

  let data = await pullGuildCharacterPage(access_token, zoneId, page, metric);
  let allCharacterData = data.data;

  while (data.has_more_pages) {
    page += 1;
    logger.debug(`pullGuildCharacterPage page ${page}`);
    data = await pullGuildCharacterPage(access_token, zoneId, page, metric);

    allCharacterData = allCharacterData.concat(data.data);
  }

  return allCharacterData;
};

const transformCharacterData = function (characterData = {}) {
  const classes = {
    2: "druid",
    3: "hunter",
    4: "mage",
    7: "priest",
    8: "rogue",
    9: "shaman",
    10: "warlock",
    11: "warrior",
  };

  byClass = {};
  characterData.forEach((guildMember) => {
    let classId = guildMember.classID.toString();
    if (!byClass.hasOwnProperty(classes[classId])) {
      byClass[classes[classId]] = [];
    }

    let allStarRanking = guildMember.zoneRankings.allStars.reduce(
      (current, next) => {
        return next.rank < current.rank ? next : current;
      },
      { rank: Number.MAX_SAFE_INTEGER },
    );

    if (allStarRanking.rank !== Number.MAX_SAFE_INTEGER) {
      byClass[classes[classId]].push({
        name: guildMember.name,
        rank: allStarRanking.rank,
        spec: allStarRanking.spec.toLowerCase(),
      });
    }
  });

  Object.keys(byClass).map((className) => {
    byClass[className] = byClass[className].sort((a, b) => a.rank - b.rank);
  });
  return byClass;
};

const getMetricData = async function (metric) {
  let wclData = null;
  if (ENVIRONMENT === "development") {
    try {
      const localData = require("./wcl-data.json");
      logger.debug(
        "Loaded info from wcl-data.json, " +
          localData.length.toString() +
          " entries",
      );

      wclData = localData;
    } catch (error) {
      logger.error(error);
    }
  }

  if (!wclData) {
    let access_token = await generateAccessToken();
    wclData = await fetchMetricData(access_token, "2018", metric);
    logger.debug(JSON.stringify(wclData));
  }

  return transformCharacterData(wclData);
};

module.exports = {
  pullGuildCharacterPage,
  transformCharacterData,
  getMetricData,
};
