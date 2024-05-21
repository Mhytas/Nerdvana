const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, systeme, langue) => {
    let langue_fr = ""
    let langue_en = ""

    if(langue === "fr") langue_fr = "Français"
    if(langue === "en") langue_fr = "Anglais"
    if(langue === "fr") langue_en = "French"
    if(langue === "en") langue_en = "English"

    const langue_bot_config = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - ${systeme}`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`
:flag_fr: Bienvenue dans le système de configuration de la langue de <@${bot.user.id}>, pour changer la langue du bot vous pouvez cliquez sur le bouton qui correspond juste en dessous ! La langue acctuel est : **${langue_fr}**\n

:flag_gb: Welcome to <@${bot.user.id}>'s language configuration system, to change the language of the bot you can click on the corresponding button just below! The current language is: **${langue_en}**`)
    .setTimestamp()
    .setFooter({text: systeme})

    return langue_bot_config;
}