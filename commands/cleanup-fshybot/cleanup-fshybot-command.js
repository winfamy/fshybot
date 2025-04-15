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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fshycleanup")
    .setDescription("Cleans up temporary channels created with fshybot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const roles = await interaction.guild.roles.fetch();
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
      const role = await interaction.guild.roles.fetch(roleId);
      const eventName = role.name.replace(" [fshybot]", "");
      const channelName =
        eventName.toLowerCase().replaceAll(" ", "-") + "-fshybot";

      const channels = await interaction.guild.channels.fetch();
      const channelToDelete = channels.find(
        (channel) => channel.name === channelName,
      );
      interaction.guild.channels.delete(channelToDelete.id);
      interaction.guild.roles.delete(role.id);

      await interaction.editReply({
        content: "cleaned up",
        components: [],
        flags: MessageFlags.Ephemeral,
      });
    });
  },
};
