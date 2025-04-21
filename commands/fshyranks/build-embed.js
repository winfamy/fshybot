const { EmbedBuilder } = require("discord.js");
const logger = require("../../includes/logger");

const discordSpecEmotes = {
  warrior: {
    fury: "1363658410234482780",
    arms: "1363658408959541370",
    protection: "1363658411346231558",
  },
  druid: {
    balance: "1363657981312368720",
    feral: "1363657982780641383",
    guardian: "1363657984470946043",
    restoration: { id: "1363657985548882020", name: "restorationdruid" },
  },
  hunter: {
    survival: "1363658060047843469",
    marksmanship: "1363658058647076966",
    melee: { id: "1363701044961345687", name: "meleehunter" },
  },
  mage: {
    arcane: "1363658117149229319",
    fire: "1363658118344609995",
    frost: "1363658119552565359",
    healer: "1363697496794075137",
  },
  priest: {
    discipline: "1363658160740499609",
    holy: "1363658215824556183",
    shadow: "1363658216810221688",
  },
  rogue: {
    assassination: "1363658259797512322",
    combat: "1363658261345341662",
    subtlety: "1363658263127789638",
    tank: { id: "1363697417433776128", name: "roguetank" },
  },
  shaman: {
    elemental: "1363658308203970570",
    enhancement: "1363658310309380177",
    restoration: { id: "1363658313279209703", name: "restorationshaman" },
    tank: { id: "1363697582735364269", name: "shamantank" },
  },
  warlock: {
    affliction: "1363658341724717056",
    demonology: "1363658343322882231",
    destruction: "1363658344857862367",
    tank: { id: "1363697437897920623", name: "warlocktank" },
  },
};

const discordClassEmotes = {
  hunter: "<:hunter:1333503827344621671>",
  warrior: "<:warrior:1333503827344621671>",
  druid: "<:druid:1333503819048419328>",
  mage: "<:mage:1333503821250297946>",
  rogue: "<:rogue:1333503823813017752>",
  shaman: "<:shaman:1333503825079832586>",
  priest: "<:priest:1333503822932344863>",
  warlock: "<:warlock:1333503826170216550>",
};

const buildEmbed = function (allStarsByClassAndMetric, dateAsString) {
  const fields = Object.keys(allStarsByClassAndMetric)
    .filter((classKey) => allStarsByClassAndMetric[classKey].length > 0)
    .map((classKey) => {
      let fieldString = allStarsByClassAndMetric[classKey]
        .map((playerAllStarEntry) => {
          let discordEmoteString;
          let discordSpecEmote =
            discordSpecEmotes[classKey][playerAllStarEntry.spec];
          if (discordSpecEmote) {
            if (typeof discordSpecEmote === "object") {
              discordEmoteString = `<:${discordSpecEmote.name}:${discordSpecEmote.id}>`;
            } else {
              discordEmoteString = `<:${playerAllStarEntry.spec}:${discordSpecEmote}>`;
            }
          } else {
            discordEmoteString = `${classKey} ${playerAllStarEntry.spec}`;
          }

          return `${discordEmoteString} \`${playerAllStarEntry.rank}\` ${playerAllStarEntry.name}\n`;
        })
        .join(" ");

      // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
      let classNameReadable =
        String(classKey).charAt(0).toUpperCase() + String(classKey).slice(1);
      let classEmote = discordClassEmotes[classKey];
      return {
        name: `${classEmote} **${classNameReadable}**`,
        value: fieldString,
        inline: true,
      };
    });

  return new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("<Standards Rankings>")
    .setDescription(`DPS rankings as of ${dateAsString}`)
    .addFields(fields);
};

module.exports = {
  buildEmbed,
};
