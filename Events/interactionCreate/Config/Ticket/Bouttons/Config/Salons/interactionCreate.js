const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder } = require("discord.js");

module.exports = async (bot, interaction) => {

    let db = bot.db;


    await db.query(`SELECT * FROM config_ticket WHERE guildID = '${interaction.guild.id}'`, async (err, req) => {

        let systeme = "🎫 Ticket"
        let desactive = "<:deactive:1136801378799456396>"
        
        let salon = ""
        let logs_ticket = ""
        
        
        if(req[0].salon === "false") salon = desactive
        if(req[0].salon !== "false") salon = `<#${req[0].salon}>`
        
        if(req[0].logs_ticket === "false") logs_ticket = desactive
        if(req[0].logs_ticket !== "false") logs_ticket = `<#${req[0].logs_ticket}>`

        if(interaction.isButton()) {
            //Boutton salon
            if(interaction.customId === "Salon") {
                let reglage = interaction.customId


                const ticket = new EmbedBuilder()
                    .setColor(bot.color)
                    .setAuthor({
                    name: `${bot.user.username} - Configuration - ${systeme} - ${reglage}`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription(`Le salon des tickets est actuellement configuré dans : ${salon}`)
                    .setTimestamp()
                    .setFooter({text: systeme})

                    const selectMenu_Salon = new Discord.ChannelSelectMenuBuilder()
                    .setCustomId("selectmenu_config_ticket_salon")
                    .setPlaceholder("Sélectionnez un salon")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setChannelTypes(Discord.ChannelType.GuildText)

                    const selectMenu = new ActionRowBuilder()
                    .addComponents(selectMenu_Salon)

                    const btns_retour = new ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("Reload_ticket")
                            .setEmoji("◀")
                            .setLabel("Retour")
                            .setStyle(Discord.ButtonStyle.Secondary)
                    )

                    await interaction.deferUpdate()
                    await interaction.editReply({embeds: [ticket], components: [selectMenu, btns_retour], ephemeral: true})
            }

            //Boutton Salon_embed
            if(interaction.customId === "Salon_embed") {
                let reglage = interaction.customId
    
    
                const ticket = new EmbedBuilder()
                    .setColor(bot.color)
                    .setAuthor({
                    name: `${bot.user.username} - Configuration - ${systeme} - ${reglage}`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription(`Le salon des tickets est actuellement configuré dans : ${salon}`)
                    .setTimestamp()
                    .setFooter({text: systeme})
    
                    const selectMenu_Salon = new Discord.ChannelSelectMenuBuilder()
                    .setCustomId("selectmenu_config_ticket_salon_embed")
                    .setPlaceholder("Sélectionnez un salon")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setChannelTypes(Discord.ChannelType.GuildText)
    
                    const selectMenu = new ActionRowBuilder()
                    .addComponents(selectMenu_Salon)
    
                    const btns_retour = new ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("modifier_message_ticket")
                            .setEmoji("◀")
                            .setLabel("Retour")
                            .setStyle(Discord.ButtonStyle.Secondary)
                    )
    
                    await interaction.deferUpdate()
                    await interaction.editReply({embeds: [ticket], components: [selectMenu, btns_retour], ephemeral: true})
            }


            //Boutton Salon_message
            if(interaction.customId === "Salon_message") {
                let reglage = interaction.customId
        
        
                const ticket = new EmbedBuilder()
                    .setColor(bot.color)
                    .setAuthor({
                    name: `${bot.user.username} - Configuration - ${systeme} - ${reglage}`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription(`Le salon des tickets est actuellement configuré dans : ${salon}`)
                    .setTimestamp()
                    .setFooter({text: systeme})
        
                    const selectMenu_Salon = new Discord.ChannelSelectMenuBuilder()
                    .setCustomId("selectmenu_config_ticket_salon_messsage")
                    .setPlaceholder("Sélectionnez un salon")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setChannelTypes(Discord.ChannelType.GuildText)
        
                    const selectMenu = new ActionRowBuilder()
                    .addComponents(selectMenu_Salon)
        
                    const btns_retour = new ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("message_ticket")
                            .setEmoji("◀")
                            .setLabel("Retour")
                            .setStyle(Discord.ButtonStyle.Secondary)
                    )
        
                    await interaction.deferUpdate()
                    await interaction.editReply({embeds: [ticket], components: [selectMenu, btns_retour], ephemeral: true})
            }

            //Boutton logs
            if(interaction.customId === "Logs") {
                let reglage = interaction.customId


                const ticket = new EmbedBuilder()
                    .setColor(bot.color)
                    .setAuthor({
                    name: `${bot.user.username} - Configuration - ${systeme} - ${reglage}`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription(`Le salon des logs est actuellement configuré dans : ${logs_ticket}`)
                    .setTimestamp()
                    .setFooter({text: systeme})

                    const selectMenu_Salon = new Discord.ChannelSelectMenuBuilder()
                    .setCustomId("selectmenu_config_ticket_logs")
                    .setPlaceholder("Sélectionnez un salon")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setChannelTypes(Discord.ChannelType.GuildText)

                    const selectMenu = new ActionRowBuilder()
                    .addComponents(selectMenu_Salon)

                    const btns_retour = new ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("Reload_ticket")
                            .setEmoji("◀")
                            .setLabel("Retour")
                            .setStyle(Discord.ButtonStyle.Secondary)
                    )

                    await interaction.deferUpdate()
                    await interaction.editReply({embeds: [ticket], components: [selectMenu, btns_retour], ephemeral: true})
            }
        }
    })
}