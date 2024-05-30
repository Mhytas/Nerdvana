const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const i18n = require('i18n');

module.exports = {

    name: "ping",
    name_localizations:({
        'fr': 'ping',
        'en-US': 'ping',
        'en-GB': 'ping',
    }),
    description: "Obtenez le ping du bot",
    description_localizations:({
        'fr': 'Obtenez le ping du bot',
        'en-US': 'Get the bot\'s ping',
        'en-GB': 'Get the bot\'s ping',
    }),
    type: 1,
    utilisation: "/ping",
    permission: "Aucune",
    ownerOnly: false,
    dm: true,
    category: "Informations",
    options: [],

    async run(bot, message, args, db) {
        await db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req_langue) => {
            let langue = req_langue[0].langue
            if(langue === "fr") i18n.setLocale("fr")
            if(langue === "en") i18n.setLocale("en")
            
            const reloadPing = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("ping")
                .setEmoji("🔄")
                .setLabel(i18n.__("ping_actualiser"))
                .setStyle(ButtonStyle.Success)
            )

            const APIPing = bot.ws.ping
            let APIemoji
            if(APIPing <= 200) APIemoji = "🟢"
            if(APIPing <= 400 && APIPing >= 200) APIemoji = "🟠"
            if(APIPing >= 400) APIemoji = "🔴"

            const PingEmbed = new EmbedBuilder()
            .setDescription(APIemoji + i18n.__("ping_message") + `**${APIPing}ms**`)
            .setColor(bot.color)

            await message.reply({embeds: [PingEmbed], components: [reloadPing], ephemeral: true})
        })
    }
}