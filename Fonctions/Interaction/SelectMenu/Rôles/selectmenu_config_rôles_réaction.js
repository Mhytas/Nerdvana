const { ActionRowBuilder, RoleSelectMenuBuilder } = require("discord.js")

module.exports = async (langue) => {

    const selectmenu_config_rôles_réaction = new ActionRowBuilder()
    .addComponents(new RoleSelectMenuBuilder()
      .setCustomId(`selectmenu_config_rôles_réaction ${langue}`)
      .setPlaceholder("Sélectionnez .....")
      .setMaxValues(1)
      .setMinValues(1)
    )

    return selectmenu_config_rôles_réaction
}