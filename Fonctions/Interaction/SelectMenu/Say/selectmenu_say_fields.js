const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = async (id) => {

    const selectmenu_say_fields = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
    .setCustomId(`selectmenu_say_fields ${id}`)
    .setPlaceholder("Sélectionnez un field à modifier")
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(
        (() => {
            const options = [];
            for (let i = 1; i <= 25; i++) {
                options.push({
                    label: `Fields${i}`,
                    value: `fields${i}`,
                });
            }
            return options;
        })()
    )
    )
    return selectmenu_say_fields
}