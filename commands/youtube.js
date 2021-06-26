const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "youtube",
    description: "Démarre une session YouTube Together",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["yt"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {require("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Vous devez être dans un canal vocal pour jouer quelque chose !**");
        if(!message.member.voice.channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE"))return client.sendTime(message.channel, "❌ | **Le bot n'a pas l'autorisation pour la création d'une invitation**");

        let Invite = await message.member.voice.channel.activityInvite("755600276941176913")//Made using discordjs-activity package
        let embed = new MessageEmbed()
        .setAuthor("YouTube Together", "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1")
        .setColor("#FF0000")
        .setDescription(`
Utiliser **YouTube Together** vous pouvez regarder YouTube avec vos amis dans le même canale vocale. Cliquez sur *Rejoindre YouTube Together* pour participer !

__**[Rejoignez YouTube Together](https://discord.com/invite/${Invite.code})**__

⚠ **Note:** Cela ne fonctionne sur ordinateur
`)
        message.channel.send(embed)
    },
    SlashCommand: {
        options: [
        ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | Vous devez être dans un canal vocal pour utiliser cette commande.");
            if(!member.voice.channel.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE"))return client.sendTime(interaction, "❌ | **Le bot n'a pas l'autorisation pour la création d'une invitation**");

            let Invite = await member.voice.channel.activityInvite("755600276941176913")//Made using discordjs-activity package
            let embed = new MessageEmbed()
            .setAuthor("YouTube Together", "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1")
            .setColor("#FF0000")
            .setDescription(`
Utiliser **YouTube Together** vous pouvez regarder YouTube avec vos amis dans le même canale vocale. Cliquez sur *Rejoindre YouTube Together* pour participer !

__**[Rejoignez YouTube Together](https://discord.com/invite/${Invite.code})**__

⚠ **Note:** Cela ne fonctionne sur ordinateur
`)
            interaction.send(embed.toJSON())
        },
    },
};
