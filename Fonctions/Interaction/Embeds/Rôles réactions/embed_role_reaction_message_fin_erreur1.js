const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_role_reaction_message_fin_erreur1 = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le rôle sélectionné est introuvable, il a donc été enlevé du rôle réaction !`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_role_reaction_message_fin_erreur1;
}