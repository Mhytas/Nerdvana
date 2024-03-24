const Discord = require("discord.js")

module.exports = {

    name: "uptime",
    description: "Permet de voir l'uptime du bot",
    type: 1,
    utilisation: "/uptime",
    ownerOnly: false,
    permission: "Aucune",
    dm: true,
    category: "Informations",

    async run(bot, message, args, db) {

        let days = Math.floor((bot.uptime / (1000 * 60 * 60 * 24)) % 60).toString();
        let hours = Math.floor((bot.uptime / (1000 * 60 * 60)) % 60).toString();
        let minuts = Math.floor((bot.uptime / (1000 * 60)) % 60).toString();
        let seconds = Math.floor((bot.uptime / 1000) % 60).toString();

        let Embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Uptime de ${bot.user.username}`)
        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
        .setDescription(`<@${bot.user.id}> est demaré depuis le <t:${Math.floor(parseInt(Date.now() - bot.uptime) / 1000)}:F>`) //*(<t:${Math.floor(parseInt(Date.now()) / 1000)}:R>)*
        .setTimestamp()
        .addFields({name: `__Jours :__ \`${days}\``, value: ` `})
        .addFields({name: `__Heures :__ \`${hours}\``, value: ` `})
        .addFields({name: `__Minutes :__ \`${minuts}\``, value: ` `})
        .addFields({name: `__Secondes :__ \`${seconds}\``, value: ` `})
        .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({ ephemeral: true})})

        await message.reply({embeds: [Embed], ephemeral: true})
    }
}