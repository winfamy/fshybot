const axios = require("axios")
const sampleData = require("../../data.json")
const { WARCRAFTLOGS_CLIENT_ID, WARCRAFTLOGS_CLIENT_SECRET } = require("../../config.json")

const generateAccessToken = async function() {
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


  return response.data.access_token
}


const constructGuildQuery = function(zoneId, page, metric = "dps") {
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


const pullGuildCharacterPage = async function(access_token, zoneId, page, metric) {
  const url = "https://sod.warcraftlogs.com/api/v2/client"
  const query = constructGuildQuery(zoneId, page, metric)
  const response = await axios({
    method: "POST",
    url: url,
    data: { "query": query },
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Content-Type": "application/json"
    }
  })

  return response.data.data.guildData.guild.members
}

const pullAllMetricData = async function() {
  let page = 1
  let data = await pullGuildCharacterPage(access_token, zoneId, page, metric)
  let all_character_data = data.data
  while (data.has_more_pages) {
    page += 1
    data = await pullGuildCharacterPage(access_token, zoneId, page, metric)
    all_character_data = Object.assign(all_character_data, data.data)
  }

  return all_character_data
}


const transformCharacterData = function(characterData = {}) {
  bySpec = {}
  sampleData.data.forEach((guildMember) => {
    specs = guildMember.zoneRankings.allStars.map(allStar => {
      if (!bySpec.hasOwnProperty(allStar.spec)) {
        // init spec with empty array
        bySpec[allStar.spec] = []
      }

      bySpec[allStar.spec][guildMember.name] = allStar
    })
  })

  return bySpec
}

module.exports = {
  generateAccessToken,
  pullGuildCharacterPage,
  pullAllMetricData,
  transformCharacterData
}
