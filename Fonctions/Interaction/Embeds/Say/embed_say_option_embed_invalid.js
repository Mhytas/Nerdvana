const { EmbedBuilder } = require("discord.js")

module.exports = async (bot) => {

    const embed_say_option_embed_invalid = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - Say - Message - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription("La valeur que tu as renté dans l'option **Embed** n'existe pas !")
    .setTimestamp()
    .setFooter({text: "Say"})

    return embed_say_option_embed_invalid;
}