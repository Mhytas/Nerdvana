const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = async (fields) => {  

  const selectmenu_rôles_réaction = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
      .setCustomId("selectmenu_rôles_réaction")
      .setPlaceholder("Sélectionnez vos rôle")
      .setOptions(fields)
  )

  return selectmenu_rôles_réaction
}