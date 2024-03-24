const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, salon) => {

    const embed_say_salon = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - Say - Salon`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Sélectionnez le salon où sera envoyer le message en cliquant sur le select menu juste dessous ! Acttuelement le salon est configfuré dans <#${salon}> !`)
    .setTimestamp()
    .setFooter({text: "Say"})

    return embed_say_salon;
}