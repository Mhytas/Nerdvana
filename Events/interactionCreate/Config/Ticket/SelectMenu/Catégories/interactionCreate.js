const Discord = require("discord.js")
const { EmbedBuilder } = require("discord.js");

module.exports = async (bot, interaction) => {

    let db = bot.db;


    await db.query(`SELECT * FROM config_ticket WHERE guildID = '${interaction.guild.id}'`, async (err, req) => {

        let systeme = "🎫 Ticket"
        let desactive = "<:deactive:1136801378799456396>"
        
        let salon = ""
        let logs_ticket = ""
        let cat_attente = ""
        let cat_en_cours = ""
        let cat_fini = ""
        let role_ticket = ""
        let number_id = req[0].number_id


        if(req[0].salon === "false") salon = desactive
        if(req[0].salon !== "false") salon = `<#${req[0].salon}>`

        if(req[0].logs_ticket === "false") logs_ticket = desactive
        if(req[0].logs_ticket !== "false") logs_ticket = `<#${req[0].logs_ticket}>`

        if(req[0].cat_attente === "false") cat_attente = desactive
        if(req[0].cat_attente !== "false") cat_attente = `<#${req[0].cat_attente}>`

        if(req[0].cat_en_cours === "false") cat_en_cours = desactive
        if(req[0].cat_en_cours !== "false") cat_en_cours = `<#${req[0].cat_en_cours}>`

        if(req[0].cat_fini === "false") cat_fini = desactive
        if(req[0].cat_fini !== "false") cat_fini = `<#${req[0].cat_fini}>`

        if(req[0].role_ticket === "false") role_ticket = desactive
        if(req[0].role_ticket !== "false") role_ticket = `<@&${req[0].role_ticket}>`

        const embed_config_ticket = await bot.function.embed_config_ticket(bot, salon, logs_ticket, cat_attente, cat_en_cours, cat_fini, role_ticket, number_id, systeme);

        const selectMenu = new Discord.StringSelectMenuBuilder()
        .setCustomId("selectmenu_config")
        .setPlaceholder("Sélectionnez une commande")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(
        {
            label: "🏠 Accueil",
            value: "🏠 Accueil",
        },
        {
            label: "🎫 Ticket",
            value: "🎫 Ticket",
            default: true,
        },
        )

        const btns = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("Salon")
                .setEmoji("🎫")
                .setLabel("Salon")
                .setStyle(Discord.ButtonStyle.Primary)
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("Logs")
                .setEmoji("📝")
                .setLabel("Logs")
                .setStyle(Discord.ButtonStyle.Primary)
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("Catégorie en attente")
                .setEmoji("⏳")
                .setLabel("Catégorie en attente")
                .setStyle(Discord.ButtonStyle.Primary)
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("Catégorie en cours")
                .setEmoji("📪")
                .setLabel("Catégorie en cours")
                .setStyle(Discord.ButtonStyle.Primary)
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("Catégorie fini")
                .setEmoji("✅")
                .setLabel("Catégorie fini")
                .setStyle(Discord.ButtonStyle.Primary)
        )
        const btns2 = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("Rôle ticket")
            .setEmoji("🤵")
            .setLabel("Rôle ticket")
            .setStyle(Discord.ButtonStyle.Primary)
        )
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("Numéro ticket")
            .setEmoji("🔢")
            .setLabel("Numéro ticket")
            .setStyle(Discord.ButtonStyle.Primary)
        )
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("message_ticket")
            .setEmoji("📩")
            .setLabel("Message")
            .setStyle(Discord.ButtonStyle.Primary)
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("Reset_ticket")
                .setEmoji("✖")
                .setLabel("Reset")
                .setStyle(Discord.ButtonStyle.Danger)
        )


        const actionRow = new Discord.ActionRowBuilder()
        .addComponents(selectMenu)

        //Intéraction selectmenu
        //Catégorie en attente
        if(interaction.customId === "selectmenu_config_ticket_att") {
            const selectedCommand = interaction.values[0];
            await db.query(`UPDATE config_ticket SET cat_attente = '${selectedCommand}' WHERE guildID = '${interaction.guild.id}'`)
    
            embed_config_ticket.setFields([
                {
                    name: `\`🎫\` Salon`,
                    value: salon,
                    inline: true,
                },
                {
                    name: `\`📝\` Logs`,
                    value: logs_ticket,
                    inline: true,
                },
                {
                    name: `\`⏳\` Catégorie en attente`,
                    value: `<#${selectedCommand}>`,
                    inline: true,
                },
                {
                    name: `\`📪\` Catégorie en cours`,
                    value: cat_en_cours,
                    inline: true,
                },
                {
                    name: `\`✅\` Catégorie fini`,
                    value: cat_fini,
                    inline: true,
                }, {
                    name: `\`🤵\` Rôles ticket`,
                    value: role_ticket,
                    inline: true,
                }, {
                    name: `\`🔢\`Numéro ticket`,
                    value: number_id,
                    inline: true
                }])
    
            await interaction.deferUpdate()
            await interaction.editReply({embeds: [embed_config_ticket], components: [actionRow, btns, btns2], ephemeral: true})
        }

        //Catégorie en cours
        if(interaction.customId === "selectmenu_config_ticket_cours") {
            const selectedCommand = interaction.values[0];
            await db.query(`UPDATE config_ticket SET cat_en_cours = '${selectedCommand}' WHERE guildID = '${interaction.guild.id}'`)
            
            embed_config_ticket.setFields([
                {
                    name: `\`🎫\` Salon`,
                    value: salon,
                    inline: true,
                },
                {
                    name: `\`📝\` Logs`,
                    value: logs_ticket,
                    inline: true,
                },
                {
                    name: `\`⏳\` Catégorie en attente`,
                    value: cat_attente,
                    inline: true,
                },
                {
                    name: `\`📪\` Catégorie en cours`,
                    value: `<#${selectedCommand}>`,
                    inline: true,
                },
                {
                    name: `\`✅\` Catégorie fini`,
                    value: cat_fini,
                    inline: true,
                }, {
                    name: `\`🤵\` Rôles ticket`,
                    value: role_ticket,
                    inline: true,
                }, {
                    name: `\`🔢\`Numéro ticket`,
                    value: number_id,
                    inline: true
                }])
            
            await interaction.deferUpdate()
            await interaction.editReply({embeds: [embed_config_ticket], components: [actionRow, btns, btns2], ephemeral: true})
        }

        //Catégorie fini
        if(interaction.customId === "selectmenu_config_ticket_fini") {
            const selectedCommand = interaction.values[0];
            await db.query(`UPDATE config_ticket SET cat_fini = '${selectedCommand}' WHERE guildID = '${interaction.guild.id}'`)
        
            embed_config_ticket.setFields([
                {
                    name: `\`🎫\` Salon`,
                    value: salon,
                    inline: true,
                },
                {
                    name: `\`📝\` Logs`,
                    value: logs_ticket,
                    inline: true,
                },
                {
                    name: `\`⏳\` Catégorie en attente`,
                    value: cat_attente,
                    inline: true,
                },
                {
                    name: `\`📪\` Catégorie en cours`,
                    value: cat_en_cours,
                    inline: true,
                },
                {
                    name: `\`✅\` Catégorie fini`,
                    value: `<#${selectedCommand}>`,
                    inline: true,
                }, {
                    name: `\`🤵\` Rôles ticket`,
                    value: role_ticket,
                    inline: true,
                }, {
                    name: `\`🔢\`Numéro ticket`,
                    value: number_id,
                    inline: true
                }])

                await interaction.deferUpdate()
                await interaction.editReply({embeds: [embed_config_ticket], components: [actionRow, btns, btns2], ephemeral: true})
        }
    })
}