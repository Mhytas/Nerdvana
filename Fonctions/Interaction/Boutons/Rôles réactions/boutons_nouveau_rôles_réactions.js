const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async () => {

    const boutons_nouveau_rôles_réactions = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`retour_config_role_reaction`)
        .setEmoji("✖")
        .setLabel("Annulé")
        .setStyle(ButtonStyle.Danger)
    )
    
    return boutons_nouveau_rôles_réactions
}