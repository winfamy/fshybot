const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ComponentType,
  MessageFlags,
  createChannel,
  ChannelType,
  PermissionsBitField,
  PermissionFlagsBits,
} = require("discord.js");
const { buildEventMenu } = require("./build-event-menu");
const { getEvents } = require("../../lib/raid-helper/get-events");
const { getRaidplan } = require("../../lib/raid-helper/get-raidplan");
const { DISCORD_STANDARDS_RAIDGROUPCATEGORYID } = require("../../config.json");
const { getEvent } = require("../../lib/raid-helper/get-event");

async function executeWithGuildId(interaction, guildId) {
  const guild = await interaction.client.guilds.fetch(guildId);
  return syncForGuild(interaction, guild);
}

async function executeWithInteractionGuild(interaction) {
  return syncForGuild(interaction, interaction.guild);
}

async function syncForGuild(interaction, guild) {
  const events = await getEvents();
  const selectMenu = buildEventMenu(events);
  const row = new ActionRowBuilder().addComponents(selectMenu);
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
    interaction.editReply({
      content: `Creating channel and role...`,
      components: [],
      flags: MessageFlags.Ephemeral,
    });

    let raidPlan;
    const selectedEventId = i.values[0];

    try {
      raidPlan = await getRaidplan(selectedEventId);
      if (raidPlan.reason === "hidden comp") {
        return await interaction.editReply({
          content: `Error fetching composition. Make sure composition (https://raid-helper.xyz/raidplan/${selectedEventId}) is set to public.`,
          components: [],
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (e) {
      return await interaction.editReply({
        content: `Error fetching composition. Make sure composition (https://raid-helper.xyz/raidplan/${selectedEventId}) is set to public.`,
        components: [],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (raidPlan === null) {
      return await interaction.editReply({
        content: "Error, composition does not exist for selected event",
        components: [],
        flags: MessageFlags.Ephemeral,
      });
    }

    const event = await getEvent(selectedEventId);
    const newChannelName = event.title.toLowerCase().replaceAll(/\W+/g, "-") + "-fshybot"

    // create role
    const role = await guild.roles.create({
      name: event.title + " [fshybot]",
    });

    const categoryChannel = await guild.channels.fetch(DISCORD_STANDARDS_RAIDGROUPCATEGORYID);

    // give role permissions for channel
    const channel = await guild.channels.create({
      name: newChannelName,
      type: ChannelType.GuildText,
      parent: categoryChannel,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        { id: role.id, allow: [PermissionsBitField.Flags.ViewChannel] },
      ],
    });

    const raidPlanMembers = raidPlan.slots.map((member) => member.id);
    const guildMembers = await guild.members.fetch({
      user: raidPlanMembers,
    });

    guildMembers.map((guildMember) => {
      guildMember.roles.add(role.id);
    });

    return await interaction.editReply({
      content: "Created channel, added members to role",
      components: [],
      flags: MessageFlags.Ephemeral,
    });
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fshycreate")
    .setDescription(
      "Sets up a new role and channel based on a specific Raid Helper event",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("guildid")
        .setDescription("Guild ID to run the sync against (defaults to current guild)")
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
