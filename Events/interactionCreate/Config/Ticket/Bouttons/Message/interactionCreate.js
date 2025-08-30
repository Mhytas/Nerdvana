const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder } = require("discord.js");

module.exports = async (bot, interaction) => {

    let db = bot.db;

    await db.query(`SELECT * FROM config_ticket WHERE guildID = '${interaction.guild.id}'`, async (err, req) => {
        await db.query(`SELECT * FROM config_ticket_fields_name WHERE guildID = '${interaction.guild.id}'`, async (err, req_name) => {
            await db.query(`SELECT * FROM config_ticket_fields_description WHERE guildID = '${interaction.guild.id}'`, async (err, req_description) => {
                await db.query(`SELECT * FROM config_ticket_fields_inline WHERE guildID = '${interaction.guild.id}'`, async (err, req_inline) => {

                    let systeme = "🎫 Ticket"
                    let desactive = "<:deactive:1136801378799456396>"
                    
                    let salon = ""
                    let id_salon = req[0].salon
                    let logs_ticket = ""
                    let cat_attente = ""
                    let cat_en_cours = ""
                    let cat_fini = ""
                    let role_ticket = ""
                    let number_id = req[0].number_id

                    let message = ""
                    let message_id = ""
                    let salon_message_id = ""

                    let description= req[0].description
                    let title = req[0].title
                    let color = req[0].color
                    let author_name = req[0].author_name
                    let author_url = req[0].author_url
                    let author_image = req[0].author_image
                    let timestamp = req[0].timestamp
                    let new_timestamp = ""
                    let footer = req[0].footer
                    let title_url = req[0].title_url
                    let image = req[0].image
                    let thumbnail = req[0].thumbnail
                    let footer_url = req[0].footer_url

                    
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

                    if(req[0].message === "false") message = desactive
                    if(req[0].message !== "false") message = `(test)[${message_id}]`

                    if(req[0].salon_message_id === "false") salon_message_id = desactive
                    if(req[0].salon_message_id !== "false") salon_message_id = `${req[0].salon_message_id}`

                    if(req[0].footer_url === "false") footer_url = null
                    if(req[0].footer_url !== "false") footer_url = req[0].footer_url
                    
                    const embed_config_ticket = await bot.function.embed_config_ticket(bot, salon, logs_ticket, cat_attente, cat_en_cours, cat_fini, role_ticket, number_id, systeme);
                    const embed_config_ticket_erreur_message = await bot.function.embed_config_ticket_erreur_message(bot, systeme);
                    
                    const actionRow = new ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
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
                        }
                    ))

                    const actionRow3 = new ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
                    .setCustomId("selectmenu_config_message_modifie")
                    .setPlaceholder("Sélectionnez une option")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions(
                        {
                            label: "Description",
                            value: "description",
                        }, {
                            label: "Titre",
                            value: "title",
                        }, {
                            label: "Couleur",
                            value: "color",
                        }, {
                            label: "Auteur",
                            value: "author",
                        }, {
                            label: "Thumbnail",
                            value: "thumbnail",
                        }, {
                            label: "Image",
                            value: "image",
                        }, {
                            label: "Footer",
                            value: "footer",
                        }, {
                            label: "Fields",
                            value: "fields",
                        }
                    ))

                    const actionRow4 = new ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
                        .setCustomId("selectmenu_config_message_fields")
                        .setPlaceholder("Sélectionnez un fields à modifier")
                        .setMaxValues(1)
                        .setMinValues(1)
                        .addOptions(
                            (() => {
                                const options = [];
                                for (let i = 1; i <= 25; i++) {
                                    options.push({
                                        label: `Fields${i}`,
                                        value: `fields${i}`,
                                    });
                                }
                                return options;
                            })()
                        )
                    )

                    const selectMenu4 = new Discord.StringSelectMenuBuilder()
                    .setCustomId("selectmenu_ticket")
                    .setPlaceholder("Sélectionnez la catégorie du ticket")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions
                        ({
                            label: "Demande Commercial",
                            value: "Demande Commercial",
                        }, {
                            label: "Demande de Support",
                            value: "Demande de Support",
                        }, {
                            label: "Demande de Partenariat",
                            value: "Demande de Partenariat",
                        }, {
                            label: "Déposer sa candidature",
                            value: "Déposer sa candidature",
                        }, {
                            label: "Espace Revendeur",
                            value: "Espace Revendeur",
                        }, {
                            label: "Report / Bugs",
                            value: "Report / Bugs",
                        }, {
                            label: "Annulé",
                            value: "Annulé",
                        })

                    const actionRow5 = new ActionRowBuilder()
                    .addComponents(selectMenu4)


                    const preview_embed = new EmbedBuilder()
                    if(description === "false") preview_embed.setDescription("**Aucune desciption n'es configuré !**")
                    if(description !== "false") preview_embed.setDescription(description)

                    if(title !== "false") preview_embed.setTitle(title)

                    if(color === "false") preview_embed.setColor("Default")
                    if(color !== "false") preview_embed.setColor(color)

                    if(author_name !== "false") preview_embed.setAuthor({name: author_name})

                    if(author_image === "" || author_image === "false") author_image = null
                    if(author_url === "" || author_url === "false") author_url = null
                    if(author_name !== "false") preview_embed.setAuthor({name: author_name, iconURL: author_image, url: author_url})

                    if(timestamp === "true") preview_embed.setTimestamp()
                    if(timestamp === "false") preview_embed.setTimestamp(null)
                    
                    if(footer === "false") preview_embed.setFooter(null)
                    if(footer !== "false") preview_embed.setFooter({text: footer, iconURL: footer_url})

                    if(title_url === "false") preview_embed.setURL(null)
                    if(title_url !== "false") preview_embed.setURL(title_url)

                    if(image === "false") preview_embed.setImage(null)
                    if(image !== "false") preview_embed.setImage(image)

                    if(thumbnail === "false") preview_embed.setThumbnail(null)
                    if(thumbnail !== "false") preview_embed.setThumbnail(thumbnail)


                    //fields
                    const fieldValuesName = {};
                    const fieldValuesDescription = {};
                    const fieldValuesInline = {};

                    const fields = [];

                    for (let i = 1; i <= 25; i++) {
                        fieldValuesName[`fields${i}`] = req_name[0][`fields${i}`];
                        fieldValuesDescription[`fields${i}`] = req_description[0][`fields${i}`];
                        fieldValuesInline[`fields${i}`] = req_inline[0][`fields${i}`];

                        const name = fieldValuesName[`fields${i}`];
                        const description = fieldValuesDescription[`fields${i}`];
                        const inline = fieldValuesInline[`fields${i}`];

                        if (name === "false" || description === "false") continue;

                        fields.push({ name, value: description, inline: inline === "false" ? false : true });
                    }

                    preview_embed.setFields(fields);

                    const preview_embed2 = new EmbedBuilder()
                    .setAuthor({
                        name: "Alexandre - Président de l'association",
                        iconURL: "https://cdn.discordapp.com/avatars/408675475313917963/14cbed59b81462e00914c2802bd9f5c0.webp",
                        url: "https://write-heberg.fr/"
                    })
                    .setDescription(`Nous accordons une grande importance à la classification des problématiques rencontrés par nos utilisateurs dans la cadre de notre amélioration constante`)
                    .setFields(
                        {
                            name: "Support",
                            value: `
- Serveur Dédié
- Bots & Games
- VPS LXC & KVM
- Web
- VPN
- Tunnel IP
- Housing`,
                            inline: true
                        }, {
                            name: "Revendeur",
                            value: `
- Serveur Dédié
- Bots & Games
- VPS & VDS
- Web
- VPN
- Tunneling
- Housing`,
                            inline: true
                        }, {
                            name: "Candidature",
                            value: `
- Administrateurs
- Techniciens
- Développeurs
- Modérateurs
- Supports
- Community M.
- Spontanée`,
                            inline: true
                        }, {
                            name: "Commercial",
                            value: `
- Achats & Locations
- Facturation
- Remboursement
- Parrainage`,
                            inline: true
                        }, {
                            name: "Partenariat",
                            value: `
- Achats & Locations
- Facturation
- Remboursement
- Parrainage`,
                            inline: true
                        }, {
                            name: "Reports / Bugs",
                            value: `
- Abuses
- Bugs / Fails
- Membres
- IPs & Clients`,
                            inline: true
                        },
                    )
                    .setColor("#58baff")
                    .setThumbnail("https://cdn.discordapp.com/icons/1050843719156375633/469f2b2a473eef6300755931740c95c9.png?size=256")
                    .setFooter({text: "Alexandre - Président de l'association", iconURL: "https://cdn.discordapp.com/avatars/408675475313917963/14cbed59b81462e00914c2802bd9f5c0.webp"})

                    const btns = new ActionRowBuilder()
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

                    const btns2 = new ActionRowBuilder()
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

                    if(interaction.customId === "selectmenu_config_ticket_salon_messsage"  || interaction.customId === "selectmenu_config_ticket_salon_embed") salon = interaction.values[0]

                    let disabled = false
                    let disabled2 = false

                    let modifie = "Modifier le message"
                    let modifie2 = "Renvoyer le message"

                    let modifie4 = "Envoyer le message"
                    let modifie3 = "envoyer_message_ticket"
                    let style = Discord.ButtonStyle.Success
                    let emoji = "📩"

                    if(description === "false") modifie = "Créer le message"
                    if(message_id === desactive) modifie2 = "Envoyer le message"

                    if(description === "false") disabled = true
                    if(message_id === desactive) disabled2 = true

                    if(salon === desactive) modifie3 = "Salon_message"
                    if(salon === desactive) modifie4 = "Configurer le salon"
                    if(salon === desactive) style = Discord.ButtonStyle.Primary
                    if(salon === desactive) emoji = "🎫"
                    if(salon === desactive) disabled = false



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
                        .setCustomId("modifier_message_ticket")
                        .setEmoji("✏")
                        .setLabel(modifie)
                        .setStyle(Discord.ButtonStyle.Primary)
                    )
                    .addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId(modifie3)
                        .setEmoji(emoji)
                        .setLabel(modifie4)
                        .setStyle(style)
                        .setDisabled(disabled)
                    )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("supprimer_message_ticket")
                            .setEmoji("✖")
                            .setLabel("Supprimer le message")
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setDisabled(disabled2)
                    )

                    const btns4 = new ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("ouvrir_ticket")
                            .setEmoji("📩")
                            .setLabel("Ouvrir un ticket")
                            .setStyle(Discord.ButtonStyle.Success)
                    )


                    const btns5 = new ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("oui_supprimer_message_ticket")
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

                    const btns6 = new ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("Reload_ticket")
                            .setEmoji("🏠")
                            .setLabel("Menu")
                            .setStyle(Discord.ButtonStyle.Secondary)
                    )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("message_ticket")
                            .setEmoji("◀")
                            .setLabel("Retour")
                            .setStyle(Discord.ButtonStyle.Secondary)
                    )
                    
                    if(timestamp === "false") btns6.addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("timestamp_config_message_ticket")
                            .setEmoji("⏱")
                            .setLabel("Rajouter le timestamp")
                            .setStyle(Discord.ButtonStyle.Success)
                    )

                    if(timestamp === "true") btns6.addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("timestamp_config_message_ticket")
                            .setEmoji("⏱")
                            .setLabel("Enlever le timestamp")
                            .setStyle(Discord.ButtonStyle.Danger)
                    )

                    if(salon === desactive) btns6.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("Salon_embed")
                        .setEmoji("🎫")
                        .setLabel("Configurer le salon")
                        .setStyle(Discord.ButtonStyle.Primary)
                    )

                    const btns8 = new ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("modifier_message_ticket")
                        .setEmoji("◀")
                        .setLabel("Retour")
                        .setStyle(Discord.ButtonStyle.Secondary)
                    )

                    const embed_fields = new EmbedBuilder()
                    .setAuthor({
                        name: `${bot.user.username} - Configuration - ${systeme} - Message - Modifer - Fields`,
                        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription("Choisissez ici quelle field vous vous voulez **créer** / **modifier** / **supprimer**")
                    .setTimestamp()
                    .setFooter({text: systeme})
                    .setColor(bot.color)

                    const embed_edit_message = new EmbedBuilder()
                    .setAuthor({
                        name: `${bot.user.username} - Configuration - ${systeme} - Message - Modifer`,
                        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription
                    (`En cliquand sur l'une des intéractiobs du select menu en dessous, un modal va s'ouvrir en focntion de votre choix. Merci de préarer à l'avance les émojis, les ID des salons affiché de cette façon **<#*l'id du salon*>** les ping de rôles affiché comme ceci **<@*l'id du rôle*>**, etc...
                    

                    Vous aves aussi une preview du message juste en dessous !`)
                    .setFields({
                        name: "Description",
                        value: ":soon:",
                        inline: true
                    },
                    {
                        name: "Titre",
                        value: ":soon:",
                        inline: true
                    },
                    {
                        name: "Couleur",
                        value: ":soon:",
                        inline: true
                    },
                    {
                        name: "Auteur",
                        value: ":soon:",
                        inline: true
                    },
                    {
                        name: "Thumbnail",
                        value: ":soon:",
                        inline: true
                    },
                    {
                        name: "Image",
                        value: ":soon:",
                        inline: true
                    },
                    {
                        name: "Footer",
                        value: ":soon:",
                        inline: true
                    },
                    {
                        name: "Ne marche pas encore :",
                        value: `
                        Les différents textes de présentation sont à revoir
                        `,
                        inline: true
                    }
                    )
                    .setTimestamp()
                    .setFooter({text: systeme})
                    .setColor(bot.color)

                    if(interaction.customId === "message_ticket" || interaction.customId === "selectmenu_config_ticket_salon_messsage") {

                        const message = new EmbedBuilder()
                        .setColor(bot.color)
                        .setAuthor({
                            name: `${bot.user.username} - Configuration - ${systeme} - Message`,
                            iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                        })
                        .setDescription(`Que souhaitez-vous faire ?`)
                        .setTimestamp()
                        .setFooter({text: systeme})
                    
                        
                        await interaction.deferUpdate()
                        await interaction.editReply({embeds: [message], components: [btns3], ephemeral: true})
                    }



                    if(interaction.customId === "modifier_message_ticket" || interaction.customId === "selectmenu_config_ticket_salon_embed") {
                        
                        await interaction.deferUpdate()
                        await interaction.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns6], ephemeral: true})
                    }


                    if(interaction.customId === "envoyer_message_ticket") {

                        let salon = await interaction.guild.channels.fetch(id_salon)

                        if(salon_message_id !== desactive) {
                            if(message_id !== "false") {
                                let salon_message = await bot.channels.fetch(salon_message_id);
                                let messages = await salon_message.messages.fetch();
                                let msg_delete = messages.get(message_id);
                                
                                try { if (msg_delete) { msg_delete.delete() } } catch (err) {console.error(err)}
                            }
                        }

                        let msg = await salon.send({embeds: [preview_embed, preview_embed2], components: [actionRow5]})

                        await db.query(`UPDATE config_ticket SET message_id = '${msg.id}', salon_message_id = '${id_salon}' WHERE guildID = '${interaction.guild.id}'`)
                        
                        await interaction.deferUpdate()
                        await interaction.editReply({embeds: [embed_config_ticket], components: [actionRow, btns, btns2], ephemeral: true})
                    }


                    if(interaction.customId === "supprimer_message_ticket") {
                        try {
                            
                            let salon_message = await bot.channels.fetch(req[0].salon);
                            let messages = await salon_message.messages.fetch();
                            let msg = await messages.get(message_id);

                            await interaction.deferUpdate()
                        
                            if (msg) { await msg.delete() } else { await interaction.followUp({embeds: [embed_config_ticket_erreur_message], ephemeral: true}) }
                        
                            await db.query(`UPDATE config_ticket SET message_id = 'false' WHERE guildID = '${interaction.guild.id}'`);
                        } catch (error) {
                            console.error('Erreur lors de la suppression du message :', error);
                        }

                        await interaction.editReply({embeds: [embed_config_ticket], components: [actionRow, btns, btns2], ephemeral: true})
                    }


                    if(interaction.customId === "oui_supprimer_message_ticket") {
                        await db.query(`UPDATE config_ticket SET message_id = 'false' WHERE guildID = '${interaction.guild.id}'`)

                        try {
                            
                            let salon_message = await bot.channels.fetch(req[0].salon);                
                            let messages = await salon_message.messages.fetch();
                            let msg = messages.get(message_id);

                            await interaction.deferUpdate()
                        
                            if (msg) { await msg.delete() } else { await interaction.followUp({embeds: [embed_config_ticket_erreur_message], ephemeral: true}) }

                        } catch (error) {
                            console.error('Erreur lors de la suppression du message :', error);
                        }

                        await interaction.deferUpdate()
                        await interaction.editReply({embeds: [embed_config_ticket], components: [actionRow, btns, btns2], ephemeral: true})
                    }



                    if(interaction.customId === "timestamp_config_message_ticket") {

                        if(timestamp === "false") preview_embed.setTimestamp()
                        if(timestamp === "false") new_timestamp = "true"

                        if(timestamp === "true") preview_embed.setTimestamp(null)
                        if(timestamp === "true") new_timestamp = "false"

                        if(new_timestamp === "false") {
                            const btns7 = new ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("Reload_ticket")
                                    .setEmoji("🏠")
                                    .setLabel("Menu")
                                    .setStyle(Discord.ButtonStyle.Secondary)
                            )
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("message_ticket")
                                    .setEmoji("◀")
                                    .setLabel("Retour")
                                    .setStyle(Discord.ButtonStyle.Secondary)
                            )
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("timestamp_config_message_ticket")
                                    .setEmoji("⏱")
                                    .setLabel("Rajouter le timestamp")
                                    .setStyle(Discord.ButtonStyle.Success)
                            )

                            await interaction.deferUpdate()
                            await interaction.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns7], ephemeral: true})

                        } else if(new_timestamp === "true") {

                            const btns7 = new ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("Reload_ticket")
                                    .setEmoji("🏠")
                                    .setLabel("Menu")
                                    .setStyle(Discord.ButtonStyle.Secondary)
                            )
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("message_ticket")
                                    .setEmoji("◀")
                                    .setLabel("Retour")
                                    .setStyle(Discord.ButtonStyle.Secondary)
                            )
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("timestamp_config_message_ticket")
                                    .setEmoji("⏱")
                                    .setLabel("Enlever le timestamp")
                                    .setStyle(Discord.ButtonStyle.Danger)
                            )

                            await interaction.deferUpdate()
                            await interaction.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns7], ephemeral: true})
                        }

                        await db.query(`UPDATE config_ticket SET timestamp = '${new_timestamp}' WHERE guildID = '${interaction.guild.id}'`)
                    }

                    if(interaction.customId === "selectmenu_config_message_fields") {

                        const selectedCommand = interaction.values[0];

                        const fields_add = new Discord.ModalBuilder()
                        .setCustomId("field_add")
                        .setTitle(`Ajouter le ${selectedCommand}`)

                        const question1 = new Discord.TextInputBuilder()
                        .setCustomId("field_name")
                        .setLabel("Ecrivez le titre du field")
                        .setRequired(true)
                        .setMinLength(1)
                        .setPlaceholder(`Entrez votre réponse ici`)
                        .setStyle(Discord.TextInputStyle.Short)

                        const question2 = new Discord.TextInputBuilder()
                        .setCustomId("field_description")
                        .setLabel("Ecrivez la description du field")
                        .setRequired(true)
                        .setMinLength(1)
                        .setMaxLength(4000)
                        .setPlaceholder(`Entrez votre réponse ici`)
                        .setStyle(Discord.TextInputStyle.Paragraph)

                        const question3 = new Discord.TextInputBuilder()
                        .setCustomId("field_inline")
                        .setLabel(`Définir si le field doit être aligné ou pas`)
                        .setRequired(true)
                        .setMinLength(4)
                        .setMaxLength(5)
                        .setPlaceholder(`Entrez uniquement "true" ou "false" ici`)
                        .setValue("true")
                        .setStyle(Discord.TextInputStyle.Short)

                        const ActionRow1 = new ActionRowBuilder().addComponents(question1);
                        const ActionRow2 = new ActionRowBuilder().addComponents(question2);
                        const ActionRow3 = new ActionRowBuilder().addComponents(question3);

                        fields_add.addComponents(ActionRow1)
                        fields_add.addComponents(ActionRow2)
                        fields_add.addComponents(ActionRow3)

                        await interaction.showModal(fields_add);

                        try {

                            let reponse = await interaction.awaitModalSubmit({time: 300000})

                            let whatToSay = reponse.fields.getTextInputValue("field_name")
                            let whatToSay2 = reponse.fields.getTextInputValue("field_description")
                            let whatToSay3 = reponse.fields.getTextInputValue("field_inline")

                            if(whatToSay3 !== "true") whatToSay3 = "false"


                            whatToSay = whatToSay.replace(/'/g, "\\\'");
                            whatToSay2 = whatToSay2.replace(/'/g, "\\\'");
                            await db.query(`UPDATE config_ticket_fields_name SET ${selectedCommand} = '${whatToSay}' WHERE guildID = '${interaction.guild.id}'`)
                            await db.query(`UPDATE config_ticket_fields_description SET ${selectedCommand} = '${whatToSay2}' WHERE guildID = '${interaction.guild.id}'`)
                            await db.query(`UPDATE config_ticket_fields_inline SET ${selectedCommand} = '${whatToSay3}' WHERE guildID = '${interaction.guild.id}'`)

                            await db.query(`SELECT * FROM config_ticket_fields_name WHERE guildID = '${interaction.guild.id}'`, async (err, req_name) => {
                                await db.query(`SELECT * FROM config_ticket_fields_description WHERE guildID = '${interaction.guild.id}'`, async (err, req_description) => {
                                    await db.query(`SELECT * FROM config_ticket_fields_inline WHERE guildID = '${interaction.guild.id}'`, async (err, req_inline) => {
                                                                        
                                        const fieldValuesName = {};
                                        const fieldValuesDescription = {};
                                        const fieldValuesInline = {};

                                        const fields = [];

                                        for (let i = 1; i <= 25; i++) {
                                            fieldValuesName[`fields${i}`] = req_name[0][`fields${i}`];
                                            fieldValuesDescription[`fields${i}`] = req_description[0][`fields${i}`];
                                            fieldValuesInline[`fields${i}`] = req_inline[0][`fields${i}`];

                                            const name = fieldValuesName[`fields${i}`];
                                            const description = fieldValuesDescription[`fields${i}`];
                                            const inline = fieldValuesInline[`fields${i}`];

                                            if (name === "false" || description === "false") continue;

                                            fields.push({ name, value: description, inline: inline === "false" ? false : true });
                                        }

                                        preview_embed.setFields(fields);

                                        await reponse.deferUpdate()
                                        await reponse.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2, embed_fields], components: [actionRow4, btns8], ephemeral: true})
                                    })
                                })
                            })
                        } catch (err) { return console.log(err); }
                    }
                    //if (interaction.isModalSubmit()) {}


                    if(interaction.customId === "selectmenu_config_message_modifie") {
                        const selectedCommand = interaction.values[0];

                        //fields
                        if(selectedCommand === "fields") {

                            await interaction.deferUpdate()
                            await interaction.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2, embed_fields], components: [actionRow4, btns8], ephemeral: true})
                        
                        }

                        if(selectedCommand === "description") {

                            const description_modal = new Discord.ModalBuilder()
                            .setCustomId("description_modal")
                            .setTitle("Message ticket")

                            const question1 = new Discord.TextInputBuilder()
                            .setCustomId("description_modal")
                            .setLabel("Ecrivez la description de l'embed")
                            .setRequired(true)
                            .setMinLength(1)
                            .setMaxLength(4000)
                            .setPlaceholder(`Entrez votre réponse ici (mettez "false" pour l'enlever)`)
                            .setStyle(Discord.TextInputStyle.Paragraph)

                            const ActionRow1 = new ActionRowBuilder().addComponents(question1);
                            description_modal.addComponents(ActionRow1)

                            await interaction.showModal(description_modal);

                            try {

                                let reponse = await interaction.awaitModalSubmit({time: 300000})
                        
                                let whatToSay = reponse.fields.getTextInputValue("description_modal")
                                if(whatToSay === "false") preview_embed.setDescription("**Aucune desciption n'es configuré !**")
                                if(whatToSay !== "false") preview_embed.setDescription(whatToSay)

                                whatToSay = whatToSay.replace(/'/g, "\\\'");
                                await db.query(`UPDATE config_ticket SET description = '${whatToSay}' WHERE guildID = '${interaction.guild.id}'`)

                                await reponse.deferUpdate()
                                await reponse.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns6], ephemeral: true})

                            } catch (err) { return; }
                        }

                        if(selectedCommand === "title") {

                            const title = new Discord.ModalBuilder()
                            .setCustomId("title_modal")
                            .setTitle("Message ticket")

                            const question1 = new Discord.TextInputBuilder()
                            .setCustomId("title_modal")
                            .setLabel("Ecrivez le titre de l'embed")
                            .setRequired(true)
                            .setPlaceholder("Entrez votre réponse ici (par défaut, rien)")
                            .setStyle(Discord.TextInputStyle.Short)

                            const question2 = new Discord.TextInputBuilder()
                            .setCustomId("title_url")
                            .setLabel("Ecrivez l'URL du titre")
                            .setRequired(false)
                            .setPlaceholder("Entrez votre réponse ici (par défaut, rien)")
                            .setStyle(Discord.TextInputStyle.Short)

                            const ActionRow1 = new ActionRowBuilder().addComponents(question1);
                            title.addComponents(ActionRow1)
                            
                            const ActionRow2 = new ActionRowBuilder().addComponents(question2);
                            title.addComponents(ActionRow2)

                            await interaction.showModal(title);

                            try {

                                let reponse = await interaction.awaitModalSubmit({time: 300000})

                                const linkRegex = /(https?:\/\/[^\s]+)/;
                        
                                let whatToSay = await reponse.fields.getTextInputValue("title_modal")
                                if(whatToSay === "") whatToSay = "false"

                                let whatToSay2 = reponse.fields.getTextInputValue("title_url")

                                const embed_réponse_lien = new EmbedBuilder()
                                .setColor("DarkRed")
                                .setAuthor({
                                    name: `${bot.user.username} - Configuration - ${systeme} - Message - Titre URL - Erreur`,
                                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                })
                                .setDescription("La valeur que tu as renté ne correspond pas à un lien")
                                .setTimestamp()
                                .setFooter({text: systeme})

                                await reponse.deferUpdate()

                                if(whatToSay2 !== "") if(!linkRegex.test(whatToSay2)) await reponse.followUp({embeds: [embed_réponse_lien], ephemeral: true})
                                if(!linkRegex.test(whatToSay2)) whatToSay2 = "false"
                                if(whatToSay2 === "") whatToSay2 = "false"
                                
                                if(whatToSay !== "false") preview_embed.setTitle(whatToSay)
                                if(whatToSay === "false") preview_embed.setTitle(null)

                                if(whatToSay2 !== "false") preview_embed.setURL(whatToSay2)
                                if(whatToSay2 === "false") preview_embed.setURL(null)

                                whatToSay = whatToSay.replace(/'/g, "\\\'");
                                await db.query(`UPDATE config_ticket SET title = '${whatToSay}' WHERE guildID = '${interaction.guild.id}'`)
                                await db.query(`UPDATE config_ticket SET title_url = '${whatToSay2}' WHERE guildID = '${interaction.guild.id}'`)

                                await reponse.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns6], ephemeral: true})

                            } catch (err) { return; }
                        }

                        if(selectedCommand === "color") {
                            
                            const color_modal = new Discord.ModalBuilder()
                            .setCustomId("color_modal")
                            .setTitle("Message ticket")

                            const question3 = new Discord.TextInputBuilder()
                            .setCustomId("color_modal")
                            .setLabel("Ecrivez la couleur de l'embed (Ex : #87CEEB)")
                            .setRequired(false)
                            .setPlaceholder("Entrez votre réponse ici (par défaut, rien)")
                            .setStyle(Discord.TextInputStyle.Short)

                            const ActionRow3 = new ActionRowBuilder().addComponents(question3);
                            color_modal.addComponents(ActionRow3)

                            await interaction.showModal(color_modal);

                            try {

                                let reponse = await interaction.awaitModalSubmit({time: 300000})

                                const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                        
                                let whatToSay = reponse.fields.getTextInputValue("color_modal")

                                const embed_réponse_color = new EmbedBuilder()
                                .setColor("DarkRed")
                                .setAuthor({
                                    name: `${bot.user.username} - Configuration - ${systeme} - Message - Color - Erreur`,
                                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                })
                                .setDescription("La valeur que tu as renté ne correspond pas à une couleur")
                                .setTimestamp()
                                .setFooter({text: systeme})

                                await reponse.deferUpdate()

                                if(whatToSay !== "") if(!hexColorRegex.test(whatToSay)) reponse.followUp({embeds: [embed_réponse_color], ephemeral: true})
                                if(!hexColorRegex.test(whatToSay)) whatToSay = "false"
                                if(whatToSay === "") whatToSay = "false"

                                if(whatToSay !== "") if(hexColorRegex.test(whatToSay)) await db.query(`UPDATE config_ticket SET color = '${whatToSay}' WHERE guildID = '${interaction.guild.id}'`)
                                
                                if(whatToSay !== "") if(hexColorRegex.test(whatToSay)) if(whatToSay !== "false") preview_embed.setColor(`${whatToSay}`)
                                
                                await reponse.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns6], ephemeral: true})

                            } catch (err) { return; }

                        }
                        
                        if(selectedCommand === "author") {

                            const author = new Discord.ModalBuilder()
                            .setCustomId("author")
                            .setTitle("Message ticket")


                            const question4 = new Discord.TextInputBuilder()
                            .setCustomId("author_name")
                            .setLabel("Ecrivez le nom de l'auteur")
                            .setRequired(true)
                            .setMinLength(1)
                            .setMaxLength(100)
                            .setPlaceholder("Entrez votre réponse ici (par défaut, le nom du serveur)")
                            .setStyle(Discord.TextInputStyle.Short)

                            const question5 = new Discord.TextInputBuilder()
                            .setCustomId("author_image")
                            .setLabel("Ecrivez l'URL de l'image pour l'auteur")
                            .setRequired(false)
                            .setMinLength(1)
                            .setPlaceholder("Entrez votre réponse ici (par défaut, rien)")
                            .setStyle(Discord.TextInputStyle.Short)

                            const question6 = new Discord.TextInputBuilder()
                            .setCustomId("author_url")
                            .setLabel("Ecrivez l'URL de l'auteur")
                            .setRequired(false)
                            .setMinLength(1)
                            .setPlaceholder("Entrez votre réponse ici (par défaut, l'image du serveur)")
                            .setStyle(Discord.TextInputStyle.Short)

                            const ActionRow4 = new ActionRowBuilder().addComponents(question4)
                            const ActionRow5 = new ActionRowBuilder().addComponents(question5)
                            const ActionRow6 = new ActionRowBuilder().addComponents(question6)

                            author.addComponents(ActionRow4)
                            author.addComponents(ActionRow5)
                            author.addComponents(ActionRow6)

                            await interaction.showModal(author);

                            try {

                                let reponse = await interaction.awaitModalSubmit({time: 300000})

                                let whatToSay = reponse.fields.getTextInputValue("author_name")
                                if(whatToSay === "name_server") whatToSay = interaction.guild.name
                                if(whatToSay === "name_author") whatToSay = interaction.user.username
                                if(whatToSay === "") whatToSay = "false"

                                let whatToSay2 = reponse.fields.getTextInputValue("author_image")
                                if(whatToSay2 === "url_server") whatToSay2 = interaction.guild.iconURL({ dynamic: true, size: 4096 });
                                if(whatToSay2 === "url_author") whatToSay2 = interaction.user.displayAvatarURL({ dynamic: true, size: 4096 });
                                if(whatToSay2 === "") whatToSay2 = null

                                let whatToSay3 = reponse.fields.getTextInputValue("author_url")
                                if(whatToSay3 === "false") whatToSay3 = null
                                if(whatToSay3 === "") whatToSay3 = null

                                if(whatToSay !== "false") preview_embed.setAuthor({name: whatToSay, iconURL: whatToSay2, url: whatToSay3})
                                if(whatToSay === "false") preview_embed.setAuthor({name: whatToSay, iconURL: null})

                                if(whatToSay2 === null) whatToSay2 = "false"

                                whatToSay = whatToSay.replace(/'/g, "\\\'");
                                await db.query(`UPDATE config_ticket SET author_name = '${whatToSay}' WHERE guildID = '${interaction.guild.id}'`)
                                await db.query(`UPDATE config_ticket SET author_image = '${whatToSay2}' WHERE guildID = '${interaction.guild.id}'`)
                                await db.query(`UPDATE config_ticket SET author_url = '${whatToSay3}' WHERE guildID = '${interaction.guild.id}'`)

                                await reponse.deferUpdate()
                                await reponse.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns6], ephemeral: true})

                            } catch (err) { return console.log(err); }
                        }

                        if(selectedCommand === "footer") {

                            const footer = new Discord.ModalBuilder()
                            .setCustomId("footer")
                            .setTitle("Message ticket")

                            const question1 = new Discord.TextInputBuilder()
                            .setCustomId("footer_name")
                            .setLabel("Ecrivez le nom du footer de l'embed")
                            .setRequired(true)
                            .setMinLength(1)
                            .setPlaceholder(`Entrez votre réponse ici (mettre "false" pour l'enlever)`)
                            .setStyle(Discord.TextInputStyle.Short)

                            const question2 = new Discord.TextInputBuilder()
                            .setCustomId("footer_url")
                            .setLabel("Ecrivez l'URL du footer de l'embed")
                            .setRequired(false)
                            .setMinLength(1)
                            .setPlaceholder(`Entrez votre réponse ici (mettre "false" pour rien mettre)`)
                            .setStyle(Discord.TextInputStyle.Short)

                            const ActionRow1 = new ActionRowBuilder().addComponents(question1);
                            footer.addComponents(ActionRow1)

                            const ActionRow2 = new ActionRowBuilder().addComponents(question2);
                            footer.addComponents(ActionRow2)

                            await interaction.showModal(footer);

                            try {

                                let reponse = await interaction.awaitModalSubmit({time: 300000})

                                let whatToSay = reponse.fields.getTextInputValue("footer_name")
                                let whatToSay2 = reponse.fields.getTextInputValue("footer_url")

                                if(whatToSay === "") whatToSay = "false"
                                if(whatToSay2 === "false") whatToSay2 = null
                                if(whatToSay2 === "") whatToSay2 = null

                                if(whatToSay === "false") preview_embed.setFooter(null)
                                if(whatToSay !== "false") preview_embed.setFooter({text: whatToSay, iconURL: whatToSay2})
                                
                                whatToSay = whatToSay.replace(/'/g, "\\\'");
                                await db.query(`UPDATE config_ticket SET footer = '${whatToSay}' WHERE guildID = '${interaction.guild.id}'`)

                                if(whatToSay2 !== null) await db.query(`UPDATE config_ticket SET footer_url = '${whatToSay2}' WHERE guildID = '${interaction.guild.id}'`)
                                if(whatToSay2 === null) await db.query(`UPDATE config_ticket SET footer_url = 'false' WHERE guildID = '${interaction.guild.id}'`)

                                await reponse.deferUpdate()
                                await reponse.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns6], ephemeral: true})

                            } catch (err) { return; }
                        }

                        if(selectedCommand === "image") {

                            const image = new Discord.ModalBuilder()
                            .setCustomId("image")
                            .setTitle("Message ticket")

                            const question5 = new Discord.TextInputBuilder()
                            .setCustomId("image")
                            .setLabel("Ecrivez l'URL de l'auteur de l'embed")
                            .setRequired(false)
                            .setMinLength(1)
                            .setPlaceholder("Entrez votre réponse ici (par défaut, rien)")
                            .setStyle(Discord.TextInputStyle.Short)

                            const ActionRow5 = new ActionRowBuilder().addComponents(question5);
                            image.addComponents(ActionRow5)

                            await interaction.showModal(image);

                            try {

                                let reponse = await interaction.awaitModalSubmit({time: 300000})

                                const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|tif|tiff|webp|svg|apng|ico|cur))/gi;

                                let whatToSay = reponse.fields.getTextInputValue("image")
                                
                                const embed_réponse_not_image = new EmbedBuilder()
                                .setColor("DarkRed")
                                .setAuthor({
                                    name: `${bot.user.username} - Configuration - ${systeme} - Message - Image - Erreur`,
                                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                })
                                .setDescription("La valeur que tu as renté ne correspond pas à une image")
                                .setTimestamp()
                                .setFooter({text: systeme})

                                await reponse.deferUpdate()

                                if(whatToSay === "") whatToSay = "false"
                                if(whatToSay !== "false") if(!imageRegex.test(whatToSay)) reponse.followUp({embeds: [embed_réponse_not_image], ephemeral: true})
                                if(imageRegex.test(whatToSay)) whatToSay = "false"

                                await db.query(`UPDATE config_ticket SET image = '${whatToSay}' WHERE guildID = '${interaction.guild.id}'`)
                                
                                if(whatToSay !== "false") preview_embed.setImage(whatToSay)
                                if(whatToSay === "false") preview_embed.setImage(null)
                                
                                await reponse.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns6], ephemeral: true})
                                
                            } catch (err) { return; }
                        }

                        if(selectedCommand === "thumbnail") {

                            const thumbnail = new Discord.ModalBuilder()
                            .setCustomId("thumbnail")
                            .setTitle("Message ticket")

                            const question5 = new Discord.TextInputBuilder()
                            .setCustomId("thumbnail")
                            .setLabel("Ecrivez l'URL de l'auteur de l'embed")
                            .setRequired(false)
                            .setMinLength(1)
                            .setPlaceholder("Entrez votre réponse ici (par défaut, rien)")
                            .setStyle(Discord.TextInputStyle.Short)

                            const ActionRow5 = new ActionRowBuilder().addComponents(question5);
                            thumbnail.addComponents(ActionRow5)

                            await interaction.showModal(thumbnail);

                            try {

                                let reponse = await interaction.awaitModalSubmit({time: 300000})

                                const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|tif|tiff|webp|svg|apng|ico|cur))/gi;

                                let whatToSay = reponse.fields.getTextInputValue("thumbnail")
                                
                                const embed_réponse_not_image = new EmbedBuilder()
                                .setColor("DarkRed")
                                .setAuthor({
                                    name: `${bot.user.username} - Configuration - ${systeme} - Message - Thumbnail - Erreur`,
                                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                })
                                .setDescription("La valeur que tu as renté ne correspond pas à une image")
                                .setTimestamp()
                                .setFooter({text: systeme})

                                await reponse.deferUpdate()

                                if(whatToSay === "") whatToSay = "false"
                                if(whatToSay !== "false") if(!imageRegex.test(whatToSay)) reponse.followUp({embeds: [embed_réponse_not_image], ephemeral: true})
                                if(imageRegex.test(whatToSay)) whatToSay = "false"

                                await db.query(`UPDATE config_ticket SET thumbnail = '${whatToSay}' WHERE guildID = '${interaction.guild.id}'`)
                                
                                if(whatToSay !== "false") preview_embed.setThumbnail(whatToSay)
                                if(whatToSay === "false") preview_embed.setThumbnail(null)
                                
                                await reponse.editReply({embeds: [embed_edit_message, preview_embed, preview_embed2], components: [actionRow3, btns6], ephemeral: true})
                                
                            } catch (err) { return; }
                        }
                    }
                })
            })
        })
    })
}