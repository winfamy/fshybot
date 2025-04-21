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
const { buildEmbed } = require("./build-embed");
const { DISCORD_STANDARDS_RANKINGCHANNELID } = require("../../config.json");
const { getMetricData } = require("../../lib/warcraftlogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fshyranks")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("Update guild ranks")
        .addStringOption((option) =>
          option
            .setName("metric")
            .setDescription("The metric of which to pull from WCL.")
            .setRequired(true)
            .addChoices(
              { name: "Damage", value: "dps" },
              { name: "Healing", value: "hps" },
            ),
        ),
    )
    .setDescription(
      "Sets up a new role and channel based on a specific Raid Helper event",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "update") {
      let metric = interaction.options.getString("metric");
      let metricReadableString = metric === "dps" ? "Damage" : "Healing";
      let date = new Date();
      let dateAsString = date.toLocaleDateString("en-US");
      let rankingChannel = await interaction.guild.channels.fetch(
        DISCORD_STANDARDS_RANKINGCHANNELID,
      );

      await interaction.reply({
        content:
          "Pulling WCL data ... this may take a few seconds - few minutes.",
        flags: MessageFlags.Ephemeral,
      });

      let rankingData = await getMetricData(metric);
      console.log(rankingData);
      const embed = buildEmbed(rankingData, dateAsString);
      await rankingChannel.threads.create({
        name: `${metricReadableString} Rankings - ${dateAsString}`,
        message: { embeds: [embed] },
      });
    }
  },
};
