const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, salon, systeme, langue, number) => {
    if(langue === "fr") langue = "Français"
    if(langue === "en") langue = "English"

    let role = "rôles réactions configurés"
    if(parseInt(number) === 0 || parseInt(number) === 1) role = "rôle réaction configuré"

    const acceuil_config = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - ${systeme}`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Bienvenue dans la commande de configuration de <@${bot.user.id}>.\n
    Grâce à cette commande, vous pourrez configurer les différents systèmes proposés dans le sélecteur que vous trouverez ci-dessous.`)
    .setFields([
    {
        name: `\`🎫\` Tickets`,
        value: salon,
        inline: true,
    }, {
        name: `\`🗣\` Langue du bot`,
        value: langue,
        inline: true,
    }, {
        name: `\`🎭\` Rôles réactions`,
        value: `**${number}** ${role}`,
        inline: true,
    }
    ])
    .setTimestamp()
    .setFooter({text: systeme})

    return acceuil_config;
}