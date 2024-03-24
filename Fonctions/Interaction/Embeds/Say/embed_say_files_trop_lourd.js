const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme, attachment_name) => {

    const embed_say_files_trop_lourd = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Files - Erreur taille`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`En raison de la taille maximun de **25Mo par fichier**, je ne peux pas envoyer ton message car ton fichier **${attachment_name}** dépasse cette limite !`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_say_files_trop_lourd;
}