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

const sampleData = {
  feral: [
    { name: "fshi", rank: 1, spec: "feral" },
    { name: "fshi", rank: 2, spec: "feral" },
    { name: "fshi", rank: 3, spec: "feral" },
    { name: "fshi", rank: 4, spec: "balance" },
  ],
  warrior: [
    { name: "fshi", rank: 1, spec: "fury" },
    { name: "fshi", rank: 2, spec: "fury" },
    { name: "fshi", rank: 3, spec: "fury" },
    { name: "fshi", rank: 4, spec: "arms" },
  ],
  hunter: [
    { name: "fshi", rank: 1, spec: "marksmanship" },
    { name: "fshi", rank: 2, spec: "marksmanship" },
    { name: "fshi", rank: 3, spec: "marksmanship" },
    { name: "fshi", rank: 4, spec: "melee" },
  ]
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fshyranks")
    .addSubcommand(subcommand =>
      subcommand
        .setName('update')
        .setDescription('Update guild ranks')
    )
    .setDescription(
      "Sets up a new role and channel based on a specific Raid Helper event",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "update") {
      const embed = buildEmbed(sampleData)
      interaction.reply({ embeds: [embed] })
    }
  },
};

