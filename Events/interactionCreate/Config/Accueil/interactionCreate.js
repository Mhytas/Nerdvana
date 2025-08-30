const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

    let db = bot.db;

    await db.query(`SELECT * FROM config_ticket WHERE guildID = '${interaction.guild.id}'`, async (err, req_config) => {
        await db.query(`SELECT * FROM server WHERE guild = '${interaction.guild.id}'`, async (err, req_server) => {

            let desactive = "<:deactive:1136801378799456396>"
            let number_roles_réactions = req_server[0].number_roles_réactions

            let salon = ""
            let langue = req_server[0].langue
            let logs_ticket = ""
            let cat_attente = ""
            let cat_en_cours = ""
            let cat_fini = ""
            
            
            if(req_config[0].salon === "false") salon = desactive
            if(req_config[0].salon !== "false") salon = `<#${req_config[0].salon}>`
            
            if(req_config[0].logs_ticket === "false") logs_ticket = desactive
            if(req_config[0].logs_ticket !== "false") logs_ticket = `<#${req_config[0].logs_ticket}>`
            
            if(req_config[0].cat_attente === "false") cat_attente = desactive
            if(req_config[0].cat_attente !== "false") cat_attente = `<#${req_config[0].cat_attente}>`
            
            if(req_config[0].cat_en_cours === "false") cat_en_cours = desactive
            if(req_config[0].cat_en_cours !== "false") cat_en_cours = `<#${req_config[0].cat_en_cours}>`
            
            if(req_config[0].cat_fini === "false") cat_fini = desactive
            if(req_config[0].cat_fini !== "false") cat_fini = `<#${req_config[0].cat_fini}>`
            
            
            if(interaction.customId === "selectmenu_config") {
                let systeme = interaction.values[0];
                if(systeme === "🏠 Accueil") {
                    
                    const acceuil_config = await bot.function.acceuil_config(bot, salon, systeme, langue, number_roles_réactions);
                    const selectmenu_config = await bot.function.selectmenu_config(systeme);
                    
                    await interaction.deferUpdate()
                    await interaction.editReply({embeds: [acceuil_config],  components: [selectmenu_config], ephemeral: true})
                }
            }
        })
    })
}
