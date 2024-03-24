const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = async (id) => {

    const selectmenu_say_options = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
    .setCustomId(`selectmenu_say_embed ${id}`)
    .setPlaceholder("Sélectionnez une option")
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(
        {
            label: "Contenu, description, titre et couleur",
            value: "Page 1",
        }, {
            label: "Auteur et footer",
            value: "Page 2",
        }, {
            label: "Image et thumbnail",
            value: "Page 3",
        }
    ))

    return selectmenu_say_options
}