const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = async (systeme) => {
    const selectmenu = new StringSelectMenuBuilder()
    .setCustomId("selectmenu_config")
    .setPlaceholder("Sélectionnez un système")
    .setMaxValues(1)
    .setMinValues(1)
    .spliceOptions(systeme)
    
    const options = {
        "🏠 Accueil": [
          { label: "🏠 Accueil", value: "🏠 Accueil", default: true },
          { label: "🎫 Ticket", value: "🎫 Ticket" },
          { label: "🗣 Langue du bot", value: "🗣 Langue du bot" },
          { label: "🎭 Rôles réactions", value: "🎭 Rôles réactions" },
        ],
        "🎫 Ticket": [
          { label: "🏠 Accueil", value: "🏠 Accueil" },
          { label: "🎫 Ticket", value: "🎫 Ticket", default: true },
          { label: "🗣 Langue du bot", value: "🗣 Langue du bot" },
          { label: "🎭 Rôles réactions", value: "🎭 Rôles réactions" },
        ],
        "🗣 Langue du bot": [
          { label: "🏠 Accueil", value: "🏠 Accueil" },
          { label: "🎫 Ticket", value: "🎫 Ticket" },
          { label: "🗣 Langue du bot", value: "🗣 Langue du bot", default: true },
          { label: "🎭 Rôles réactions", value: "🎭 Rôles réactions" },
        ],
        "🎭 Rôles réactions": [
          { label: "🏠 Accueil", value: "🏠 Accueil" },
          { label: "🎫 Ticket", value: "🎫 Ticket" },
          { label: "🗣 Langue du bot", value: "🗣 Langue du bot" },
          { label: "🎭 Rôles réactions", value: "🎭 Rôles réactions", default: true },
        ]
    };
      
    const selectedOptions = options[systeme];
    if (selectedOptions) selectmenu.setOptions(...selectedOptions)
          
    const selectmenu_config = new ActionRowBuilder().addComponents(selectmenu)

    return selectmenu_config
}