const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_role_reaction_say_existe_pas = new EmbedBuilder()
    .setColor("DarkRed")
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Erreur`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Le message n'existe pas, verifie si tu as bien [copier le bon lien](https://cdn.discordapp.com/attachments/1101848380482789437/1200920505969037492/image.png?ex=65c7ef60&is=65b57a60&hm=d910c29618ff846a5c916a7577ef30e1615d9c8516aedbd06cfee2cf54d86da4&)`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_role_reaction_say_existe_pas;
}