const { ActionRowBuilder, RoleSelectMenuBuilder } = require("discord.js")

module.exports = async (number) => {
    const selectmenu_config_rôle_rôles_réaction = new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
        .setCustomId(`selectmenu_config_rôle_rôles_réaction ${number}`)
        .setPlaceholder("Sélectionnez ici le rôle qui sera attribué")
        .setMaxValues(1)
        .setMinValues(1)
    )

  return selectmenu_config_rôle_rôles_réaction
}