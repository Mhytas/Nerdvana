const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

    let db = bot.db;

    if(interaction.isButton()) {
        if(interaction.customId === "panel") {
            await db.query(`SELECT * FROM server WHERE guild = '${interaction.guild.id}'`, async (err, req) => {

                let reloadPanel = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("panel")
                        .setEmoji("🔄")
                        .setLabel("Actualiser")
                        .setStyle(Discord.ButtonStyle.Success)
                )

                let AntiraidEmoji, AntiMessagesEmoji, CaptchaEmoji;

                if(req[0].antiraid === "false") AntiraidEmoji = "❌"; else { AntiraidEmoji = "✅" }
                if(req[0].antimessages === "false") AntiMessagesEmoji = "❌"; else { AntiMessagesEmoji = "✅" }
                if(req[0].captcha === "false") CaptchaEmoji = "❌"; else { CaptchaEmoji = `<#${req[0].captcha}>` }

                let panelEmbed = new Discord.EmbedBuilder()
                    .setTitle("Panel des configurations du bot")
                    .setColor(bot.color)
                    .addFields(
                        {name: `Antiraid`, value: AntiraidEmoji},
                        {name: `AntiMessages`, value: AntiMessagesEmoji},
                        {name: `Captcha`, value: CaptchaEmoji},
                    )

                await interaction.deferUpdate()
                await interaction.editReply({embeds: [panelEmbed], components: [reloadPanel]})
            })            
        }
    }
}
