//Importation des modules
const Discord = require("discord.js")
const { PermissionFlagsBits, ChannelType, ApplicationCommandOptionType } = require("discord.js")
require('dotenv').config();

//Importations des variables true et false depuis le fichiers .env
let CHANNEL_RENEW_OWERONLY = process.env.CHANNEL_RENEW_OWERONLY === "true"
let CHANNEL_RENEW_DM = process.env.CHANNEL_RENEW_DM === "true"
let CHANNEL_RENEW_OP1_REQUIRE = process.env.CHANNEL_RENEW_OP1_REQUIRE === "true"
let CHANNEL_RENEW_OP1_AUTOCOMPLETE = process.env.CHANNEL_RENEW_OP1_AUTOCOMPLETE === "true"
let CHANNEL_RENEW_PHRASE_NO_CHANNEL_EPHEMERAL = process.env.CHANNEL_RENEW_PHRASE_NO_CHANNEL_EPHEMERAL === "true"

module.exports = {
    
    //Options et informations de la commandes
    name: process.env.CHANNEL_RENEW_NAME,
    description: process.env.CHANNEL_RENEW_DESCRIPTION,
    type: 1,
    utilisation: process.env.CHANNEL_RENEW_UTILISATION,
    permission: PermissionFlagsBits.ManageChannels,
    ownerOnly: CHANNEL_RENEW_OWERONLY,
    dm: CHANNEL_RENEW_DM,
    category: process.env.CHANNEL_RENEW_CATEGORY,
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: process.env.CHANNEL_RENEW_OP1_NAME,
            description: process.env.CHANNEL_RENEW_OP1_DESCRIPTION,
            required: CHANNEL_RENEW_OP1_REQUIRE,
            channelTypes: [ChannelType.GuildText],
            autocomplete: CHANNEL_RENEW_OP1_AUTOCOMPLETE
        }
    ],

    async run(bot, message, args, db) {
        
        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel;
        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply({content: process.env.CHANNEL_RENEW_PHRASE_NO_CHANNEL, ephemeral: CHANNEL_RENEW_PHRASE_NO_CHANNEL_EPHEMERAL})

        channel.clone()
        channel.delete()

        message.reply({content: `Le salon ${channel.name} a bien clonné !`, ephemeral: true})
        
    }
}