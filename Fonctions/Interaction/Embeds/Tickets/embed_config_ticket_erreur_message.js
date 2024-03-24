const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_config_ticket_erreur_message = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - Configuration - ${systeme} - Message - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription("Le message n'existe pas !")
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_config_ticket_erreur_message;
}