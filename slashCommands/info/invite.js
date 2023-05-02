const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandType,
  ButtonStyle,
  Client,
} = require("discord.js");
const { clientId } = require("../../config.json");
module.exports = {
  name: "invite",
  description: "Get the bot's invite link",
  cooldown: 3000,
  type: ApplicationCommandType.ChatInput,
  userPerms: [],
  botPerms: [],
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async (client, interaction) => {
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;
    const embed = new EmbedBuilder()
      .setTitle("Invite me")
      .setDescription(
        `Invite the bot to your server. [Click here](${inviteUrl})`
      )
      .setColor("#03fcdb")
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: client.user.tag });

    const actionRow = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setLabel("Invite")
        .setURL(inviteUrl)
        .setStyle(ButtonStyle.Link),
    ]);
    return interaction.reply({ embeds: [embed], components: [actionRow] });
  },
};
