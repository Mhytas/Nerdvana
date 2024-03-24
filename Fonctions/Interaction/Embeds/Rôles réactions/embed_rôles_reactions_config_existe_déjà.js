const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme, role, nombre) => {

    const embed_rôles_reactions_config_existe_déjà = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Configuration - Numéro ${nombre} - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le rôle <@&${role}> est déjà attribué au rôle réaction **${nombre}**`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_rôles_reactions_config_existe_déjà;
}