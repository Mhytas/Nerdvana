const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async (langue, fr, en) => {
    let disabled = true
    if(langue === "fr" && fr !== "false") disabled = false
    if(langue === "en" && en !== "false") disabled = false

    const boutons_rôles = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`config_rôles`)
        .setEmoji("◀")
        .setLabel("Retour")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`supprimer_rôles ${langue}`)
        .setEmoji("✖")
        .setLabel("Supprimer")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(disabled)
    )

    return boutons_rôles

}