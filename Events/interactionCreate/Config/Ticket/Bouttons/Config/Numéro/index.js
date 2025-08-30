const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder } = require("discord.js");

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
        
        const selectMenu = new Discord.StringSelectMenuBuilder()
        .setCustomId("selectmenu_config")
        .setPlaceholder("Sélectionnez une commande")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(
            {
                label: "🏠 Accueil",
                value: "🏠 Accueil",
            }, {
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

        const embed_number = new EmbedBuilder()
        .setColor(bot.color)
        .setAuthor({
            name: `${bot.user.username} - Configuration - ${systeme} - Numéro ticket`,
            iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
        })
        .setDescription(`Le numéro des ticket est actuellement de : **${number_id}**`)
        .setTimestamp()
        .setFooter({text: systeme})

        const btns3 = new ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("Reload_ticket")
                .setEmoji("◀")
                .setLabel("Retour")
                .setStyle(Discord.ButtonStyle.Secondary)
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("change_number_ticket")
                .setEmoji("📝")
                .setLabel("Changer le nombre")
                .setStyle(Discord.ButtonStyle.Success)
        )

        if(interaction.isButton()) {
            //Boutton numéro ticket
            if(interaction.customId === "Numéro ticket") {
                await interaction.deferUpdate()
                await interaction.editReply({embeds: [embed_number], components: [btns3], ephemeral: true})
            }
        }

        //Modal changé numéro
        if(interaction.customId === "change_number_ticket") {

            const modal_change_number_ticket = new Discord.ModalBuilder()
            .setCustomId("modal_change_number_ticket")
            .setTitle(`Nouveau numéro ticket`)

            const question1 = new Discord.TextInputBuilder()
            .setCustomId("number")
            .setLabel("Ecrivez le nouveau nombre des ticket")
            .setRequired(true)
            .setMinLength(1)
            .setPlaceholder(`Entrez votre réponse ici`)
            .setStyle(Discord.TextInputStyle.Short)

            const ActionRow1 = new ActionRowBuilder().addComponents(question1);
            modal_change_number_ticket.addComponents(ActionRow1)
            await interaction.showModal(modal_change_number_ticket);

            try {
                let reponse = await interaction.awaitModalSubmit({time: 300000})
                let whatToSay = reponse.fields.getTextInputValue("number")
                if(!isNaN(parseFloat(whatToSay)) && isFinite(whatToSay)) {

                    const embed_config_ticket = await bot.function.embed_config_ticket(bot, salon, logs_ticket, cat_attente, cat_en_cours, cat_fini, role_ticket, whatToSay, systeme);
                    await db.query(`UPDATE config_ticket SET number_id = '${whatToSay}' WHERE guildID = '${interaction.guild.id}'`)

                    await reponse.deferUpdate()
                    await reponse.editReply({embeds: [embed_config_ticket], components: [actionRow, btns, btns2], ephemeral: true})
                } else {
                    const embed_erreur_not_number = new Discord.EmbedBuilder()
                    .setColor("DarkRed")
                    .setAuthor({
                        name: `${bot.user.username} - Configuration - ${systeme} - Numéro ticket - Erreur`,
                        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription(`Merci de rentrer un nombre !`)
                    .setTimestamp()
                    .setFooter({text: systeme})

                    await reponse.deferUpdate()
                    await reponse.followUp({embeds: [embed_erreur_not_number], ephemeral: true})
                }
            
            } catch (err) { return console.log(err); }
        }
    })
}