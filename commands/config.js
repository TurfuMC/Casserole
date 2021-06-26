const { MessageEmbed, MessageReaction } = require("discord.js");

module.exports = {
  name: "config",
  description: "Modifier les paramètres du bot",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["conf"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Config = new MessageEmbed()
      .setAuthor("Configuration du serveur", client.config.IconURL)
      .setColor("RANDOM")
      .addField("Prefix", GuildDB.prefix, true)
      .addField("Rôle DJ", GuildDB.DJ ? `<@&${GuildDB.DJ}>` : "Pas encore défini", true)
      .setDescription(`
Que voulez-vous modifier ?

:one: - Préfixe du serveur
:two: - Rôle DJ
`);

    let ConfigMessage = await message.channel.send(Config);
    await ConfigMessage.react("1️⃣");
    await ConfigMessage.react("2️⃣");
    let emoji = await ConfigMessage.awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        ["1️⃣", "2️⃣"].includes(reaction.emoji.name),
      { max: 1, errors: ["time"], time: 30000 }
    ).catch(() => {
      ConfigMessage.reactions.removeAll();
      client.sendTime(
        message.channel, "❌ | **Vous avez mis trop de temps à répondre. Si vous souhaitez modifier les paramètres, exécutez à nouveau la commande !**"
      );
      ConfigMessage.delete(Config);
    });
    let isOk = false;
    try {
      emoji = emoji.first();
    } catch {
      isOk = true;
    }
    if (isOk) return; //im idiot sry ;-;
    /**@type {MessageReaction} */
    let em = emoji;
    ConfigMessage.reactions.removeAll();
    if (em._emoji.name === "1️⃣") {
      await client.sendTime(message.channel, "Par quoi voulez-vous changer le préfixe ?");
      let prefix = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!prefix.first())
        return client.sendTime(message.channel, "Tu as mis trop de temps à répondre.");
      prefix = prefix.first();
      prefix = prefix.content;

      await client.database.guild.set(message.guild.id, {
        prefix: prefix,
        DJ: GuildDB.DJ,
      });

      client.sendTime(
        message.channel, `Préfixe de guilde enregistré avec succès en tant que \`${prefix}\``
      );
    } else {
      await client.sendTime(
        message.channel, "Veuillez mentionner le rôle que vous souhaitez me donner."
      );
      let role = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!role.first())
        return client.sendTime(message.channel, "Tu as mis trop de temps à répondre.");
      role = role.first();
      if (!role.mentions.roles.first())
        return client.sendTime(
          message.channel, "Veuillez mentionner le rôle que vous souhaitez pour les DJ uniquement."
        );
      role = role.mentions.roles.first();

      await client.database.guild.set(message.guild.id, {
        prefix: GuildDB.prefix,
        DJ: role.id,
      });

      client.sendTime(
        message.channel, "Préfixe de guilde enregistré avec succès en tant que <@&" + role.id + ">"
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "prefix",
        description: "Vérifiez le préfixe du bot",
        type: 1,
        required: false,
        options: [
          {
            name: "symbol",
            description: "Définir le préfixe du bot",
            type: 3,
            required: false,
          },
        ],
      },
      {
        name: "dj",
        description: "Vérifiez le rôle de DJ",
        type: 1,
        required: false,
        options: [
          {
            name: "role",
            description: "Définir le rôle de DJ",
            type: 8,
            required: false,
          },
        ],
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
      let config = interaction.data.options[0].name;
      let member = await interaction.guild.members.fetch(interaction.user_id);
      //TODO: if no admin perms return...
      if (config === "prefix") {
        //prefix stuff
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          //has prefix
          let prefix = interaction.data.options[0].options[0].value;
          await client.database.guild.set(interaction.guild.id, {
            prefix: prefix,
            DJ: GuildDB.DJ,
          });
          client.sendTime(interaction, `Le préfixe est maintenant défini sur \`${prefix}\``);
        } else {
          //has not prefix
          client.sendTime(interaction, `Le préfixe de ce serveur est \`${GuildDB.prefix}\``);
        }
      } else if (config === "djrole") {
        //DJ role
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          let role = interaction.guild.roles.cache.get(
            interaction.data.options[0].options[0].value
          );
          await client.database.guild.set(interaction.guild.id, {
            prefix: GuildDB.prefix,
            DJ: role.id,
          });
          client.sendTime(
            interaction, `Le rôle DJ de ce serveur a été modifié avec succès en ${role.name}`
          );
        } else {
          /**
           * @type {require("discord.js").Role}
           */
          let role = interaction.guild.roles.cache.get(GuildDB.DJ);
          client.sendTime(interaction, `Le rôle DJ de ce serveur est ${role.name}`);
        }
      }
    },
  },
};
