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
        
        const ticket = new EmbedBuilder()
        .setColor(bot.color)
        .setDescription(`Que souhaitez-vous modifier ?`)
        .setFields(
            [{
                name: `\`🎫\` Salon`,
                value: salon,
                inline: true,
            }, {
                name: `\`📝\` Logs`,
                value: logs_ticket,
                inline: true,
            }, {
                name: `\`⏳\` Catégorie en attente`,
                value: cat_attente,
                inline: true,
            }, {
                name: `\`📪\` Catégorie en cours`,
                value: cat_en_cours,
                inline: true,
            }, {
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
        .setTimestamp()

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
        const btns3 = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("oui_restet_ticket")
                .setEmoji("✔")
                .setLabel("Oui")
                .setStyle(Discord.ButtonStyle.Success)
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("Reload_ticket")
                .setEmoji("✖")
                .setLabel("Non")
                .setStyle(Discord.ButtonStyle.Danger)
        )


        const actionRow = new Discord.ActionRowBuilder()
        .addComponents(selectMenu)


        if(interaction.customId === "selectmenu_reset") {
            
            await interaction.deferUpdate()

            for (let i = 0; i <= 10; i++) {
                let suppression = ""
                const selectedCommand = interaction.values[i];
                
                if(selectedCommand === undefined) continue
                if(selectedCommand === "🎫 Salon") suppression = "salon"
                if(selectedCommand === "📝 Logs") suppression = "logs_ticket"
                if(selectedCommand === "⏳ Catégorie en attente") suppression = "cat_attente"
                if(selectedCommand === "📪 Catégorie en cours") suppression = "cat_en_cours"
                if(selectedCommand === "✅ Catégorie fini") suppression = "cat_fini"
                if(selectedCommand === "🤵 Rôles ticket") suppression = "role_ticket"
                if(selectedCommand === "🔢 Numéro ticket") suppression = "number_id"
                if(selectedCommand === "📩 Message") if(message_id !== desactive) {
                    try {
                            
                        let salon_message = await bot.channels.fetch(req[0].salon);                
                        let messages = await salon_message.messages.fetch();
                        let msg = messages.get(message_id);
                
                        if (msg) await msg.delete()

                    } catch (error) { console.log(error) }
                }

                if(selectedCommand === "🎫 Salon") salon = desactive
                if(selectedCommand === "📝 Logs") logs_ticket = desactive
                if(selectedCommand === "⏳ Catégorie en attente") cat_attente = desactive
                if(selectedCommand === "📪 Catégorie en cours") cat_en_cours = desactive
                if(selectedCommand === "✅ Catégorie fini") cat_fini = desactive
                if(selectedCommand === "🤵 Rôles ticket") role_ticket = desactive
                if(selectedCommand === "🔢 Numéro ticket") number_id = "0"

                if(selectedCommand === "🔢 Numéro ticket") await db.query(`UPDATE config_ticket SET number_id = '0' WHERE guildID = '${interaction.guild.id}'`);
                if(selectedCommand === "📩 Message") db.query(`UPDATE config_ticket SET description = 'false', title = 'false', color = 'false', author_name = 'false', author_url = 'false', footer_url = 'false', thumbnail = 'false', image = 'false', footer = 'false', title_url = 'false', timestamp = 'false', message_id = 'false', salon_message_id = 'false' WHERE guildID = '${interaction.guild.id}'`)

                if(selectedCommand === "🔢 Numéro ticket") continue
                if(selectedCommand === "📩 Message") continue
                await db.query(`UPDATE config_ticket SET ${suppression} = 'false' WHERE guildID = '${interaction.guild.id}'`);
            }

            ticket.setFields(
                [{
                    name: `\`🎫\` Salon`,
                    value: salon,
                    inline: true,
                }, {
                    name: `\`📝\` Logs`,
                    value: logs_ticket,
                    inline: true,
                }, {
                    name: `\`⏳\` Catégorie en attente`,
                    value: cat_attente,
                    inline: true,
                }, {
                    name: `\`📪\` Catégorie en cours`,
                    value: cat_en_cours,
                    inline: true,
                }, {
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

            ticket.setAuthor({
                name: `${bot.user.username} - Configuration - ${systeme}`,
                iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
            })
            ticket.setFooter({text: systeme})

            await interaction.editReply({embeds: [ticket],  components: [actionRow, btns, btns2], ephemeral: true})
        }
    })
}