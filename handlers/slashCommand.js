const fs = require("fs");
const chalk = require("chalk");

const { PermissionsBitField } = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");

const { token, clientId, guildId } = require("../config.json");

const rest = new REST({ version: "9" }).setToken(token);

module.exports = (client) => {
  const slashCommands = [];

  fs.readdirSync("./slashCommands/").forEach(async (dir) => {
    const files = fs
      .readdirSync(`./slashCommands/${dir}/`)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const slashCommand = require(`../slashCommands/${dir}/${file}`);
      slashCommands.push({
        name: slashCommand.name,
        description: slashCommand.description,
        type: slashCommand.type,
        options: slashCommand.options ? slashCommand.options : null,
        default_permission: slashCommand.default_permission
          ? slashCommand.default_permission
          : null,
        default_member_permissions: slashCommand.default_member_permissions
          ? PermissionsBitField.resolve(
              slashCommand.default_member_permissions
            ).toString()
          : null,
      });

      if (slashCommand.name) {
        client.slashCommands.set(slashCommand.name, slashCommand);
      } else {
        console.log(file.split(".js")[0] + " has no name!");
      }
    }
  });

  (async () => {
    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: slashCommands,
      });
      // Remove the above line and uncomment the following line to make global slash commands.
      //   await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
      console.log(chalk.yellow("Slash Commands • Registered"));
    } catch (error) {
      console.log(error);
    }
  })();
};
