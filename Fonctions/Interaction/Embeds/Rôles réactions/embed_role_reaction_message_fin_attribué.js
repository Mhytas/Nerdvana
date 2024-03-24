const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme, role) => {

    const embed_role_reaction_message_fin_attribué = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - ${role.name} - Attribué`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le rôle <@&${role.id}> vous a bien été attribué !`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_role_reaction_message_fin_attribué;
}