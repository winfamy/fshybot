const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  buildEventMenu(eventArray) {
    let menuOptions = eventArray.map((event) => {
      // attributes come from the raidhelper api docs
      return new StringSelectMenuOptionBuilder()
        .setLabel(event.title)
        .setValue(event.id);
    });

    return new StringSelectMenuBuilder()
      .setCustomId("event-menu")
      .setPlaceholder("Choose an event")
      .addOptions(menuOptions);
  },
};
