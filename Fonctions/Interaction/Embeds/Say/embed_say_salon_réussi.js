const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, salon) => {

    const embed_say_réussi = new EmbedBuilder()
    .setColor("DarkGreen")
    .setAuthor({
        name: `${bot.user.username} - Say - Salon - Réussite`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le salon a bien été configuré sur <#${salon}> !`)
    .setTimestamp()
    .setFooter({text: "Say"})

    return embed_say_réussi;
}