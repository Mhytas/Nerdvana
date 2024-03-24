const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_reglement_message_erreur2 = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Une erreur s'est produite lors de l'attribution du rôle, merci de contacter un membre du staff !`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_reglement_message_erreur2;
}