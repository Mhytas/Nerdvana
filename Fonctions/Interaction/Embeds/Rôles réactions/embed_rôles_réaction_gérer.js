const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme, url, fields) => {

    const embed_rôles_réaction_gérer = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Configuration`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setTitle("Configuration du rôles réaction")
    .setURL(url)
    .setFields(fields)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_rôles_réaction_gérer;
}