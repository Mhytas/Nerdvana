const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const reset_ticket = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - Configuration - ${systeme} - Reset`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Que voulez-vous reset dans le système de ticket ?`)
    .setTimestamp()
    .setFooter({text: systeme})


    return reset_ticket;
}