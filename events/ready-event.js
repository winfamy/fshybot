const { Events } = require("discord.js");
const logger = require("../includes/logger");
const {
  DISCORD_STANDARDS_SERVERID,
  DISCORD_STANDARDS_RAIDGROUPCATEGORYID,
} = require("../config.json");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    logger.info(`Ready! Logged in as ${client.user.tag}`);
    await logRaidGroupCategoryChannels(client);
    await logSSCRoleMembers(client);
  },
};

async function logSSCRoleMembers(client) {
  const guild = await client.guilds.fetch(DISCORD_STANDARDS_SERVERID);
  await guild.members.fetch();
  const roles = await guild.roles.fetch();
  const sscRoles = roles.filter((role) => role.name.startsWith("SSC") || role.name.startsWith("ssc"));
  sscRoles.forEach((role) => {
    logger.info(`Role: ${role.name}`);
    role.members.forEach((member) => {
      logger.info(`  ${member.displayName}`);
    });
  });
}

async function logRaidGroupCategoryChannels(client) {
  const guild = await client.guilds.fetch(DISCORD_STANDARDS_SERVERID);
  const channels = await guild.channels.fetch();
  const categoryChannels = channels.filter(
    (channel) => channel.parentId === DISCORD_STANDARDS_RAIDGROUPCATEGORYID,
  );
  logger.info(`Channels in raid group category (${DISCORD_STANDARDS_RAIDGROUPCATEGORYID}):`);
  categoryChannels.forEach((channel) => {
    logger.info(`  ${channel.name} (${channel.id})`);
  });
}
