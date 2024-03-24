const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, user_ticket, categorie, reason, number_id) => {

    const embed_ouverture_ticket = new EmbedBuilder()
    .setTitle(":bell: ┇Notification")
    .setAuthor({
        name: "Support - Write-Heberg",
        url: "https://write-heberg.fr/"
    })
    .setDescription(`Ticket créé par ${user_ticket} - \`${user_ticket.id}\` concernant le sujet suivant :\n
:clipboard: ┇${categorie} - ${reason}\n
__ID Ticket :__ ${categorie} - ${reason}#${number_id}\n
*⭐️ Support Premium : [Si vous avez opté pour notre Support Premium](https://write-heberg.fr/premium), nous nous engageons à prendre en charge et intervenir dans un délai maximal de 6 heures comme la régie notre GTI.
De plus, notre GTR vous assure une coupure de vos services de moins de 24H car oui nous ne sommes pas des robots et certains événements dépassent notre champ d'action :slight_smile:.\n
:alarm_clock:┇GTR : Garantie Temps de Rétablissement
:alarm_clock:┇GTI : Garantie Temps d'Intervention\n
Pour une meilleure expérience veuillez liez votre compte client avec Discord en tappant /client dans https://discord.com/channels/1050843719156375633/1191350057954455582 :smile: afin de récuperer vos service souscrit sur notre site internet*`)
    .setColor(bot.color)
    .setThumbnail("https://cdn.discordapp.com/icons/1050843719156375633/469f2b2a473eef6300755931740c95c9.png?size=256")
    .setFooter({text: "Support - Write-Heberg"});

    return embed_ouverture_ticket;
}