const { EmbedBuilder } = require("discord.js")

module.exports = async (bot) => {

    const embed_say_rien = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - Say - Message - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Ton message est vide, tu ne peux pas l'envoyer !`)
    .setTimestamp()
    .setFooter({text: "Say"})

    return embed_say_rien;
}