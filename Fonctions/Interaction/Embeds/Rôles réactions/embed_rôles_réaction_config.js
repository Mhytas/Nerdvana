const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme) => {

    const embed_rôles_réaction_config = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - ${systeme} - Configuration`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setTitle("Indiquez quel message souhaitez vous utiliser pour le rôle-réaction en indiquand le lien du message.")
    .setDescription(`:warning: Attention le message indiqué sera supprimé et remplacé par celui de <@${bot.user.id}> ! \n:information_source: Pour indiquer le lien d'un message, cliquez sur les points de suspensions à droite du message puis **[Copier le lien du message](https://cdn.discordapp.com/attachments/1101848380482789437/1200920505969037492/image.png?ex=65c7ef60&is=65b57a60&hm=d910c29618ff846a5c916a7577ef30e1615d9c8516aedbd06cfee2cf54d86da4&)**.`)
    .setTimestamp()
    .setFooter({text: systeme})

    return embed_rôles_réaction_config;
}