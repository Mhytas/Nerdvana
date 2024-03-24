const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, salon, lien_msg, message) => {

    if(message === "envoyer") message = `[Le message](${lien_msg}) a bien été envoyé dans ${salon} ! Si tu veux le modifier tu peux faire </say modifier:1197637613968949280> !`
    if(message === "modifier") message = `[Le message](${lien_msg}) a bien été modifier dans ${salon} ! Si tu veux le remodifier tu peux faire </say modifier:1197637613968949280> !`

    const embed_say_réussi = new EmbedBuilder()
    .setColor("DarkGreen")
    .setAuthor({
        name: `${bot.user.username} - Say - Message - Réussite`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(message)
    .setTimestamp()
    .setFooter({text: "Say"})

    return embed_say_réussi;
}