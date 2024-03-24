const { EmbedBuilder } = require("discord.js")

module.exports = async (bot) => {

    const embed_say_not_message = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - Say - Message - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription("Tu ne peux pas envoyer de message vide !")
    .setTimestamp()
    .setFooter({text: "Say"})

    return embed_say_not_message;
}