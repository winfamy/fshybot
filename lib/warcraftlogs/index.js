const axios = require("axios")
const { WARCRAFTLOGS_CLIENT_ID, WARCRAFTLOGS_CLIENT_SECRET } = require("../../config.json")

const generateAccessToken = async function () {
  let response = await axios({
    method: "POST",
    url: "https://www.warcraftlogs.com/oauth/token",
    data: {
      grant_type: "client_credentials"
    },
    auth: {
      username: WARCRAFTLOGS_CLIENT_ID,
      password: WARCRAFTLOGS_CLIENT_SECRET
    }
  })

  return response.access_token
}


const constructGuildQuery = function (zoneId, page, metric = "dps") {
  return `
    query {
      guildData {
        guild(name: "Standards" serverSlug: "crusader-strike" serverRegion: "us") {
          members(limit: 100, page: ${page}) {
            has_more_pages
            data {
              name
              zoneRankings(zoneID: ${zoneId} metric: ${metric})
            }
          }
        }
      }
    }
  `
}


const pullGuildCharacterPage = async function (access_token, zoneId, page, metric) {
  const url = "https://sod.warcraftlogs.com/api/v2/client"
  const query = constructGuildQuery(zoneId, page, metric)
  const response = await axios({
    method: "POST",
    url: url,
    data: {"query": query},
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Content-Type": "application/json"
    }
  })

  console.log(response.data)

  return response.data.guildData.guild.members

const pullAllMetricData = function () {
  let page = 1
  let data = pullGuildCharacterPage(access_token, zoneId, page, metric)
  let all_character_data = data.data
  while (data.has_more_pages) {
    page += 1
    data = pullGuildCharacterPage(access_token, zoneId, page, metric)
    all_character_data = Object.assign(all_character_data, data.data)
  }

  return all_character_data
}

module.exports = {
  generateAccessToken
}
