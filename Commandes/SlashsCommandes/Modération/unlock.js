const Discord = require("discord.js")
const { PermissionFlagsBits, ApplicationCommandOptionType, ChannelType } = require("discord.js");

module.exports = {

    name: "unlock",
    description: "Permet d'unlock un channel",
    utilisation: "/unlock [raison] [role] (salon)",
    type: 1,
    permission: PermissionFlagsBits.ManageChannels,
    ownerOnly: false,
    category: "Modération",
    dm: false,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "raison",
            description: "La raison du unlock",
            required: true,
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "Le rôle à unlock",
            required: true,
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.Channel,
            name: "salon",
            description: "Le salon à unlock",
            channelTypes: [ChannelType.GuildText],
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {
        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel;
        if(!message.guild.channels.cache.get(channel.id)) return message.reply({content: "Pas de salon trouvé !", ephemeral: true})
        if(channel.type !== Discord.ChannelType.GuildText && channel.type !== Discord.ChannelType.PublicThread && channel.type !== Discord.ChannelType.PrivateThread) return message.reply({content: "Vérifie que tu as bien mis un salon textuel !", ephemeral: true})
        
        let reason = args.getString("raison")
        if(!reason) return message.reply ({content: "Aucune raison fournie !", ephemeral: true})

        let role = args.getRole("role")
        if(role && !message.guild.roles.cache.get(role.id)) return message.reply({content: "Pas de rôle !", ephemeral: true})
        if(!role) role = message.guild.roles.everyone;

        if(channel.permissionOverwrites.cache.get(role.id)?.allow.toArray(false).includes("SendMessages")) return message.reply({content: `Le rôle \`${role.name}\` est déjà unlock dans le salon ${channel}`, ephemeral: true})

        if(channel.permissionOverwrites.cache.get(role.id)) await channel.permissionOverwrites.edit(role.id, {SendMessages: true})
        else await channel.permissionOverwrites.create(role.id, {SendMessages: true})

        message.reply({ content: `Le rôle **\`${role.name}\`** a été **UNLOCK** dans le salon **${channel}** pour la raison **\`${reason}\`** !`, ephemeral: true })
        channel.send(`Ce salon a été **UNLOCK** pour le rôle **\`${role.name}\`** par le modérateur <@${message.user.id}> pour la raison **\`${reason}\`** !`)
    }
}