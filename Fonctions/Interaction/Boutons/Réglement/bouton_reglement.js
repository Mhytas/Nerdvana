const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async (rôle) => {

    let rôle_disabled = false
    let rôle_text = rôle
    if(rôle === null) rôle_text = ""
    if(rôle === null) rôle_disabled = true

    const bouton_reglement = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId(`bouton_reglement ${rôle}`)
        .setEmoji("✅")
        .setLabel("J'ai lu et accepté le réglement")
        .setStyle(ButtonStyle.Success)
        .setDisabled(rôle_disabled)
    )

    return bouton_reglement

}