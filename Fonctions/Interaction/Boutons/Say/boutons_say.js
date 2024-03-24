const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async (id, timestamp_message_say, embed_timestamp, envoyer) => {

    let timestamp_message_say_style = ButtonStyle.Success

    let salon = "Salon"
    let salon_bouton = false
    if(envoyer === `envoyer_modifier_message_say ${id}`) salon = "Salon (bientôt disponnible pour modification)"
    if(envoyer === `envoyer_modifier_message_say ${id}`) salon_bouton = true

    if(timestamp_message_say === "success") timestamp_message_say_style = ButtonStyle.Success
    if(timestamp_message_say === "danger") timestamp_message_say_style = ButtonStyle.Danger

    if(timestamp_message_say === "success") timestamp_message_say = "Timestamp activer"
    if(timestamp_message_say === "danger") timestamp_message_say = "Timestamp désactiver"


    const boutons_say = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(envoyer)
        .setEmoji("✔")
        .setLabel("Envoyer")
        .setStyle(ButtonStyle.Success)
    ).addComponents(
        new ButtonBuilder()
        .setCustomId(`salon_message_say ${id}`)
        .setEmoji("📨")
        .setLabel(salon)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(salon_bouton)
    ).addComponents(
        new ButtonBuilder()
        .setCustomId(`timestamp_message_say ${id}`)
        .setEmoji("⏲")
        .setLabel(timestamp_message_say)
        .setStyle(timestamp_message_say_style)
        .setDisabled(!embed_timestamp)
    ).addComponents(
        new ButtonBuilder()
        .setCustomId(`info_say ${id}`)
        .setEmoji("ℹ")
        .setLabel("Informations")
        .setStyle(ButtonStyle.Secondary)
    )

    /*if((salon === true && retour === true) || (retour === true && salon === false))
    boutons_say.addComponents(
        new ButtonBuilder()
        .setCustomId(`retour_message_say ${id}`)
        .setEmoji("◀")
        .setLabel("Retour")
        .setStyle(ButtonStyle.Secondary)
    )

    if(salon === true && retour === false)
    boutons_say.addComponents(
        new ButtonBuilder()
        .setCustomId(`retour_message_say_fields ${id}`)
        .setEmoji("◀")
        .setLabel("Retour")
        .setStyle(ButtonStyle.Secondary)
    )*/

    return boutons_say

}