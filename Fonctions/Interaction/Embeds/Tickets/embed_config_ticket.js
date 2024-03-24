const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, salon, logs_ticket, cat_attente, cat_en_cours, cat_fini, role_ticket, number_id, systeme) => {

    const embed_config_ticket = new EmbedBuilder()
    .setColor(bot.color)
    .setDescription(`Que souhaitez-vous modifier ?`)
    .setFields(
        [{
            name: `\`🎫\` Salon`,
            value: salon,
            inline: true,
        }, {
            name: `\`📝\` Logs`,
            value: logs_ticket,
            inline: true,
        }, {
            name: `\`⏳\` Catégorie en attente`,
            value: cat_attente,
            inline: true,
        }, {
            name: `\`📪\` Catégorie en cours`,
            value: cat_en_cours,
            inline: true,
        }, {
            name: `\`✅\` Catégorie fini`,
            value: cat_fini,
            inline: true,
        }, {
            name: `\`🤵\` Rôles ticket`,
            value: role_ticket,
            inline: true,
        }, {
            name: `\`🔢\`Numéro ticket`,
            value: number_id,
            inline: true
        }])
    .setTimestamp()
    .setAuthor({
        name: `${bot.user.username} - Configuration - ${systeme}`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setFooter({text: systeme})

    return embed_config_ticket;
}