const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_say_fields = new EmbedBuilder()
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Modifer - Fields`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription("Choisissez ici quelle field vous vous voulez **créer** / **modifier** / **supprimer**")
    .setTimestamp()
    .setFooter({text: systeme})
    .setColor(bot.color)

    return embed_say_fields;
}