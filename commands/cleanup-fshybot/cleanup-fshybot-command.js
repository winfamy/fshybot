const {
  SlashCommandBuilder,
  MessageFlags,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { getRaidplan } = require("../../lib/raid-helper/get-raidplan");

async function executeWithGuildId(interaction, guildId) {
  const guild = await interaction.client.guilds.fetch(guildId);
  return cleanupForGuild(interaction, guild);
}

async function executeWithInteractionGuild(interaction) {
  return cleanupForGuild(interaction, interaction.guild);
}

async function cleanupForGuild(interaction, guild) {
  const roles = await guild.roles.fetch();
  const rolesToDelete = roles.filter((role) =>
    role.name.endsWith("[fshybot]"),
  );
  let menuOptions = rolesToDelete.map((role) => {
    // attributes come from the raidhelper api docs
    return new StringSelectMenuOptionBuilder()
      .setLabel(role.name)
      .setValue(role.id);
  });

  const menu = new StringSelectMenuBuilder()
    .setCustomId("cleanup-menu")
    .setPlaceholder("Choose a role for cleanup")
    .addOptions(menuOptions);
  const row = new ActionRowBuilder().addComponents(menu);
  const response = await interaction.reply({
    content: "pick event!",
    components: [row],
    withResponse: true,
    flags: MessageFlags.Ephemeral,
  });
  const collector = response.resource.message.createMessageComponentCollector(
    { componentType: ComponentType.StringSelect, time: 3_600_000 },
  );

  collector.on("collect", async (i) => {
    const roleId = i.values[0];
    const role = await guild.roles.fetch(roleId);
    const eventName = role.name.replace(" [fshybot]", "");
    console.log(eventName);
    const channelName =
      eventName.toLowerCase().replaceAll(/\W+/g, "-") + "-fshybot";
    console.log(channelName);

    const channels = await guild.channels.fetch();
    const channelToDelete = channels.find(
      (channel) => channel.name === channelName,
    );

    if (channelToDelete) {
      guild.channels.delete(channelToDelete.id);
    }

    if (role) {
      guild.roles.delete(role.id);
    }

    try {
      await interaction.editReply({
        content: "cleaned up",
        components: [],
        flags: MessageFlags.Ephemeral,
      });
    } catch (e) {}
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fshycleanup")
    .setDescription("Cleans up temporary channels created with fshybot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("guildid")
        .setDescription("Guild ID to run the cleanup against (defaults to current guild)")
        .setRequired(false),
    ),
  async execute(interaction) {
    const guildId = interaction.options.getString("guildid");
    if (guildId) {
      return executeWithGuildId(interaction, guildId);
    }
    return executeWithInteractionGuild(interaction);
  },
};
