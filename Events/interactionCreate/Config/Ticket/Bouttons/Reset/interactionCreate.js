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
        let message_id = ""
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

        if(req[0].message_id === "false") message_id = desactive
        if(req[0].message_id !== "false") message_id = `${req[0].message_id}`

        if(req[0].role_ticket === "false") role_ticket = desactive
        if(req[0].role_ticket !== "false") role_ticket = `<@&${req[0].role_ticket}>`
        
        const embed_config_ticket = await bot.function.embed_config_ticket(bot, salon, logs_ticket, cat_attente, cat_en_cours, cat_fini, role_ticket, number_id, systeme);
        const reset_ticket = await bot.function.reset_ticket(bot, systeme);

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

        const selectMenu2 = new Discord.StringSelectMenuBuilder()
        .setCustomId("selectmenu_reset")
        .setPlaceholder("Sélectionnez la ou les option(s) a supprimmé")
        .setMinValues(1)
        .setMaxValues(6)
        .addOptions(

            {
                label: "🎫 Salon",
                value: "🎫 Salon",
            }, {
                label: "📝 Logs",
                value: "📝 Logs",
            }, {
                label: "⏳ Catégorie en attente",
                value: "⏳ Catégorie en attente",
            }, {
                label: "📪 Catégorie en cours",
                value: "📪 Catégorie en cours",
            }, {
                label: "✅ Catégorie fini",
                value: "✅ Catégorie fini",
            }, {
                label: "🤵 Rôles ticket",
                value: "🤵 Rôles ticket",
            }, {
                label: "🔢 Numéro ticket",
                value: "🔢 Numéro ticket",
            }, {
                label: "📩 Message",
                value: "📩 Message",
            })

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
        const btns3 = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("Reload_ticket")
                .setEmoji("◀")
                .setLabel("Retour")
                .setStyle(Discord.ButtonStyle.Secondary)
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("oui_restet_ticket")
                .setEmoji("✔")
                .setLabel("Tout supprimer")
                .setStyle(Discord.ButtonStyle.Danger)
        )


        const actionRow2 = new Discord.ActionRowBuilder()
        .addComponents(selectMenu2)

        const actionRow = new Discord.ActionRowBuilder()
        .addComponents(selectMenu)

        if(interaction.isButton()) {
            //Boutton reset ticket
            if(interaction.customId === "Reset_ticket") {

                await interaction.deferUpdate()
                await interaction.editReply({embeds: [reset_ticket],  components: [btns3, actionRow2], ephemeral: true})
            }


            //Boutton oui reset
            if(interaction.customId === "oui_restet_ticket") {
                await interaction.deferUpdate()
                if(salon !== desactive) {
                    if(message_id !== desactive) {
                        try {
                            
                            let salon_message = await bot.channels.fetch(req[0].salon);
                            let messages = await salon_message.messages.fetch();
                            let msg = messages.get(message_id);
                        
                            if (msg) await msg.delete()
                        
                            db.query(`UPDATE config_ticket SET message_id = 'false' WHERE guildID = '${interaction.guild.id}'`);

                        } catch (error) { }
                    }
                }

                await db.query(`DELETE FROM \`config_ticket\` WHERE \`guildID\` = '${interaction.guild.id}'`)
                await db.query(`INSERT INTO \`config_ticket\` (\`guildID\`) VALUES ('${interaction.guild.id}')`);
                
                await interaction.editReply({embeds: [embed_config_ticket],  components: [actionRow, btns, btns2], ephemeral: true})
            }
        }
    })
}