const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_role_reaction_message_supprime2 = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le message n'existe plus !`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_role_reaction_message_supprime2;
}