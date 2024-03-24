const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme, role) => {

    const embed_reglement_message_attribué = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - ${role.name} - Attribué`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le rôle <@&${role.id}> vous a bien été attribué !`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_reglement_message_attribué;
}