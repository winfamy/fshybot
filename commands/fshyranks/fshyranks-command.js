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
            
        }
    },
  };
  