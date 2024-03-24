const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder } = require("discord.js");

module.exports = async (bot, interaction) => {

    let db = bot.db;

    await db.query(`SELECT * FROM config_ticket WHERE guildID = '${interaction.guild.id}'`, async (err, req) => {

        let systeme = "🎫 Ticket"
        let desactive = "<:deactive:1136801378799456396>"
        
        let cat_attente = ""
        let cat_en_cours = ""
        let cat_fini = ""
        
        if(req[0].cat_attente === "false") cat_attente = desactive
        if(req[0].cat_attente !== "false") cat_attente = `<#${req[0].cat_attente}>`
        
        if(req[0].cat_en_cours === "false") cat_en_cours = desactive
        if(req[0].cat_en_cours !== "false") cat_en_cours = `<#${req[0].cat_en_cours}>`
        
        if(req[0].cat_fini === "false") cat_fini = desactive
        if(req[0].cat_fini !== "false") cat_fini = `<#${req[0].cat_fini}>`

        if(interaction.isButton()) {
            //Boutton catégorie en attente
            if(interaction.customId === "Catégorie en attente") {

                const ticket = new EmbedBuilder()
                    .setColor(bot.color)
                    .setAuthor({
                        name: `${bot.user.username} - Configuration - ${systeme} - Catégorie en attente`,
                        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription(`La catégorie en attente est actuellement configuré dans : ${cat_attente}`)
                    .setTimestamp()
                    .setFooter({text: systeme})

                    const selectMenu = new ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder()
                        .setCustomId("selectmenu_config_ticket_att")
                        .setPlaceholder("Sélectionnez une catégorie")
                        .setMaxValues(1)
                        .setMinValues(1)
                        .setChannelTypes(Discord.ChannelType.GuildCategory)
                    )

                    const btns_retour = new ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                        .setCustomId("Reload_ticket")
                        .setEmoji("◀")
                        .setLabel("Retour")
                        .setStyle(Discord.ButtonStyle.Secondary)
                    )

                    await interaction.deferUpdate()
                    await interaction.editReply({embeds: [ticket], components: [selectMenu, btns_retour], ephemeral: true})
            }



            //Boutton catégorie en cours
            if(interaction.customId === "Catégorie en cours") {

                const ticket = new EmbedBuilder()
                    .setColor(bot.color)
                    .setAuthor({
                        name: `${bot.user.username} - Configuration - ${systeme} - Catégorie en cours`,
                        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription(`La catégorie en cours est actuellement configuré dans : ${cat_en_cours}`)
                    .setTimestamp()
                    .setFooter({text: systeme})

                    const selectMenu = new ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder()
                        .setCustomId("selectmenu_config_ticket_cours")
                        .setPlaceholder("Sélectionnez une catégorie")
                        .setMaxValues(1)
                        .setMinValues(1)
                        .setChannelTypes(Discord.ChannelType.GuildCategory)
                    )

                    const btns_retour = new ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                        .setCustomId("Reload_ticket")
                        .setEmoji("◀")
                        .setLabel("Retour")
                        .setStyle(Discord.ButtonStyle.Secondary)
                    )

                    await interaction.deferUpdate()
                    await interaction.editReply({embeds: [ticket], components: [selectMenu, btns_retour], ephemeral: true})
            }

            
            //Boutton catégorie fini
            if(interaction.customId === "Catégorie fini") {

                const ticket = new EmbedBuilder()
                .setColor(bot.color)
                .setAuthor({
                    name: `${bot.user.username} - Configuration - ${systeme} - Catégorie fini`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                })
                .setDescription(`La catégorie fini est actuellement configuré dans : ${cat_fini}`)
                .setTimestamp()
                .setFooter({text: systeme})

                const selectMenu = new ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder()
                    .setCustomId("selectmenu_config_ticket_fini")
                    .setPlaceholder("Sélectionnez une catégorie")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setChannelTypes(Discord.ChannelType.GuildCategory)
                )

                const btns_retour = new ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
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