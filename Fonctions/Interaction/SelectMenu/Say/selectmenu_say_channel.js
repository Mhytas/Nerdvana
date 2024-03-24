const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require("discord.js")

module.exports = async (id, customid, salon_id) => {

    if(customid === true) customid = `selectmenu_say_channel_fields ${id}`
    if(customid === false) customid = `selectmenu_say_channel ${id}`
    const selectmenu_say_channel = new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder ()
    .setCustomId(customid)
    .setPlaceholder("Sélectionnez le salon ici")
    .addChannelTypes(ChannelType.GuildText)
    .setMaxValues(1)
    .setMinValues(1)
    .setDefaultChannels(salon_id)
    )

    return selectmenu_say_channel
}