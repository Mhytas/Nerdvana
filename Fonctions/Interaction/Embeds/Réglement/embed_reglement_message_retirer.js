const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme, role) => {

    const embed_role_reaction_message_retirer = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - ${role.name} - Retirer`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Vous ne pouvez pas vous enlevez le rôle <@&${role.id}> !`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_role_reaction_message_retirer;
}