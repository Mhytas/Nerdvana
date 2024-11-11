const { PermissionFlagsBits, ChannelType, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    
    name: "recreer",
    description: "Permet de recréer un salon",
    type: 1,
    utilisation: "/recreer [salon]",
    permission: PermissionFlagsBits.ManageChannels,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: "salon",
            description: "Salon à recréer",
            required: false,
            channelTypes: [ChannelType.GuildText],
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel

        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return await message.reply({content: "Pas de salon trouvé !", ephemeral: true})

        let channel_name = channel.name

        await channel.clone()
        await channel.delete()

        await message.reply({content: `Le salon ${channel_name} a bien recréer !`, ephemeral: true})
    }
}