const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_reglement_message_erreur1 = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le rôle du règlement est introuvable. Le bouton a donc été désactivé, merci de prévenir un membre du staff`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_reglement_message_erreur1;
}