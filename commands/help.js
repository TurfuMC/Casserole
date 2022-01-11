const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Informations sur le bot",
  usage: "[command]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Commands = client.commands.map(
      (cmd) =>
        `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
          cmd.name
        }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    let Embed = new MessageEmbed()
            .setAuthor(
              `Commande de ${client.user.username}`,
              client.config.IconURL
            )
            .setColor(client.botconfig.EmbedColor)
            .setFooter(
              `Pour obtenir des informations sur chaque type de commande ${
                GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
              }help [Commande] | Bonne journée !`
            ).setDescription(`${Commands.join("\n")}
  
  Casserole : v${require("../package.json").version}
  [✨ Serveur de support](${
    client.botconfig.SupportServer
  }) | [GitHub](https://github.com/zendrique/Casserole) | Originale [SudhanPlayz](https://github.com/SudhanPlayz)`);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(
          message.channel,
          `❌ | Impossible de trouver cette commande.`
        );

      let embed = new MessageEmbed()
        .setAuthor(`Commande : ${cmd.name}`, client.config.IconURL)
        .setDescription(cmd.description)
        .setColor("GREEN")
        //.addField("Name", cmd.name, true)
        .addField("Alias", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Usage",
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Permissions",
          "Membre : " +
            cmd.permissions.member.join(", ") +
            "\nBot : " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Prefix - ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
          }`
        );

      message.channel.send(embed);
    }
  },

  SlashCommand: {
    options: [
      {
        name: "command",
        description: "Obtenir des informations sur une commande spécifique",
        value: "command",
        type: 3,
        required: false,
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    run: async (client, interaction, args, { GuildDB }) => {
      let Commands = client.commands.map(
        (cmd) =>
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
      );

      let Embed = new MessageEmbed()
            .setAuthor(
              `Commandes de ${client.user.username}`,
              client.config.IconURL
            )
            .setColor(client.botconfig.EmbedColor)
            .setFooter(
              `Pour obtenir des informations sur chaque type de commande ${
                GuildDB ? GuildDB.prefix : client.config.DefaultPrefix
              }help [Command] | Bonne journée !`
            ).setDescription(`${Commands.join("\n")}
  
            Casserole : v${require("../package.json").version}
    [✨ Editer par Zendrique](${
    client.config.SupportServer
  }) | [GitHub]https://github.com/Zendrique) | Originale [SudhanPlayz](https://github.com/SudhanPlayz)`);
      if (!args) return interaction.send(Embed);
      else {
        let cmd =
          client.commands.get(args[0].value) ||
          client.commands.find(
            (x) => x.aliases && x.aliases.includes(args[0].value)
          );
        if (!cmd)
          return client.sendTime(
            interaction,
            `❌ | Impossible de trouver cette commande.`
          );

        let embed = new MessageEmbed()
          .setAuthor(`Command: ${cmd.name}`, client.botconfig.IconURL)
          .setDescription(cmd.description)
          .setColor("GREEN")
          //.addField("Name", cmd.name, true)
          .addField("Aliases", cmd.aliases.join(", "), true)
          .addField(
            "Usage",
            `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
              cmd.name
            }\`${cmd.usage ? " " + cmd.usage : ""}`,
            true
          )
          .addField(
            "Permissions",
            "Membre : " +
              cmd.permissions.member.join(", ") +
              "\nBot: " +
              cmd.permissions.channel.join(", "),
            true
          )
          .setFooter(
            `Prefix - ${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }`
          );

        interaction.send(embed);
      }
    },
  },
};
