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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fshyupdate")
    .setDescription(
      "Sets up a new role and channel based on a specific Raid Helper event",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
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
      const selectedEventId = i.values[0];
      const raidPlan = await getRaidplan(selectedEventId);
      if (raidPlan === null) {
        return await interaction.editReply({
          content: "Error, raid plan does not exist for selected event",
          components: [],
          flags: MessageFlags.Ephemeral,
        });
      }

      const event = await getEvent(selectedEventId);
      const newChannelName = event.title.toLowerCase().replaceAll(" ", "-");

      // create role
      const guildRoles = await interaction.guild.roles.fetch();
      const role = guildRoles.find(
        (role) => role.name === event.title + " [fshybot]",
      );

      const raidPlanMembers = raidPlan.raidDrop.map((member) => member.userid);
      const roleMembersToDelete = role.members.filter(
        (member) => !raidPlanMembers.includes(member.id),
      );
      roleMembersToDelete.map((member) => member.roles.remove(role.id));

      const guildMembers = await interaction.guild.members.fetch({
        user: raidPlanMembers,
      });

      guildMembers.map((guildMember) => {
        guildMember.roles.add(role.id);
      });

      return await interaction.editReply({
        content: "Updated role members",
        components: [],
        flags: MessageFlags.Ephemeral,
      });
    });
  },
};
