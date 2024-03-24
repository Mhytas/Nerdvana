const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_role_reaction_pas_lien = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`La réponse que tu as renseigné n'es pas un lien, vériifie que tu as bien [copier un lien](https://cdn.discordapp.com/attachments/1101848380482789437/1200920505969037492/image.png?ex=65ecd960&is=65da6460&hm=be4ff50b26eca2a22fbd32e75336a2b3d0cae1945d647657d15b4f7ee8291bfc&)`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_role_reaction_pas_lien;
}