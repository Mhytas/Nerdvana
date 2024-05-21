const Discord = require("discord.js")
const i18n = require('i18n');

module.exports = async (bot, interaction) => {
    if(interaction.isButton()) {
        if(interaction.customId === "ping") {
            await bot.db.query(`SELECT * FROM server WHERE guild = '${interaction.guild.id}'`, async (err, req_langue) => {
                let langue = req_langue[0].langue
                if(langue === "fr") i18n.setLocale("fr")
                if(langue === "en") i18n.setLocale("en")

                let reloadPing = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("ping")
                        .setEmoji("🔄")
                        .setLabel(i18n.__("ping_actualiser"))
                        .setStyle(Discord.ButtonStyle.Success)
                )
                /*const pingUser = interaction.createdTimestamp - Date.now();
                    let emojiUser;
                    if(pingUser < 200) { emojiUser = "🟢" } 
                    else if (pingUser < 400 && pingUser > 200) { emojiUser = "🟠" }
                    else if(pingUser > 400) {emojiUser = "🔴" };
                
                    // Ping de l'API de discord*/
                    let APIPing = bot.ws.ping
                    let APIemoji;
                    if(APIPing < 200) { APIemoji = "🟢" }
                    else if(APIPing < 400 && APIPing >= 200) { APIemoji = "🟠" }
                    else if(APIPing >= 400) {APIemoji = "🔴" }
        
                let PingEmbed = new Discord.EmbedBuilder()
                    .setDescription(APIemoji + i18n.__("ping_message") + `**${APIPing}ms**`)
                    .setColor(bot.color)
                    //\`${emojiUser}\` Pong ! | Votre ping : **${pingUser}ms**\n
        
                await interaction.deferUpdate()
                await interaction.editReply({embeds: [PingEmbed], components: [reloadPing]})
            })
        }
    }
}
