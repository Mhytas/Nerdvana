const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder, ChannelType } = require("discord.js")
const fs = require('fs');
const discordTranscripts = require("discord-html-transcripts")

module.exports = async (bot, interaction) => {

    let db = bot.db;

    await db.query(`SELECT * FROM ticket WHERE guild_id = '${interaction.guild.id}' and channel = '${interaction.channel.id}'`, async (err1, req) => {
        await db.query(`SELECT * FROM config_ticket WHERE guildID = '${interaction.guild.id}'`, async (err2, req_config) => {
            await db.query(`SELECT * FROM config_ticket_fields_name WHERE guildID = '${interaction.guild.id}'`, async (err3, req_name) => {
                await db.query(`SELECT * FROM config_ticket_fields_description WHERE guildID = '${interaction.guild.id}'`, async (err4, req_description) => {
                    await db.query(`SELECT * FROM config_ticket_fields_inline WHERE guildID = '${interaction.guild.id}'`, async (err5, req_inline) => {
                        await db.query(`SHOW COLUMNS FROM ticket LIKE \'${interaction.user.id}\'`, async (err6, result) => {
                            await db.query(`SELECT * FROM ticket WHERE channel = '${interaction.channel.id}' AND \`${interaction.user.id}\` = "claim"`, async (err7, req_ticket_user_claim) => {
                                await db.query(`SELECT * FROM ticket WHERE channel = '${interaction.channel.id}' AND \`${interaction.user.id}\` = "rajoute"`, async (err8, req_ticket_user_rajoute) => {
                                    await db.query(`SELECT * FROM ticket WHERE channel = '${interaction.channel.id}'`, async (err9, req_close_ticet) => {

                                        let systeme = interaction.customId
                                        try { systeme = interaction.values[0] } catch {}
                                        if(systeme === undefined) systeme = null
                                        let desactive = "<:deactive:1136801378799456396>"

                                        let salon = ""
                                        let number_id = parseInt(req_config[0].number_id)
                                        let logs_ticket = ""
                                        let cat_attente = ""
                                        let cat_en_cours = ""
                                        let cat_fini = ""
                    
                                        let message = ""
                                        let message_id = ""
                                        let salon_message_id = ""
                                        
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
                    
                                        if(req_config[0].message_id === "false") message_id = desactive
                                        if(req_config[0].message_id !== "false") message_id = `${req_config[0].message_id}`
                    
                                        if(req_config[0].message === "false") message = desactive
                                        if(req_config[0].message !== "false") message = `(test)[${message_id}]`
                    
                                        if(req_config[0].salon_message_id === "false") salon_message_id = desactive
                                        if(req_config[0].salon_message_id !== "false") salon_message_id = `${req_config[0].salon_message_id}`


                                        async function checkIfIntervenant(memberId, channelID) {
                                            return new Promise(async (resolve, reject) => {
                                                await db.query('SELECT COUNT(*) AS count FROM ticket WHERE JSON_CONTAINS(intervenants, ?) AND channel = ?', [`"${memberId}"`, channelID], async (err, result) => {
                                                    if(err) {
                                                        console.error(err)
                                                        reject(err);
                                                    }
                                                    
                                                    if (result[0].count === 0) {
                                                        // Aucun résultat trouvé, donc l'utilisateur n'est pas intervenant
                                                        resolve(false);
                                                    } else {
                                                        resolve(true)
                                                    }
                                                })
                                            })
                                        }

                                        // Ajouter un intervenant
                                        async function addIntervenant(memberId, channelID) {
                                            const addIntervenantQuery = 'UPDATE ticket SET intervenants = JSON_ARRAY_APPEND(intervenants, "$", ?) WHERE channel = ?';
                                            await db.query(addIntervenantQuery, [memberId, channelID]);
                                        }

                                            // Supprimer un intervenant
                                        async function removeIntervenant(memberId, channelID) {
                                            // Rechercher la position de l'utilisateur dans le tableau des intervenants
                                            const searchQuery = 'SELECT JSON_SEARCH(intervenants, "one", ?) AS position FROM ticket WHERE channel = ?';
                                            await db.query(searchQuery, [memberId, channelID], async (error, searchResult) => {
                                                if(error) console.error(error)
                                                
                                                if (searchResult === "") {
                                                    // L'utilisateur n'est pas présent dans le tableau des intervenants
                                                    console.log("L'utilisateur n'est pas un intervenant dans ce ticket.");
                                                    return;
                                                }
                                                
                                                // Supprimer l'utilisateur du tableau des intervenants
                                                const removeIntervenantQuery = 'UPDATE ticket SET intervenants = JSON_REMOVE(intervenants, JSON_UNQUOTE(?)) WHERE channel = ?';
                                                await db.query(removeIntervenantQuery, [searchResult[0].position, channelID]);
                                            });
                                        }

                                        const selectMenu4 = new StringSelectMenuBuilder()
                                        .setCustomId("selectmenu_ticket")
                                        .setPlaceholder("Sélectionnez la catégorie du ticket")
                                        .setMaxValues(1)
                                        .setMinValues(1)
                                        .addOptions(
                                            {
                                                label: "Support",
                                                value: "Support",
                                            }, {
                                                label: "Revendeur",
                                                value: "Revendeur",
                                            }, {
                                                label: "Candidature",
                                                value: "Candidature",
                                            }, {
                                                label: "Commercial",
                                                value: "Commercial",
                                            }, {
                                                label: "Partenariat",
                                                value: "Partenariat",
                                            }, {
                                                label: "Report / Bugs",
                                                value: "Report / Bugs",
                                            }
                                        )

                                        const actionRow5 = new ActionRowBuilder()
                                        .addComponents(selectMenu4)

                                        const embed_claim = new EmbedBuilder()
                                        .setColor("Green")
                                        .setDescription(`<@${interaction.user.id}> a rejoint le ticket`)
                                        .setTimestamp()

                                        const embed_claim2 = new EmbedBuilder()
                                        .setColor("DarkGreen")
                                        .setDescription(`Vous avez bien été ajouté à ce ticket si vous voulez le quitter vous pouvez selectionnez le bouton **Quitté le ticket**`)
                                        .setTimestamp()

                                        const embed_claim3 = new EmbedBuilder()
                                        .setColor("DarkRed")
                                        .setDescription(`Vous avez déjà rejoint ce ticket si vous voulez le quitter selectionnez le bouton **Quitté le ticket**`)
                                        .setTimestamp()

                                        const embed_claim4 = new EmbedBuilder()
                                        .setColor("DarkRed")
                                        .setDescription(`Vous avez déjà rejoint ce ticket en tant qu'invité si vous voulez le quitter vous pouvez effectuez la commande *(à faire plus tard)*`)
                                        .setTimestamp()

                                        const embed_claim5 = new EmbedBuilder()
                                        .setColor("DarkRed")
                                        .setDescription(`Vous n'avez pas rejoint ce ticket, vous ne pouvez donc pas le quitter`)
                                        .setTimestamp()

                                        const embed_claim6 = new EmbedBuilder()
                                        .setColor("DarkGreen")
                                        .setDescription(`Vous avez bien quitté le ticket`)
                                        .setTimestamp()

                                        const embed_claim7 = new EmbedBuilder()
                                        .setColor("Red")
                                        .setDescription(`<@${interaction.user.id}> a quitté le ticket`)
                                        .setTimestamp()

                                        const embed_permission_claim = new EmbedBuilder()
                                        .setColor("DarkRed")
                                        .setDescription(`Vous n'êtes pas autorisé à claim un ticket !`)
                                        .setTimestamp()

                                        const embed_permission_quitté = new EmbedBuilder()
                                        .setColor("DarkRed")
                                        .setDescription(`Vous n'êtes pas autorisé à quitté un ticket !`)
                                        .setTimestamp()

                                        /*const embed_prévention = new EmbedBuilder()
                                        .setAuthor({
                                                name: `${bot.user.username} - ${req_close_ticet[0].ID} - Fermeture`,
                                                iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                        })
                                        .setDescription(`Votre ticket va être fermé **<t:${Math.floor(parseInt(Date.now()) / 1000) + 60}:R>** !`)
                                        .setColor(bot.color)*/

                                        const embed_selectmenu = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${bot.user.username} - ${systeme}`,
                                            iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                        })
                                        .setDescription(`Besoin d'une assistance technique ou logiciel concernant vos services au sein de notre association ? 🧐\n\nNous sommes là pour répondre à votre besoin ⭐\n\nDans le but d'une gestion proactive de nos demandes d'assistance, veuillez préciser votre demande.`)
                                        .setTimestamp()
                                        .setFooter({text: systeme})
                                        .setColor(bot.color)

                                        const button_ticket = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                            .setCustomId("claim_ticket")
                                            .setLabel("Claim le ticket")
                                            .setStyle(ButtonStyle.Success)
                                            .setEmoji("📩"),

                                            new ButtonBuilder()
                                            .setCustomId("unclaim_ticket")
                                            .setLabel("Quitté le ticket")
                                            .setStyle(ButtonStyle.Danger)
                                            .setEmoji("✖"),

                                            new ButtonBuilder()
                                            .setCustomId("close_ticket")
                                            .setLabel("Fermé le ticket")
                                            .setStyle(ButtonStyle.Secondary)
                                            .setEmoji("🗑️")
                                        )

                                        const button_ticket2 = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                            .setCustomId("claim_ticket")
                                            .setLabel("Claim le ticket")
                                            .setStyle(ButtonStyle.Success)
                                            .setEmoji("📩")
                                            .setDisabled(true),

                                            new ButtonBuilder()
                                            .setCustomId("unclaim_ticket")
                                            .setLabel("Quitté le ticket")
                                            .setStyle(ButtonStyle.Danger)
                                            .setEmoji("✖")
                                            .setDisabled(true),

                                            new ButtonBuilder()
                                            .setCustomId("close_ticket")
                                            .setLabel("Fermé le ticket")
                                            .setStyle(ButtonStyle.Secondary)
                                            .setEmoji("🗑️")
                                            .setDisabled(true)
                                        )

                                        const button_ticket_annulé_fermeture = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                            .setCustomId("annulé_fermeture")
                                            .setLabel("Annulé la fermeture")
                                            .setStyle(ButtonStyle.Danger)
                                            .setEmoji("✖")
                                        )

                                        const selectMenu = new StringSelectMenuBuilder()
                                        .setPlaceholder("Sélectionnez la raison du ticket")
                                        .setMaxValues(1)
                                        .setMinValues(1)

                                        if(interaction.customId === "selectmenu_ticket") {                                            
                                            if(interaction.values[0] === "Support") selectMenu.addOptions(
                                                {
                                                    label: "Serveur Dédié",
                                                    value: "Serveur Dédié",
                                                }, {
                                                    label: "Bots & Games",
                                                    value: "Bots & Games",
                                                }, {
                                                    label: "VPS LXC & KVM",
                                                    value: "VPS LXC & KVM",
                                                }, {
                                                    label: "Web",
                                                    value: "Web",
                                                }, {
                                                    label: "VPN",
                                                    value: "VPN",
                                                }, {
                                                    label: "Tunnel IP",
                                                    value: "Tunnel IP",
                                                }, {
                                                    label: "Housing",
                                                    value: "Housing",
                                                }
                                            )

                                            if(interaction.values[0] === "Revendeur") selectMenu.addOptions(
                                                {
                                                    label: "Serveur Dédié",
                                                    value: "Serveur Dédié",
                                                }, {
                                                    label: "Bots & Games",
                                                    value: "Bots & Games",
                                                }, {
                                                    label: "VPS & VDS",
                                                    value: "VPS & VDS",
                                                }, {
                                                    label: "Web",
                                                    value: "Web",
                                                }, {
                                                    label: "VPN",
                                                    value: "VPN",
                                                }, {
                                                    label: "Tunneling",
                                                    value: "Tunneling",
                                                }, {
                                                    label: "Housing",
                                                    value: "Housing",
                                                }
                                            )

                                            if(interaction.values[0] === "Candidature") selectMenu.addOptions(
                                                {
                                                    label: "Administrateurs",
                                                    value: "Administrateurs",
                                                }, {
                                                    label: "Techniciens",
                                                    value: "Techniciens",
                                                }, {
                                                    label: "Développeurs",
                                                    value: "Développeurs",
                                                }, {
                                                    label: "Modérateur",
                                                    value: "Modérateur",
                                                }, {
                                                    label: "Supports",
                                                    value: "Supports",
                                                }, {
                                                    label: "Community M.",
                                                    value: "Community M.",
                                                }, {
                                                    label: "Spontanée",
                                                    value: "Spontanée",
                                                }
                                            )

                                            if(interaction.values[0] === "Commercial") selectMenu.addOptions(
                                                {
                                                    label: "Achats & Locations",
                                                    value: "Achats & Locations",
                                                }, {
                                                    label: "Facturation",
                                                    value: "Facturation",
                                                }, {
                                                    label: "Remboursement",
                                                    value: "Remboursement",
                                                }, {
                                                    label: "Parrainage",
                                                    value: "Parrainage",
                                                }
                                            )

                                            if(interaction.values[0] === "Partenariat") selectMenu.addOptions(
                                                {
                                                    label: "Achats & Locations",
                                                    value: "Achats & Locations",
                                                }, {
                                                    label: "Facturation",
                                                    value: "Facturation",
                                                }, {
                                                    label: "Remboursement",
                                                    value: "Remboursement",
                                                }, {
                                                    label: "Parrainage",
                                                    value: "Parrainage",
                                                }
                                            )

                                            if(interaction.values[0] === "Report / Bugs") selectMenu.addOptions(
                                                {
                                                    label: "Abuses",
                                                    value: "Abuses",
                                                }, {
                                                    label: "Bugs / Fails",
                                                    value: "Bugs / Fails",
                                                }, {
                                                    label: "Membres",
                                                    value: "Membres",
                                                }, {
                                                    label: "IPs & Clients",
                                                    value: "IPs& Clients",
                                                }
                                            )
                                            selectMenu.setCustomId(`selectmenu_ticket_cat${interaction.values[0]}`)


                                            const component = new ActionRowBuilder().addComponents(selectMenu)
                    
                                            await interaction.deferUpdate()
                                            await interaction.editReply({components: [actionRow5]})
                                            await interaction.followUp({embeds: [embed_selectmenu], components: [component], ephemeral: true})
                                        }

                                        try { if(interaction.customId.startsWith("selectmenu_ticket_cat")) {
                                            try { await interaction.deferUpdate() } catch {}
                                            let user_ticket = interaction.user
                                            let reason = interaction.values[0]
                                            let categorie = interaction.customId.substring("selectmenu_ticket_cat".length)

                                            let parent = interaction.channel.parent.id
                                            if(req_config[0].cat_attente !== "false") parent = req_config[0].cat_attente
                                        
                                            let roletickets = req_config[0].role_ticket
                                            let user = interaction.user.id
                                            let ID = `${categorie}-${reason}-${number_id}`
                                            let ID2 = `${reason}#${number_id}`
                                            await db.query(`UPDATE \`config_ticket\` SET \`number_id\` = '${number_id + 1}' WHERE \`config_ticket\`.\`guildID\` = '${interaction.guild.id}'`)
                                        
                                            let channel = await interaction.guild.channels.create({
                                                name: `📩┇${reason}-${number_id}`,
                                                type: ChannelType.GuildText,
                                                parent: parent,
                                                topic: (`Ticket crée le <t:${Math.floor(parseInt(Date.now()) / 1000)}:F> par <@${user}>`),
                                            })

                                            channel.permissionOverwrites.create(interaction.guild.roles.everyone, { ViewChannel: false, SendMessages: false })
                                            channel.permissionOverwrites.create(interaction.user, {
                                                ViewChannel: true,
                                                EmbedLinks: true,
                                                SendMessages: true,
                                                AttachFiles: true,
                                                ReadMessageHistory: true
                                            })
                                            channel.permissionOverwrites.create(roletickets, {
                                                ViewChannel: true,
                                                EmbedLinks: true,
                                                SendMessages: false,
                                                AttachFiles: true,
                                                ReadMessageHistory: true
                                            })
                                            
                                            try {
                                                const embed_ouverture_ticket = await bot.function.embed_ouverture_ticket(bot, user_ticket, categorie, reason, number_id);
                                                let msg = await channel.send({embeds: [embed_ouverture_ticket], components: [button_ticket]})
                                                let messages = await channel.messages.fetch({ around: msg.id, limit: 1 });
                                                let msg_envoyé = messages.first();
                                                await msg_envoyé.pin()
                                                await channel.bulkDelete(1)

                                                const embed_ouverture = new EmbedBuilder()
                                                .setColor(bot.color)
                                                .setAuthor({
                                                    name: `${bot.user.username} - ${systeme}`,
                                                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                                })
                                                .setDescription(`Votre ticket a bien été ouvert, vous pouvez prendre connaissance de ce dernier juste ici : ${channel}`)
                                                .setTimestamp()
                                                .setFooter({text: systeme})

                                                await interaction.editReply({content: "", embeds: [embed_ouverture], components: [], files: [], ephemeral: true})

                                                await db.query(`INSERT INTO ticket (guild_id, channel, user, ID, categorie, reason, number_id, date, message) VALUES ('${interaction.guild.id}', '${channel.id}', '${user}', '${ID}', '${categorie}', '${reason}', '${number_id}', '${Date.now()}', ${msg.id})`)
                                            } catch (err) {
                                                console.error(err)
                                                try { await interaction.deferUpdate() } catch {}
                                                await interaction.editReply({content: `Une erreur inattendue c'est produite, veuillez réessayer. Si l'erreur revient merci d'en prévenir le staff !`, components: [], embeds: [], ephemeral: true})
                                            }
                                        } } catch {}

                                        if(interaction.isButton()) {
                                            //claim
                                            if(interaction.customId === "claim_ticket") {
                                                let channel = await bot.channels.cache.get(interaction.channel.id)
                                                let user_ticket = await bot.users.cache.get(req_close_ticet[0].user)
                                                let parent = await interaction.channel.parent.id
                                                let userID = await interaction.user.id
                                                

                                                async function fonction_claim() { //début fonction
                                                    const result_intervenant = await checkIfIntervenant(userID, interaction.channel.id)
                                                    if(result_intervenant) {
                                                        return await interaction.reply({ embeds: [embed_claim3], ephemeral: true})
                                                    } else {
                                                        await addIntervenant(userID, interaction.channel.id)
                                                        await interaction.reply({ embeds: [embed_claim2], ephemeral: true})
                                                        let msg_envoyé = await interaction.channel.send({ embeds: [embed_claim]})
                                                        msg_envoyé = await interaction.channel.messages.fetch(msg_envoyé.id)
                                                        await msg_envoyé.pin()
                                                        await channel.bulkDelete(1)

                                                        if(req_config[0].cat_en_cours !== "false") if(parent !== req_config[0].cat_en_cours) await channel.setParent(req_config[0].cat_en_cours, { lockPermissions: true })

                                                        await channel.permissionOverwrites.create(user_ticket, {
                                                            ViewChannel: true,
                                                            EmbedLinks: true,
                                                            SendMessages: true,
                                                            AttachFiles: true,
                                                            ReadMessageHistory: true
                                                        })

                                                        await channel.permissionOverwrites.create(interaction.user, {
                                                            ViewChannel: true,
                                                            EmbedLinks: true,
                                                            SendMessages: true,
                                                            AttachFiles: true,
                                                            ReadMessageHistory: true
                                                        })

                                                        await channel.permissionOverwrites.create(interaction.guild.roles.everyone, { ViewChannel: false, SendMessages: false })

                                                        try{ await channel.permissionOverwrites.create(req_config[0].role_ticket, {
                                                            ViewChannel: true,
                                                            EmbedLinks: true,
                                                            SendMessages: false,
                                                            AttachFiles: true,
                                                            ReadMessageHistory: true
                                                        }) } catch {}
                                                    }
                                                    
                                                } //fin de la fonction

                                                try{ if(interaction.member.permissions.has('ADMINISTRATOR')) { await fonction_claim() }} catch (err) {
                                                    if(interaction.member.roles.cache.some((role) => role.id === req_config[0].role_ticket)) { await fonction_claim() } else {
                                                        try { return await interaction.reply({embeds: [embed_permission_claim], ephemeral: true}) } catch (err) {console.error(err)}
                                                    }
                                                }
                                            }

                                            //unclaim
                                            if(interaction.customId === "unclaim_ticket") {
                                                const channel = bot.channels.cache.get(interaction.channel.id)
                                                let userID = interaction.user.id

                                                async function fonction_unclaim() { //début fonction
                                                    const result_intervenant = await checkIfIntervenant(userID, interaction.channel.id)
                                                    if(!result_intervenant) {
                                                        return await interaction.reply({ embeds: [embed_claim5], ephemeral: true})
                                                    } else {
                                                        await removeIntervenant(userID, interaction.channel.id)
                                                        await interaction.reply({ embeds: [embed_claim6], ephemeral: true})
                                                        let msg_envoyé = await interaction.channel.send({ embeds: [embed_claim7]})
                                                        msg_envoyé = await interaction.channel.messages.fetch(msg_envoyé.id)
                                                        await msg_envoyé.pin()
                                                        await channel.bulkDelete(1)

                                                        await channel.permissionOverwrites.delete(interaction.user)
                                                    }
                                                    
                                                } //fin de la fonction

                                                try{ if(interaction.member.permissions.has('ADMINISTRATOR')) { await fonction_unclaim() }} catch {
                                                    if(interaction.member.roles.cache.some((role) => role.id === req_config[0].role_ticket)) { await fonction_unclaim() } else { 
                                                        try { return await interaction.reply({embeds: [embed_permission_quitté], ephemeral: true}) } catch (err) {console.error(err)}
                                                    }
                                                }
                                            }
                                            
                                            //close
                                            if(interaction.customId === "close_ticket") {

                                                let user_ticket = bot.users.cache.get(req_close_ticet[0].user)
                                                let ID = req_close_ticet[0].ID
                                                let channel = bot.channels.cache.get(req_close_ticet[0].channel)
                                                let reason = req_close_ticet[0].reason
                                                let date = req_close_ticet[0].date
                                                let guild = bot.guilds.cache.get(req_close_ticet[0].guild_id)
                                                let timeout = parseInt(req_close_ticet[0].timeout_réouvrir_fermeture)
                                                let categorie = req_close_ticet[0].categorie
                                                let number_id = req_close_ticet[0].number_id
                                            
                                            
                                                const embed_timeout = new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${bot.user.username} - ${ID} - Attente`,
                                                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                                })
                                                .setDescription(`Vous pourez fermer le ticket <t:${timeout + 600}:R> !`)
                                                .setTimestamp()
                                                .setFooter({text: ID})
                                                .setColor("DarkRed")
                                            
                                                if(timeout + 600 >= Math.floor(parseInt(Date.now()) / 1000)) { return await interaction.reply({embeds: [embed_timeout], ephemeral: true}) } else {
                                                    const embed_fermeture = new EmbedBuilder()
                                                    .setAuthor({
                                                            name: `${bot.user.username} - ${ID} - Fermeture`,
                                                            iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                                    })
                                                    .setDescription(`Votre ticket sur le serveur ${guild.name} à bien été **fermé** !`)
                                                    .setFields(
                                                        {
                                                            name: "ID Ticket :",
                                                            value: `${categorie} - ${reason}#${number_id}`,
                                                            inline: true
                                                        }, {
                                                            name: "Fermé par :",
                                                            value: `${interaction.user}`,
                                                            inline: true
                                                        }, {
                                                            name: "Ticket créé le :",
                                                            value: `<t:${Math.floor(parseInt(date) / 1000)}:F>`,
                                                            inline: true
                                                        })
                                                    .setTimestamp()
                                                    .setFooter({text: ID})
                                                    .setColor("DarkRed")
                                            
                                                    try{ await user_ticket.send({embeds: [embed_fermeture]}) } catch {}
                                                    
                                                    const suprimmé_réouvrir = new ActionRowBuilder()
                                                    .addComponents(
                                                            new ButtonBuilder()
                                                            .setCustomId("Réouvrir")
                                                            .setLabel("Réouvrir le ticket")
                                                            .setStyle(ButtonStyle.Success)
                                                            .setEmoji("✔"),
                                            
                                                            new ButtonBuilder()
                                                            .setCustomId("suprimmé")
                                                            .setLabel("Suprimmé le ticket")
                                                            .setStyle(ButtonStyle.Danger)
                                                            .setEmoji("🗑️")
                                                    )
                                                    await db.query(`UPDATE \`ticket\` SET \`timeout_réouvrir_fermeture\` = '${Math.floor(parseInt(Date.now()) / 1000)}' WHERE \`ticket\`.\`channel\` = '${interaction.channel.id}'`)
                                                    try { await interaction.deferUpdate() } catch (err) {return console.error(err)}
                                                    await interaction.editReply({components: [button_ticket2]})
                                                    await interaction.guild.channels.edit(`${interaction.channel.id}`, {name: `🔐┇${reason}-${number_id}`})
                                                    
                                                    const messages = await channel.messages.fetch()
                                                    const mentionedUsers = new Set(messages.filter(msg => !msg.author.bot).map(msg => msg.author));
                                                    const mentionedUsersString = Array.from(mentionedUsers).map(user => `<@${user.id}>`).join(' ');
                                                    let contributeurs = ""
                                                    if(mentionedUsersString) contributeurs = ` Les contributeurs sont ${mentionedUsersString} !`
                                                    
                                                    const name_transcripts = `transcript-${channel.name}.html`
                                                    const transcripts = (await discordTranscripts.createTranscript(channel)).setName(name_transcripts)
                                                    const folderPath = `./Save_tickets`
                                                    if(!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
                                                    const filePath = `${folderPath}/${name_transcripts}`
                                                    fs.writeFile(filePath, transcripts.attachment.toString(), (err) => { if (err) return console.error('Erreur lors de l\'enregistrement du fichier :', err) })

                                                    await channel.setTopic(`Ticket fermé le <t:${Math.floor(parseInt(Date.now()) / 1000)}:F> par ${interaction.user}. Ce ticket a été créé le <t:${Math.floor(parseInt(date))}:F> par ${user_ticket} !`)
                                                    if(req_config[0].cat_fini !== "false") await channel.setParent(req_config[0].cat_fini, { lockPermissions: true })
                                                    
                                                    await channel.permissionOverwrites.create(interaction.guild.roles.everyone, { ViewChannel: false, SendMessages: false })
                                                    await channel.permissionOverwrites.create(user_ticket, {
                                                        ViewChannel: true,
                                                        EmbedLinks: true,
                                                        SendMessages: false,
                                                        AttachFiles: true,
                                                        ReadMessageHistory: true
                                                    })

                                                    try{ await channel.permissionOverwrites.create(req_config[0].role_ticket, {
                                                            ViewChannel: false,
                                                            EmbedLinks: true,
                                                            SendMessages: false,
                                                            AttachFiles: true,
                                                            ReadMessageHistory: true
                                                    }) } catch {}

                                                    await guild.members.fetch().then(async (members) => {
                                                        await members.each(async (member) => {
                                                            let result
                                                            if(interaction.channel) result = await checkIfIntervenant(await member.user.id, await interaction.channel.id)
                                                            if(result) {
                                                                await channel.permissionOverwrites.create(member.user, {
                                                                    ViewChannel: true,
                                                                    EmbedLinks: true,
                                                                    SendMessages: false,
                                                                    AttachFiles: true,
                                                                    ReadMessageHistory: true
                                                                })
                                                            }
                                                        })
                                                    }).catch(console.error);
                                                    try {
                                                        let msg_envoyé = await interaction.followUp({content: `Le ticket a bien été fermé par ${interaction.user} !${contributeurs}`, files: [transcripts]})
                                                        await msg_envoyé.pin()
                                                        await channel.bulkDelete(1)
                                                        await interaction.editReply({components: [suprimmé_réouvrir]})
                                                    } catch (err) { console.log(err) }
                                                }
                                            }
                                            
                                            //Réouvrir
                                            if(interaction.customId === "Réouvrir") {

                                                let user_ticket = bot.users.cache.get(req_close_ticet[0].user)
                                                let ID = req_close_ticet[0].ID
                                                let channel = bot.channels.cache.get(req_close_ticet[0].channel)
                                                let reason = req_close_ticet[0].reason
                                                let date = req_close_ticet[0].date
                                                let guild = bot.guilds.cache.get(req_close_ticet[0].guild_id)
                                                let timeout = parseInt(req_close_ticet[0].timeout_réouvrir_fermeture)
                                                let categorie = req_close_ticet[0].categorie
                                                let number_id = req_close_ticet[0].number_id

                                                const embed_timeout = new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${bot.user.username} - ${ID} - Attente`,
                                                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                                })
                                                .setDescription(`Vous pourez réouvrir le ticket <t:${timeout + 600}:R> !`)
                                                .setTimestamp()
                                                .setFooter({text: ID})
                                                .setColor("DarkRed")

                                                if(timeout + 600 >= Math.floor(parseInt(Date.now()) / 1000)) { return await interaction.reply({embeds: [embed_timeout], ephemeral: true}) } else {
                                                    
                                                    await interaction.guild.channels.edit(`${interaction.channel.id}`, {name: `🔓┇${reason}-${number_id}`})
                                                    await channel.setTopic(`Ticket réouvert le <t:${Math.floor(parseInt(Date.now()) / 1000)}:F> par ${interaction.user}. Ce tiket a été créé le <t:${Math.floor(parseInt(date))}:F> par ${user_ticket}`)
                                                    
                                                    const embed_reouverture = new EmbedBuilder()
                                                    .setAuthor({
                                                        name: `${bot.user.username} - ${ID} - Réouverture`,
                                                        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                                    })
                                                    .setDescription(`Votre ticket sur le serveur ${guild.name} à bien été **réouvert** !`)
                                                    .setFields(
                                                        {
                                                            name: "ID Ticket :",
                                                            value: `${categorie} - ${reason}#${number_id}`,
                                                            inline: true
                                                        }, {
                                                            name: "Réouvert par :",
                                                            value: `${interaction.user}`,
                                                            inline: true
                                                        }, {
                                                            name: "Ticket créé le :",
                                                            value: `<t:${Math.floor(parseInt(date) / 1000)}:F>`,
                                                            inline: true
                                                        })
                                                    .setTimestamp()
                                                    .setFooter({text: ID})
                                                    .setColor("DarkGreen")

                                                    try{ await user_ticket.send({embeds: [embed_reouverture]}) } catch {}
                                                
                                                    await interaction.deferUpdate()
                                                    await db.query(`UPDATE \`ticket\` SET \`timeout_réouvrir_fermeture\` = '${Math.floor(parseInt(Date.now()) / 1000)}' WHERE \`ticket\`.\`channel\` = '${interaction.channel.id}'`)                                                
                                                    const embed_ouverture_ticket = await bot.function.embed_ouverture_ticket(bot, user_ticket, categorie, reason, number_id);
                                                    await interaction.editReply({embeds: [embed_ouverture_ticket], components: [button_ticket]})
                                                
                                                    if(req_config[0].cat_en_cours !== "false") channel.setParent(req_config[0].cat_en_cours, { lockPermissions: true })
                                                    channel.permissionOverwrites.create(interaction.guild.roles.everyone, { ViewChannel: false, SendMessages: false })
                                                    try{ channel.permissionOverwrites.create(req_config[0].role_ticket, {
                                                        ViewChannel: true,
                                                        EmbedLinks: true,
                                                        SendMessages: false,
                                                        AttachFiles: true,
                                                        ReadMessageHistory: true
                                                    }) } catch {}

                                                    try {
                                                        let msg_envoyé = await interaction.followUp({content: `Le ticket a bien été réouvert par ${interaction.user} !`}) 
                                                        await msg_envoyé.pin() 
                                                        await channel.bulkDelete(1)
                                                    } catch(err) { console.log(err) }


                                                
                                                    // Récupére tous les membres du serveur et rajoute la permission à ceux qui ont claim le ticket
                                                    await guild.members.fetch().then(async (members) => {
                                                        await members.each(async (member) => {
                                                            const result = await checkIfIntervenant(member.user.id, interaction.channel.id)
                                                            if(result) {
                                                                await channel.permissionOverwrites.create(member.user, {
                                                                    ViewChannel: true,
                                                                    EmbedLinks: true,
                                                                    SendMessages: true,
                                                                    AttachFiles: true,
                                                                    ReadMessageHistory: true
                                                                })
                                                            }
                                                        })
                                                    }).catch(console.error);
                                                }
                                            }

                                            //annulé fermeture
                                            if(interaction.customId === "annulé_fermeture") {
                                                let annulé_fermeture = req_close_ticet[0].annulé_fermeture
                                                await db.query(`UPDATE \`ticket\` SET \`annulé_fermeture\` = '${interaction.user.id}' WHERE \`ticket\`.\`channel\` = '${interaction.channel.id}'`)
                                                embed_prévention.setDescription(`Fermeture du ticket annulé par **<@${annulé_fermeture}>** !`)
                                                await interaction.deferUpdate()
                                                interaction.editReply({embeds: [embed_prévention], components: []})
                                                setTimeout(async () => {
                                                    try { await interaction.delete() } catch {}
                                                }, 60000)
                                            }

                                            //suprimmé
                                            if(interaction.customId === "suprimmé") {
                                            
                                                let channel = bot.channels.cache.get(req_close_ticet[0].channel)
                                                let user_ticket = bot.users.cache.get(req_close_ticet[0].user)
                                                let date = req_close_ticet[0].date
                                                let reason = req_close_ticet[0].reason
                                                let guild = bot.guilds.cache.get(req_close_ticet[0].guild_id)
                                                let ID = req_close_ticet[0].ID
                                                let categorie = req_close_ticet[0].categorie
                                                let number_id = req_close_ticet[0].number_id

                                                await db.query(`DELETE FROM ticket WHERE channel = '${channel.id}'`)
                                                
                                                const embed_suppression = new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${bot.user.username} - ${ID} - Suppression`,
                                                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                                                })
                                                .setDescription(`Votre ticket sur le serveur ${guild.name} à bien été **supprimé** !`)
                                                .setFields(
                                                    {
                                                        name: "ID Ticket :",
                                                        value: `${categorie} - ${reason}#${number_id}`,
                                                        inline: true
                                                    }, {
                                                        name: "Fermé par :",
                                                        value: `${interaction.user}`,
                                                        inline: true
                                                    }, {
                                                        name: "Ticket créé le :",
                                                        value: `<t:${Math.floor(parseInt(date) / 1000)}:F>`,
                                                        inline: true
                                                    })
                                                .setTimestamp()
                                                .setFooter({text: ID})
                                                .setColor("Red")

                                                try{ await user_ticket.send({embeds: [embed_suppression]}) } catch {}
                                                
                                                await channel.delete()
                                            }
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}