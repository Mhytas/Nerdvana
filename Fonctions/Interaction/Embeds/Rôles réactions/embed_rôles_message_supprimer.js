const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_rôles_message_supprimer = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Envoyer`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le message a bien été supprimé !`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_rôles_message_supprimer;
}