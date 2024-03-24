const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async (number) => {
    let disabled_ajout = false
    let disabled_supprimer = false
    let text = "Ajouter"

    if(parseInt(number) <= 0) disabled_supprimer = true
    if(parseInt(number) >= 25) disabled_ajout = true
    if(parseInt(number) === 0) text = "Créer"

    const boutons_config_rôles_réactions_gérer = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`retour_rôles_réactions`)
        .setEmoji("◀")
        .setLabel(`Retour`)
        .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`nouveau_rôle_rôles_réactions`)
        .setEmoji("➕")
        .setLabel(`${text} un rôle réaction`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled_ajout)
    )
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`supprimer_rôle_rôles_réactions`)
        .setEmoji("✏")
        .setLabel("Supprimer un rôle réaction existant")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(disabled_supprimer)
    )

    return boutons_config_rôles_réactions_gérer

}