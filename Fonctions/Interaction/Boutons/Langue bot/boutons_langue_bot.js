const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async (langue) => {

    let success = ButtonStyle.Success
    let secondary = ButtonStyle.Secondary
    
    let style_fr = secondary
    let style_en = secondary

    if(langue === "fr") style_fr = success
    if(langue === "en") style_en = success
    
    const boutons_langue_bot = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`bouton_say_fr`)
        .setEmoji("🇫🇷")
        .setLabel("Français")
        .setStyle(style_fr)
    )
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`bouton_say_en`)
        .setEmoji("🇬🇧")
        .setLabel("English")
        .setStyle(style_en)
    )

    return boutons_langue_bot

}