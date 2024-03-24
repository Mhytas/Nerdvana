const Discord = require("discord.js")
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");


module.exports = {
    name: "config",
    description: "Permet de configurer le bot",
    type: 1,
    utilisation: "/config",
    permission: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    dm: false,
    category: "Administration",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "système",
            description: "Quels système veux tu configurer ?",
            required: false,
            autocomplete: true,
        },
    ],
  
  
    async run(bot, message, args, db) {
        await db.query(`SELECT * FROM config_ticket WHERE guildID = '${message.guild.id}'`, async (err, req_config) => {
            await db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req_server) => {

                let systeme = args.getString("système")
                if(systeme === null) systeme = "🏠 Accueil"
                if(systeme !== "🏠 Accueil" && systeme !== "🎫 Ticket" && systeme !== "🗣 Langue du bot" && systeme !== "🎭 Rôles réactions") return message.reply({content: "Ce système n'existe pas, aide toi de l'autocomplete ! :wink:", ephemeral: true})
                
                let langue = req_server[0].langue
                let number_roles_réactions = req_server[0].number_roles_réactions
                let desactive = "<:deactive:1136801378799456396>"

                let salon = ""
                let logs_ticket = ""
                let cat_attente = ""
                let cat_en_cours = ""
                let cat_fini = ""
                let role_ticket = ""
                let number_id = req_config[0].number_id


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

                if(req_config[0].role_ticket === "false") role_ticket = desactive
                if(req_config[0].role_ticket !== "false") role_ticket = `<@&${req_config[0].role_ticket}>`

                const embed_config_ticket = await bot.function.embed_config_ticket(bot, salon, logs_ticket, cat_attente, cat_en_cours, cat_fini, role_ticket, number_id, systeme);
                const selectmenu_config = await bot.function.selectmenu_config(systeme);
                const acceuil_config = await bot.function.acceuil_config(bot, salon, systeme, langue, number_roles_réactions);
                const langue_bot_config = await bot.function.langue_bot_config(bot, systeme, langue);
                const boutons_config_rôles_réactions = await bot.function.boutons_config_rôles_réactions(number_roles_réactions);
                const embed_rôles_réaction_config = await bot.function.embed_rôles_réaction_config(bot, systeme);
                const boutons_langue_bot = await bot.function.boutons_langue_bot(langue);



                //Accueil
                if(systeme === "🏠 Accueil") await message.reply({embeds: [acceuil_config], components: [selectmenu_config], ephemeral: true})

                //Ticket
                if(systeme === "🎫 Ticket") {

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
                        .setLabel("Catégorie Fini")
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

                await message.reply({embeds: [embed_config_ticket], components: [selectmenu_config, btns, btns2], ephemeral: true})
                }

                //Langue
                if(systeme === "🗣 Langue du bot") await message.reply({embeds: [langue_bot_config], components: [selectmenu_config, boutons_langue_bot], ephemeral: true})

                //Rôles
                if(systeme === "🎭 Rôles réactions") await message.reply({embeds: [embed_rôles_réaction_config], components: [selectmenu_config, boutons_config_rôles_réactions], ephemeral: true})
            })
        })
    }
}