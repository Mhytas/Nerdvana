const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme, role) => {

    const embed_role_reaction_message_fin_retirer = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - ${role.name} - Retirer`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le rôle <@&${role.id}> vous a bien été retiré !`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_role_reaction_message_fin_retirer;
}