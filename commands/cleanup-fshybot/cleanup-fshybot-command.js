const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fshycleanup")
    .setDescription("Cleans up temporary channels created with fshybot"),
  async execute(interaction) {
    const channels = await interaction.guild.channels.fetch();
    const channelsToDelete = channels.filter((channel) =>
      channel.name.startsWith("fshybot"),
    );

    console.log(channelsToDelete);
    channelsToDelete.map((channel) => console.log(channel.name));
    channelsToDelete.map((channel) =>
      interaction.guild.channels.delete(channel.id),
    );

    const roles = await interaction.guild.roles.fetch();
    const rolesToDelete = roles.filter((role) =>
      role.name.startsWith("[fshybot] "),
    );
    rolesToDelete.map((role) => console.log(role.name));
    rolesToDelete.map((role) => interaction.guild.roles.delete(role.id));

    const response = await interaction.reply({
      content: "cleaned up",
      components: [],
      flags: MessageFlags.Ephemeral,
    });
  },
};
