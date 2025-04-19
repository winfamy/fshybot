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
          //TODO 
        }
    },
  };
  
