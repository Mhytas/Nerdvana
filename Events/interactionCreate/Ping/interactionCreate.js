const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js")
const i18n = require('i18n');

module.exports = async (bot, interaction) => {
    if(interaction.isButton()) {
        if(interaction.customId === "ping") {
            await bot.db.query(`SELECT * FROM server WHERE guild = '${interaction.guild.id}'`, async (err, req_langue) => {
                let langue = req_langue[0].langue
                if(langue === "fr") i18n.setLocale("fr")
                if(langue === "en") i18n.setLocale("en")

                const reloadPing = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setCustomId("ping")
                    .setEmoji("🔄")
                    .setLabel(i18n.__("ping_actualiser"))
                    .setStyle(ButtonStyle.Success)
                )
                
                // Ping de l'API de discord*/
                let APIPing = bot.ws.ping
                let APIemoji;
                if(APIPing < 200) { APIemoji = "🟢" }
                else if(APIPing < 400 && APIPing >= 200) { APIemoji = "🟠" }
                else if(APIPing >= 400) {APIemoji = "🔴" }
        
                let PingEmbed = new EmbedBuilder()
                    .setDescription(APIemoji + i18n.__("ping_message") + `**${APIPing}ms**`)
                    .setColor(bot.color)

                try { interaction.deferUpdate(), console.log("test") } catch {console.log("test2")}
                interaction.followUp({embeds: [PingEmbed], components: [reloadPing]})
            })
        }
    }
}
