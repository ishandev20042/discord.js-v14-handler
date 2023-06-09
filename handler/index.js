const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const { guildid } = require("../config.json");
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
  eventFiles.map((value) => require(value));
  const slashCommands = await globPromise(
    `${process.cwd()}/SlashCommands/*/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.slashCommands.set(file.name, file);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    arrayOfSlashCommands.push(file);
  });
  client.on("ready", async () => {
    await client.guilds.cache.get(guildid).commands.set(arrayOfSlashCommands);

    // Register for all the guilds the bot is in
    // await client.application.commands.set(arrayOfSlashCommands);
  });
};
