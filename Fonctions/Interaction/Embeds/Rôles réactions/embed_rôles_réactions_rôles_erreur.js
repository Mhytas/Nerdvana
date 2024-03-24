const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme, selectedCommand, description) => {

    if(description === "attribuer") description = `Je ne peux pas attribuer le <@&${selectedCommand}> à un membre !`
    if(description === "mien") description = `<@&${selectedCommand}> est mon rôle le plus haut, je ne peux pas l'attriuer à un membre !`
    if(description === "suppérieur") description = `<@&${selectedCommand}> est suppérieur à mon rôle le plus haut, je ne peux donc pas l'attriuer à un membre !`

    const embed_rôles_réactions_rôles_erreur = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(description)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_rôles_réactions_rôles_erreur;
}