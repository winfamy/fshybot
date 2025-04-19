const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { DISCORD_TOKEN } = require("./config.json");
const { getEvents } = require("./lib/raid-helper/get-events");
const { getEvent } = require("./lib/raid-helper/get-event");
const { getRaidplan } = require("./lib/raid-helper/get-raidplan");
const { generateAccessToken, pullGuildCharacterPage } = require("./lib/warcraftlogs/");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith("command.js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith("event.js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(DISCORD_TOKEN).then(async () => {
  let access_token = await generateAccessToken();
  console.log(access_token);
  console.log(await pullGuildCharacterPage(access_token, 2013, 1, "dps"))
});
