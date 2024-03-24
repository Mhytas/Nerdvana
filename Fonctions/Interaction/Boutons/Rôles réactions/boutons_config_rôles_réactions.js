const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async () => {

    const boutons_config_rôles_réactions = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`indinquez_role_reaction`)
        .setEmoji("✍")
        .setLabel("Indiquez le lien du message")
        .setStyle(ButtonStyle.Secondary)
    )
    
    return boutons_config_rôles_réactions
}