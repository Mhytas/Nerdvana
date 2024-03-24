const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = async () => {
  const options = [];
  
  for (let i = 0; i < 25; i++) {
    options.push({ label: `Rôle réaction ${i + 1}`, value: `${i + 1}` });
  }

  const selectmenu = new StringSelectMenuBuilder()
  .setCustomId("selectmenu_nouveau_config_rôles_réactions")
  .setPlaceholder("Sélectionnez un rôle réaction à configurer")
  .setMaxValues(1)
  .setMinValues(1)
  .addOptions(options)  

  const selectmenu_nouveau_rôles_réaction = new ActionRowBuilder().addComponents(selectmenu)

  return selectmenu_nouveau_rôles_réaction
}