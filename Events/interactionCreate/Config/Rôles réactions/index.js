const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require("discord.js")

module.exports = async (bot, interaction) => {

    let db = bot.db
    let systeme = "🎭 Rôles réactions"
    let date = Date.now()
    /*let customId = interaction.customId.split(" ")
    let id = customId[customId.length - 1]*/

    const embed_rôles_réaction_config = await bot.function.embed_rôles_réaction_config(bot, systeme)
    const embed_role_reaction_pas_lien = await bot.function.embed_role_reaction_pas_lien(bot, systeme)
    const embed_role_reaction_message_supprime = await bot.function.embed_role_reaction_message_supprime(bot, systeme)
    const embed_role_reaction_message_supprime2 = await bot.function.embed_role_reaction_message_supprime2(bot, systeme)
    const boutons_nouveau_rôles_réactions = await bot.function.boutons_nouveau_rôles_réactions()

    const boutons_config_rôles_réactions = await bot.function.boutons_config_rôles_réactions()
    const selectmenu_config = await bot.function.selectmenu_config(systeme)

    if(interaction.customId === "indinquez_role_reaction") {
        const message_indiquez = new ModalBuilder()
        .setCustomId("message_indiquez")
        .setTitle("Lien rôle réaction")
    
        const url = new TextInputBuilder()
        .setCustomId("url")
        .setLabel("Entrez le lien du message ci-dessous")
        .setRequired(true)
        .setPlaceholder("Entrez le lien du message ici")
        .setStyle(TextInputStyle.Short)
    
        const ActionRow_url = new ActionRowBuilder().addComponents(url);
        message_indiquez.addComponents(ActionRow_url)
    
        await interaction.showModal(message_indiquez);
    
        try {
    
            let reponse = await interaction.awaitModalSubmit({time: 300000})
            let url = await reponse.fields.getTextInputValue("url")

            await db.query(`SELECT * FROM rôles_réactions WHERE url = '${url}'`, async (err, req_rôle_reaction) => {
                await db.query(`SELECT * FROM say WHERE url = '${url}'`, async (err, req_say) => {
                    
                    try { await reponse.deferUpdate() } catch {}

                    const liendisord = /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/
                    if(liendisord.test(url) === false) return await reponse.editReply({embeds: [embed_role_reaction_pas_lien, embed_rôles_réaction_config], ephemeral: true})

                    try {

                        // Vérifie si le message existe
                        try { 
                            const salon = await interaction.guild.channels.cache.get(await url.split('/')[5])
                            await salon.messages.fetch(await url.split('/').pop())
                         } catch { 
                            await reponse.editReply({embeds: [embed_role_reaction_message_supprime, embed_rôles_réaction_config], ephemeral: true})
                            return
                        }

                        const salon = await interaction.guild.channels.cache.get(await url.split('/')[5])
                        const message = await salon.messages.fetch(await url.split('/').pop())
                        const fields = [];

                        //Message dans tout
                        if(req_rôle_reaction.length !== 0) {
                            let options = [{ label: "Pas configuré", value: "Pas configuré" }];
                            
                            // Vérifier si le message contient des composants
                            if(message.components) if(message.components.length !== 0) options = message.components[0].components[0].options;
                            for(let i = 0; i < 25; i++) {
                                let name = `Rôle réaction ${i + 1}`
                                let value = "Pas configuré"
                                if(options[i]) name = options[i].label
                                if(options[i]) value = options[i].value
                
                                // Ajouter un field avec le label et la value correspondants
                                if(value !== "Pas configuré") fields.push({
                                    name: `Rôle réaction ${i + 1}`,
                                    value: `Le rôle réaction ${i + 1} est attribué au rôle : <@&${value}>`,
                                    inline: true
                                })
                            }

                            await reponse.editReply({content: "", embeds: [await bot.function.embed_rôles_réaction_gérer(bot, systeme, url, fields)], components: [await bot.function.boutons_config_rôles_réactions_gérer(req_rôle_reaction[0].number)], ephemeral: true})
                            return
                        }
                        
                        const boutons_config_rôles_réactions_gérer = await bot.function.boutons_config_rôles_réactions_gérer(0)
                        /*fields.push({
                            name: `Rôle réaction ${i + 1}`,
                            value: "Pas configuré",
                            inline: true
                        })*/

                        if(req_say.length === 0) {
                            let attachmentsArray
                            const jsonData = message.toJSON()

                            if(message.attachments.size > 0) attachmentsArray = await message.attachments.map((attachment) => { return { name: attachment.name, attachment: attachment.url }})
                            if(message.attachments.size > 0) await message.attachments.forEach(async attachment => { if(attachment.size > 25 * 1024 * 1024) {
                                await interaction.followUp({content: "", embeds: [await bot.function.embed_say_files_trop_lourd(bot, systeme, attachment.name)], ephemeral: true}) 
                                return
                            }})

                            try {
                                await message.delete()
                                let msg = await salon.send({content: jsonData.content, embeds: jsonData.embeds, files: attachmentsArray})

                                await db.query('INSERT INTO say (id, url, time, salon, guild_id) VALUES (?, ?, ?, ?, ?)', [msg.id, msg.url, date, salon.id, msg.guild.id], (error, results) => { if(error) console.error(error) })
                                await db.query('INSERT INTO rôles_réactions (id, url, time, salon, guild_id) VALUES (?, ?, ?, ?, ?)', [msg.id, msg.url, date, salon.id, msg.guild.id], (error, results) => { if(error) console.error(error) })
                                await reponse.editReply({content: "", embeds: [await bot.function.embed_rôles_réaction_gérer(bot, systeme, msg.url, fields)], components: [boutons_config_rôles_réactions_gérer], ephemeral: true})
                            } catch {}

                        } else {
                            await db.query('INSERT INTO rôles_réactions (id, url, time, salon, guild_id) VALUES (?, ?, ?, ?, ?)', [req_say[0].id, url, date, salon.id, message.guild.id], (error, results) => { if(error) console.error(error) })
                            await reponse.editReply({content: "", embeds: [await bot.function.embed_rôles_réaction_gérer(bot, systeme, url, fields)], components: [boutons_config_rôles_réactions_gérer], ephemeral: true})
                        }

                        await db.query(`SELECT * FROM server WHERE guild = '${interaction.guild.id}'`, async (error, req_server) => {
                            if(error) return console.error(error)
                            await db.query(`UPDATE server SET number_roles_réactions = '${parseInt(req_server[0].number_roles_réactions) + 1}' WHERE guild = '${interaction.guild.id}'`)
                        })
                    } catch (error) {console.error(error)}
                })
            })
        } catch (err) { return; }
    }

    if(interaction.customId === "nouveau_rôle_rôles_réactions") {

        const embed_rôles_réactions_reaction_nouveau = new EmbedBuilder(interaction.message.embeds[0])
        .setDescription(`Sélectionnez dans le selectmenu ci-dessous le numéro du rôles réaction que vous souhaitez configurer.`)

        await interaction.deferUpdate()
        await interaction.editReply({embeds: [embed_rôles_réactions_reaction_nouveau], components: [await bot.function.selectmenu_nouveau_rôles_réaction(), boutons_nouveau_rôles_réactions]})
    }

    if(interaction.customId === "selectmenu_nouveau_config_rôles_réactions") {
        const selectedCommand = interaction.values[0]

        const embed_rôles_réactions_reaction_nouveau = new EmbedBuilder(interaction.message.embeds[0])
        .setAuthor({
            name: `${bot.user.username} - ${systeme} - Configuration - Numéro ${selectedCommand}`,
            iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
        })
        .setDescription(`Sélectionnez dans le selectmenu ci-dessous le rôle qui sera attribué.`)
        .setFields()

        await interaction.deferUpdate()
        await interaction.editReply({embeds: [embed_rôles_réactions_reaction_nouveau], components: [await bot.function.selectmenu_config_rôle_rôles_réaction(selectedCommand), boutons_nouveau_rôles_réactions]})
    }

    if(interaction.customId) if(interaction.customId.startsWith("selectmenu_config_rôle_rôles_réaction")) {
        const selectedCommand = interaction.values[0]
        let customId = interaction.customId.split(" ")
        let nombre = parseInt(customId[customId.length - 1])
        let url = false

        await interaction.deferUpdate()
        
        if(await interaction.message.embeds[0]) url = await interaction.message.embeds[0].url
        if(url === false) {
            await interaction.editReply({embeds: [embed_role_reaction_message_supprime2, embed_rôles_réaction_config], ephemeral: true})
            return
        }

        // Vérifie si le message existe encore
        try {
            const salon = await interaction.guild.channels.cache.get(await url.split('/')[5])
            await salon.messages.fetch(await url.split('/').pop())
        } catch {
            await interaction.editReply({content: "", embeds: [embed_role_reaction_message_supprime2, embed_rôles_réaction_config], components: [selectmenu_config, boutons_config_rôles_réactions], ephemeral: true})
            return
        }

        await db.query(`SELECT * FROM rôles_réactions WHERE url = '${url}'`, async (err, req_rôle_reaction) => {
            

            const guild = await bot.guilds.cache.get(interaction.guild.id)
            const role = await guild.roles.cache.get(selectedCommand);
            const rôle_bot = await guild.members.cache.get(bot.user.id).roles.highest.rawPosition

            if(role.position === rôle_bot) return interaction.followUp({embeds: [await bot.function.embed_rôles_réactions_rôles_erreur(bot, systeme, selectedCommand, "mien")], ephemeral: true})
            if(role.position > rôle_bot) return interaction.followUp({embeds: [await bot.function.embed_rôles_réactions_rôles_erreur(bot, systeme, selectedCommand, "suppérieur")], ephemeral: true})
            if(!role.editable) return interaction.followUp({embeds: [await bot.function.embed_rôles_réactions_rôles_erreur(bot, systeme, selectedCommand, "attribuer")], ephemeral: true})
            

            const salon = await interaction.guild.channels.cache.get(await url.split('/')[5])
            const message = await salon.messages.fetch(await url.split('/').pop())

            const fields = [];
            const optionselectmenu = []
            let options = [{ label: "Pas configuré", value: "Pas configuré" }];
            // Vérifier si le message contient des composants
            if(message.components) if(message.components.length !== 0) options = message.components[0].components[0].options;
            console.log(options)
            for(let i = 0; i < 25; i++) {
                if(options[i]) if(options[i].value === selectedCommand) if(i + 1 !== nombre) return await interaction.followUp({embeds: [await bot.function.embed_rôles_reactions_config_existe_déjà(bot, systeme, options[i].value, i+1)], ephemeral: true})
                let name = `Rôle réaction ${i + 1}`
                let value = "Pas configuré"
                if(options[i]) name = options[i].label
                if(options[i]) value = options[i].value

                if(nombre === i + 1) name = role.name
                if(nombre === i + 1) value = role.id

                console.log(i + 1)
                console.log(value)

                // Ajouter un field avec le label et la value correspondants
                if(value !== "Pas configuré") fields.push({
                    name: `Rôle réaction ${i + 1}`,
                    value: `Le rôle réaction ${i + 1} est attribué au rôle : <@&${value}>`,
                    inline: true
                });

                if(value !== "Pas configuré") optionselectmenu.push({
                    label: name,
                    value: value,
                });
            }

            let number = 0
            if(fields) number = fields.length

            const selectmenu_rôles_réaction = await bot.function.selectmenu_rôles_réaction(optionselectmenu)
            await message.edit({components: [selectmenu_rôles_réaction]})

            await db.query(`UPDATE rôles_réactions SET number = '${number}' WHERE url = '${url}'`)
            await interaction.editReply({content: "", embeds: [await bot.function.embed_rôles_réaction_gérer(bot, systeme, url, fields)], components: [await bot.function.boutons_config_rôles_réactions_gérer(number)], ephemeral: true})
        })
    }

    if(interaction.customId === "selectmenu_rôles_réaction") {
        const roleId = await interaction.values[0]
        const role = await interaction.guild.roles.cache.get(roleId);

        await interaction.deferUpdate()

        if(!role) {

            const optionselectmenu = []
            let options = [{ label: "Pas configuré", value: "Pas configuré" }];
            // Vérifier si le message contient des composants
            if(interaction.message.components) if(interaction.message.components.length !== 0) options = interaction.message.components[0].components[0].options;
            for(let i = 0; i < 25; i++) {
                let name = `Rôle réaction ${i + 1}`
                let value = "Pas configuré"
                if(options[i]) name = options[i].label
                if(options[i]) value = options[i].value
                if(options[i]) if(options[i].value === roleId) value = "Pas configuré"

                if(value !== "Pas configuré") optionselectmenu.push({
                    label: name,
                    value: value,
                });
            }

            await interaction.followUp({ embeds : [await bot.function.embed_role_reaction_message_fin_erreur1(bot, systeme)], ephemeral: true })
            await interaction.message.edit({ content: interaction.message.content, components: [await bot.function.selectmenu_rôles_réaction(optionselectmenu)] });
            return
        }

        if (interaction.member.roles.cache.has(roleId)) {
            try {
                await interaction.member.roles.remove(roleId);
                await interaction.followUp({ embeds : [await bot.function.embed_role_reaction_message_fin_retirer(bot, systeme, role)], ephemeral: true })
                await interaction.message.edit({ content: interaction.message.content });
                return
            } catch (error) {
                await interaction.followUp({ embeds : [await bot.function.embed_role_reaction_message_fin_erreur2(bot, systeme)], ephemeral: true })
                console.error(`Erreur lors de la retiration du rôle :`, error);
                return
            }
        } else {
            try {
                await interaction.member.roles.add(roleId);
                await interaction.followUp({ embeds : [await bot.function.embed_role_reaction_message_fin_attribué(bot, systeme, role)], ephemeral: true })
                await interaction.message.edit({ content: interaction.message.content });
                return
            } catch (error) {
                await interaction.followUp({ embeds : [await bot.function.embed_role_reaction_message_fin_erreur3(bot, systeme)], ephemeral: true })
                console.error(`Erreur lors de l'ajout du rôle :`, error);
                return
            }
        }
    }

    if(interaction.customId === "selectmenu_config") systeme = interaction.values[0];

    if(interaction.customId === "retour_config_role_reaction") {

        let url = false
        await interaction.deferUpdate()

        if(await interaction.message.embeds[0]) url = await interaction.message.embeds[0].url
        if(url === false) return await interaction.editReply({embeds: [embed_role_reaction_message_supprime2, embed_rôles_réaction_config], ephemeral: true})

        await db.query(`SELECT * FROM rôles_réactions WHERE url = '${url}'`, async (err, req_rôle_reaction) => {
            // Vérifie si le message existe
            try { 
                const salon = await interaction.guild.channels.cache.get(await url.split('/')[5])
                await salon.messages.fetch(await url.split('/').pop())
            } catch { 
                await interaction.editReply({embeds: [embed_role_reaction_message_supprime, embed_rôles_réaction_config], ephemeral: true})
                return
            }
        
            const salon = await interaction.guild.channels.cache.get(await url.split('/')[5])
            const message = await salon.messages.fetch(await url.split('/').pop())
            const fields = []
            let options = [{ label: "Pas configuré", value: "Pas configuré" }];
                                
            // Vérifier si le message contient des composants
            if(message.components) if(message.components.length !== 0) options = message.components[0].components[0].options;
            for(let i = 0; i < 25; i++) {
                let name = `Rôle réaction ${i + 1}`
                let value = "Pas configuré"
                if(options[i]) name = options[i].label
                if(options[i]) value = options[i].value

                // Ajouter un field avec le label et la value correspondants
                if(value !== "Pas configuré") fields.push({
                    name: `Rôle réaction ${i + 1}`,
                    value: `Le rôle réaction ${i + 1} est attribué au rôle : <@&${value}>`,
                    inline: true
                })
            }

            await interaction.editReply({content: "", embeds: [await bot.function.embed_rôles_réaction_gérer(bot, systeme, url, fields)], components: [await bot.function.boutons_config_rôles_réactions_gérer(req_rôle_reaction[0].number)], ephemeral: true})
        })
    }


    if(interaction.customId === "selectmenu_config" || ((interaction.customId) && interaction.customId.startsWith("selectmenu_config_rôles")) || interaction.customId === "config_rôles" || interaction.customId === "annulé_config_role_reaction" || interaction.customId === "retour_rôles_réactions") {
        if(systeme === "🎭 Rôles réactions" || interaction.customId === "annulé_config_role_reaction"  || interaction.customId === "retour_rôles_réactions") {
     
            await interaction.deferUpdate()
            await interaction.editReply({embeds: [embed_rôles_réaction_config], components: [selectmenu_config, boutons_config_rôles_réactions], ephemeral: true})
        }
    }
}