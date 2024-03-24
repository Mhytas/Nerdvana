const { EmbedBuilder } = require("discord.js")

module.exports = async (bot) => {

    const embed_say_say_2000 = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - Say - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription("Ton contenu dépasse la limite maximun de 2000 caractères, je ne peux donc pas l'envoyer !")
    .setTimestamp()
    .setFooter({text: "Say"})

    return embed_say_say_2000;
}