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
        
        //gestion de l'accueil
        if(interaction.customId === "selectmenu_config") {
            if(interaction.values[0] === "🎫 Ticket") {

                const embed_config_ticket = await bot.function.embed_config_ticket(bot, salon, logs_ticket, cat_attente, cat_en_cours, cat_fini, role_ticket, number_id, systeme);
                const selectmenu_config = await bot.function.selectmenu_config(systeme);

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

                await interaction.deferUpdate()
                await interaction.editReply({embeds: [embed_config_ticket],  components: [selectmenu_config, btns, btns2], ephemeral: true})
            }
        }
    })
}