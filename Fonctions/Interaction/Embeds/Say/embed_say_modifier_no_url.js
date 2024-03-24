const { EmbedBuilder } = require("discord.js")

module.exports = async (bot) => {

    const embed_say_modifier_no_url = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - Say - Message - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription("L'URL que tu as rentré ne correspond pas à un message, vérifie que tu as copier le lien du message !")
    .setTimestamp()
    .setImage("https://cdn.discordapp.com/attachments/1101848380482789437/1200920505969037492/image.png?ex=65ecd960&is=65da6460&hm=be4ff50b26eca2a22fbd32e75336a2b3d0cae1945d647657d15b4f7ee8291bfc&")
    .setFooter({text: "Say"})

    return embed_say_modifier_no_url;
}