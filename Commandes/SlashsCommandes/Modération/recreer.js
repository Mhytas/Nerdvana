const { PermissionFlagsBits, ChannelType, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    
    name: "recreer",
    name_localizations:({
        'fr': 'recreer',
        'en-US': 'recreate',
        'en-GB': 'recreate',
      }),
    description: "Permet de recréer un salon",// et de sauvegarder l'ancien dans une catégorie",
    description_localizations:({
        'fr': 'Permet de recréer un salon',// et de sauvegarder l\'ancien dans une catégorie',
        'en-US': 'Allows you to recreate a room',// and save the old one in a category',
        'en-GB': 'Allows you to recreate a room',// and save the old one in a category',
    }),
    type: 1,
    utilisation: "/recreer (salon)",// (catégorie)",
    permission: PermissionFlagsBits.ManageChannels,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: "salon",
            name_localizations:({
                'fr': 'salon',
                'en-US': 'channel',
                'en-GB': 'channel',
              }),
            description: "Salon à recréer",
            description_localizations:({
                'fr': 'Salon à recréer',
                'en-US': 'Channel to recreate',
                'en-GB': 'Channel to recreate',
            }),
            required: false,
            channelTypes: [ChannelType.GuildText],
            autocomplete: false
        }/*, {
            type: ApplicationCommandOptionType.Channel,
            name: "catégorie",
            name_localizations:({
                'fr': 'catégorie',
                'en-US': 'category',
                'en-GB': 'category',
            }),
            description: "Catégorie où sauvegarder le salon",
            description_localizations:({
                'fr': 'Catégorie où sauvegarder le salon',
                'en-US': 'Category where to save the room',
                'en-GB': 'Category where to save the room',
            }),
            required: false,
            channelTypes: [ChannelType.GuildCategory],
            autocomplete: false
        }*/
    ],

    async run(bot, message, args, db) {
        
        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel
        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return await message.reply({content: "Pas de salon trouvé !", ephemeral: true})
        
        /*
        let category = args.getChannel("catégorie")
        //Prévenir l'utilisateur qu'aucune catégorie n'a été renseigné, donc son salon se supprimé
        */
        
        let channel_name = channel.name
        
        await channel.clone()
        await channel.delete()
        
        await message.reply({content: `Le salon ${channel_name} a bien recréer !`, ephemeral: true})
    }
}