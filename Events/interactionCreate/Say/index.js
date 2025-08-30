const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ChannelType } = require("discord.js")
const i18n = require('i18n');

module.exports = async (bot, interaction) => {

    let db = bot.db;
    if(!interaction.customId) return
    let customId = interaction.customId.split(" ")
    let id = customId[customId.length - 1];

    await db.query(`SELECT * FROM say WHERE id = '${id}'`, async (err, req) => {

        if(req[0] === undefined) return

        id = req[0].id
        let systeme = "Say"
        let salon_id = req[0].salon

        let timestamp_fields = false
        let timestamp_message_say
        let embed_timestamp
        let id_envoyer = `envoyer_modifier_message_say ${id}`

        if(interaction.message.components[1]) if(interaction.customId !== `timestamp_message_say ${id}`) if(interaction.message.components[1].components[2].data.style === 4) timestamp_message_say = "danger"
        if(interaction.message.components[1]) if(interaction.customId !== `timestamp_message_say ${id}`) if(interaction.message.components[1].components[2].data.style === 3) timestamp_message_say = "success"

        if(interaction.message.components[1]) if(interaction.message.components[1].components[0]) if(interaction.message.components[1].components[0].customId === `envoyer_message_say ${id}`) id_envoyer = `envoyer_message_say ${id}`

        if(interaction.message.embeds[0]) embed_timestamp = true
        if(!interaction.message.embeds[0]) embed_timestamp = false

        if(interaction.customId === `timestamp_message_say ${id}`) {
            if(interaction.message.components[1].components[2].data.style === 3) timestamp_message_say = "danger"
            if(interaction.message.components[1].components[2].data.style === 4) timestamp_message_say = "success"
            
            let embed_preview = new EmbedBuilder(interaction.message.embeds[0])
            
            if(timestamp_message_say === "success") embed_preview.setTimestamp()
            if(timestamp_message_say === "danger") embed_preview.setTimestamp(null)

            try { await interaction.deferUpdate() } catch {}
            await interaction.editReply({embeds: [embed_preview], components: [await bot.function.selectmenu_say_options(id), await bot.function.boutons_say(id, timestamp_message_say, embed_timestamp, id_envoyer)]})
            return
        }

        //const selectmenu_say_fields = await bot.function.selectmenu_say_fields(id)
        const selectmenu_say_channel = await bot.function.selectmenu_say_channel(id, timestamp_fields, salon_id)
        const selectmenu_say_options = await bot.function.selectmenu_say_options(id)

        const embed_say_salon = await bot.function.embed_say_salon(bot, salon_id)
        const embed_say_fields = await bot.function.embed_say_fields(bot, systeme)
        const preview_embed_say_default = await bot.function.preview_embed_say_default(bot)
        let boutons_say
        if(interaction.message.components[1]) if(interaction.message.components[1].components[2]) boutons_say = await bot.function.boutons_say(id, timestamp_message_say, embed_timestamp, id_envoyer)

        async function function_embed_preview(reponse, contenu, description, titre, couleur, name_auteur, text_footer, image, thumbnail, embed, embed_preview) {
            let boutons_say = await bot.function.boutons_say(id, timestamp_message_say, false, id_envoyer)
            if(!(name_auteur === "" && text_footer === "" && description === "" && titre === "" && image === "" && thumbnail === "")) boutons_say = await bot.function.boutons_say(id, timestamp_message_say, true, id_envoyer)

            let couleur_base = ""
            if(interaction.message.embeds[0]) couleur_base = (interaction.message.embeds[0].data.color && typeof interaction.message.embeds[0].data.color === 'number') ? `#${interaction.message.embeds[0].data.color.toString(16)}` : '';

            try { await reponse.deferUpdate() } catch {}
            if(name_auteur === "" && text_footer === "" && description === "" && titre === "" && image === "" && thumbnail === "") return await reponse.editReply({content: contenu, embeds: [], components: [selectmenu_say_options, boutons_say], ephemeral: true})
            if(embed === false) if(interaction.message.embeds[0]) if(description === "" || titre === "" || text_footer === "" || name_auteur === "") if(couleur === couleur_base) return await reponse.editReply({content: contenu, embeds: [embed_preview], components: [selectmenu_say_options, boutons_say], ephemeral: true})
            if(embed === false) if(interaction.message.embeds[0]) if(description === "" || titre === "" || text_footer === "" || name_auteur === "") return await reponse.editReply({content: contenu, embeds: [interaction.message.embeds[0]], components: [selectmenu_say_options, boutons_say], ephemeral: true})
            if(embed === true) await reponse.editReply({content: contenu, embeds: [embed_preview], components: [selectmenu_say_options, boutons_say], ephemeral: true})
        }


        if(interaction.customId === `info_say ${id}`) await interaction.reply({content: null, embeds: [preview_embed_say_default], ephemeral: true})

        if(interaction.customId === `retour_message_say_fields ${id}` || timestamp_fields === true || interaction.customId === `selectmenu_say_embed ${id}`) {
            const selectedCommand = interaction.values[0]

            if(selectedCommand === "Page 1") {

                let description = ""
                let titre = ""
                let url = "" 
                let couleur = ""

                if(interaction.message.embeds[0]) description = interaction.message.embeds[0].data.description
                if(interaction.message.embeds[0]) titre = interaction.message.embeds[0].data.title
                if(interaction.message.embeds[0]) url = interaction.message.embeds[0].data.url
                if(interaction.message.embeds[0]) couleur = (interaction.message.embeds[0].data.color && typeof interaction.message.embeds[0].data.color === 'number') ? interaction.message.embeds[0].data.color.toString(16) : '';

                if(description === undefined) description = ""
                if(titre === undefined) titre = ""
                if(url === undefined) url = ""
                if(couleur === undefined) couleur = "#"
                if(couleur !== undefined && couleur !== "#") couleur = `#${couleur.toUpperCase()}`

                const page1_modal = new ModalBuilder()
                .setCustomId(`modal_page1 ${id}`)
                .setTitle(`Configuration de la page 1`)

                const Contenu = new TextInputBuilder()
                .setCustomId(`contenu_modal_say ${id}`)
                .setLabel("Ecrivez le contenu du message")
                .setRequired(false)
                .setMaxLength(2000)
                .setPlaceholder(`Entrez ici le contenu de votre message`)
                .setValue(interaction.message.content)
                .setStyle(TextInputStyle.Paragraph)

                const Description = new TextInputBuilder()
                .setCustomId(`description_modal_say ${id}`)
                .setLabel("Ecrivez la description")
                .setRequired(false)
                .setMaxLength(4000)
                .setValue(description)
                .setPlaceholder(`Entrez ici la description`)
                .setStyle(TextInputStyle.Paragraph)

                const Titre = new TextInputBuilder()
                .setCustomId(`titre_modal_say ${id}`)
                .setLabel("Ecrivez le titre")
                .setRequired(false)
                .setMaxLength(256)
                .setPlaceholder(`Entrez ici le titre`)
                .setValue(titre)
                .setStyle(TextInputStyle.Paragraph)

                const URL = new TextInputBuilder()
                .setCustomId(`url_modal_say ${id}`)
                .setLabel("Ecrivez l'url du titre")
                .setRequired(false)
                .setValue(url)
                .setPlaceholder(`Entrez ici l'url du titre`)
                .setStyle(TextInputStyle.Short)

                const Couleur = new TextInputBuilder()
                .setCustomId(`couleur_modal_say ${id}`)
                .setLabel("Ecrivez la couleur (Ex : #87CEEB)")
                .setRequired(false)
                .setMaxLength(7)
                .setValue(couleur)
                .setPlaceholder("Entrez ici la couleur")
                .setStyle(TextInputStyle.Short)

                const ActionRow_Contenu = new ActionRowBuilder().addComponents(Contenu)
                const ActionRow_Description = new ActionRowBuilder().addComponents(Description)
                const ActionRow_Titre = new ActionRowBuilder().addComponents(Titre)
                const ActionRow_URL = new ActionRowBuilder().addComponents(URL)
                const ActionRow_Couleur = new ActionRowBuilder().addComponents(Couleur)

                page1_modal.addComponents(ActionRow_Contenu)
                page1_modal.addComponents(ActionRow_Description)
                page1_modal.addComponents(ActionRow_Titre)
                page1_modal.addComponents(ActionRow_URL)
                page1_modal.addComponents(ActionRow_Couleur)

                await interaction.showModal(page1_modal);

                try {

                    let reponse = await interaction.awaitModalSubmit({time: 300000})

                    let contenu = reponse.fields.getTextInputValue(`contenu_modal_say ${id}`)
                    let description = reponse.fields.getTextInputValue(`description_modal_say ${id}`)
                    let titre = reponse.fields.getTextInputValue(`titre_modal_say ${id}`)
                    let url = reponse.fields.getTextInputValue(`url_modal_say ${id}`)
                    let couleur = reponse.fields.getTextInputValue(`couleur_modal_say ${id}`)

                    let name_auteur = ""
                    let text_footer = ""
                    let image = ""
                    let thumbnail = ""
                    let embed = true

                    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                    const hexColorRegex2 = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                    if(hexColorRegex2.test(couleur)) couleur = `#${couleur}`
                    if(!hexColorRegex.test(couleur)) couleur = ""

                    const linkSans = /\b(?:(?:https?|ftp):\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
                    const linkAvec = /\b(?:https?|ftp):\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
                    const linkAvec2 = /\b(?:https?|ftp):\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
                    if(!linkAvec.test(url)) if(linkSans.test(url)) url = `https://${url}`
                    if(!linkAvec2.test(url)) url = null

                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.author) name_auteur = interaction.message.embeds[0].data.author.name
                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.footer) text_footer = interaction.message.embeds[0].data.footer.text
                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].image) image = interaction.message.embeds[0].image.url
                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].thumbnail) thumbnail = interaction.message.embeds[0].thumbnail.url

                    if(description === "" && titre === "") embed = false

                    let embed_preview = new EmbedBuilder(interaction.message.embeds[0])
                    if(!interaction.message.embeds[0]) embed_preview = new EmbedBuilder()
                    
                    if(description !== "") embed_preview.setDescription(description)
                    if(titre !== "") embed_preview.setTitle(titre)
                    if(url !== "") embed_preview.setURL(url)
                    if(couleur !== "") embed_preview.setColor(couleur)

                    if(description === "") embed_preview.setDescription(null)
                    if(titre === "") embed_preview.setTitle(null)
                    if(url === "") embed_preview.setURL(null)
                    if(couleur === "") embed_preview.setColor(null)

                    if(timestamp_message_say === "success") embed_preview.setTimestamp()
                    if(timestamp_message_say === "danger") embed_preview.setTimestamp(null)

                    await function_embed_preview(reponse, contenu, description, titre, couleur, name_auteur, text_footer, image, thumbnail, embed, embed_preview)
                } catch { return }
            }

            if(selectedCommand === "Page 2") {

                let name_auteur = ""
                let url_auteur = ""
                let iconurl_auteur = ""
                let text_footer = "" 
                let iconurl_footer = ""

                if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.author) name_auteur = interaction.message.embeds[0].data.author.name
                if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.author) url_auteur = interaction.message.embeds[0].data.author.url
                if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.author) iconurl_auteur = interaction.message.embeds[0].data.author.icon_url
                if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.footer) text_footer = interaction.message.embeds[0].data.footer.text
                if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.footer) iconurl_footer = interaction.message.embeds[0].data.footer.icon_url

                if(name_auteur === undefined) name_auteur = ""
                if(url_auteur === undefined) url_auteur = ""
                if(iconurl_auteur === undefined) iconurl_auteur = ""
                if(text_footer === undefined) text_footer = ""
                if(iconurl_footer === undefined) iconurl_footer = ""

                const page2_modal = new ModalBuilder()
                .setCustomId(`modal_page2 ${id}`)
                .setTitle(`Configuration de la page 2`)

                const Name_auteur = new TextInputBuilder()
                .setCustomId(`name_auteur_modal_say ${id}`)
                .setLabel("Ecrivez le nom de l'auteur")
                .setRequired(false)
                .setMaxLength(4000)
                .setPlaceholder(`Entrez ici le nom de l'auteur`)
                .setValue(name_auteur)
                .setStyle(TextInputStyle.Paragraph)

                const Url_auteur = new TextInputBuilder()
                .setCustomId(`url_auteur_modal_say ${id}`)
                .setLabel("Ecrivez l'URL de l'auteur")
                .setRequired(false)
                .setValue(url_auteur)
                .setPlaceholder(`Entrez ici l'URL de l'auteur`)
                .setStyle(TextInputStyle.Short)

                const Iconurl_auteur = new TextInputBuilder()
                .setCustomId(`iconurl_auteur_modal_say ${id}`)
                .setLabel("Ecrivez l'URL de l'image de l'auteur")
                .setRequired(false)
                .setPlaceholder(`Entrez ici l'URL de l'image de l'auteur`)
                .setValue(iconurl_auteur)
                .setStyle(TextInputStyle.Short)

                const Text_footer = new TextInputBuilder()
                .setCustomId(`text_footer_modal_say ${id}`)
                .setLabel("Ecrivez le text du footer")
                .setRequired(false)
                .setValue(text_footer)
                .setPlaceholder(`Entrez ici le text du footer`)
                .setStyle(TextInputStyle.Paragraph)

                const Iconurl_footer = new TextInputBuilder()
                .setCustomId(`iconurl_footer_modal_say ${id}`)
                .setLabel("Ecrivez l'url de l'image du footer")
                .setRequired(false)
                .setValue(iconurl_footer)
                .setPlaceholder(`Entrez ici l'url de l'image du footer`)
                .setStyle(TextInputStyle.Short)

                const ActionRow_Name_auteur = new ActionRowBuilder().addComponents(Name_auteur)
                const ActionRow_Url_auteur = new ActionRowBuilder().addComponents(Url_auteur)
                const ActionRow_Iconurl_auteur = new ActionRowBuilder().addComponents(Iconurl_auteur)
                const ActionRow_Text_footer = new ActionRowBuilder().addComponents(Text_footer)
                const ActionRow_Iconurl_footer = new ActionRowBuilder().addComponents(Iconurl_footer)

                page2_modal.addComponents(ActionRow_Name_auteur)
                page2_modal.addComponents(ActionRow_Url_auteur)
                page2_modal.addComponents(ActionRow_Iconurl_auteur)
                page2_modal.addComponents(ActionRow_Text_footer)
                page2_modal.addComponents(ActionRow_Iconurl_footer)

                await interaction.showModal(page2_modal);

                try {

                    let reponse = await interaction.awaitModalSubmit({time: 300000})

                    let name_auteur = reponse.fields.getTextInputValue(`name_auteur_modal_say ${id}`)
                    let url_auteur = reponse.fields.getTextInputValue(`url_auteur_modal_say ${id}`)
                    let iconurl_auteur = reponse.fields.getTextInputValue(`iconurl_auteur_modal_say ${id}`)
                    let text_footer = reponse.fields.getTextInputValue(`text_footer_modal_say ${id}`)
                    let iconurl_footer = reponse.fields.getTextInputValue(`iconurl_footer_modal_say ${id}`)

                    let contenu = interaction.message.content
                    let description = ""
                    let titre = ""
                    let couleur = ""
                    let image = ""
                    let thumbnail = ""
                    let embed = true
                    
                    const linkSans = /\b(?:(?:https?|ftp):\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
                    const linkAvec = /\b(?:https?|ftp):\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
                    const linkAvec2 = /\b(?:https?|ftp):\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
                    if(!linkAvec.test(url_auteur)) if(linkSans.test(url_auteur)) url_auteur = `https://${url_auteur}`
                    if(!linkAvec2.test(url_auteur)) url_auteur = null

                    const regexImages = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|tif|tiff|webp|svg|apng|ico|cur))/gi;
                    if(!regexImages.test(iconurl_auteur)) iconurl_auteur = null
                    const regexImages2 = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|tif|tiff|webp|svg|apng|ico|cur))/gi;
                    if(!regexImages2.test(iconurl_footer)) iconurl_footer = null

                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.description) description = interaction.message.embeds[0].data.description
                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.title) titre = interaction.message.embeds[0].data.title
                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].image) image = interaction.message.embeds[0].image.url
                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].thumbnail) thumbnail = interaction.message.embeds[0].thumbnail.url
                    if(interaction.message.embeds[0]) couleur = (interaction.message.embeds[0].data.color && typeof interaction.message.embeds[0].data.color === 'number') ? interaction.message.embeds[0].data.color.toString(16) : '';
                    if(couleur !== undefined && couleur !== "") couleur = `#${couleur.toUpperCase()}`

                    if(name_auteur === "" && text_footer === "") embed = false

                    let embed_preview = new EmbedBuilder(interaction.message.embeds[0])
                    if(!interaction.message.embeds[0]) embed_preview = new EmbedBuilder()

                    if(name_auteur !== "") embed_preview.setAuthor({name: name_auteur, url: url_auteur, iconURL: iconurl_auteur})
                    if(text_footer !== "") embed_preview.setFooter({text: text_footer, iconURL: iconurl_footer})
                    if(name_auteur === "") embed_preview.setAuthor(null)
                    if(text_footer === "") embed_preview.setFooter(null)

                    if(timestamp_message_say === "success") embed_preview.setTimestamp()
                    if(timestamp_message_say === "danger") embed_preview.setTimestamp(null)

                    await function_embed_preview(reponse, contenu, description, titre, couleur, name_auteur, text_footer, image, thumbnail, embed, embed_preview)
                } catch { return }
            }

            if(selectedCommand === "Page 3") {

                let image = ""
                let thumbnail = ""

                if(interaction.message.embeds[0]) if(interaction.message.embeds[0].image) if(interaction.message.embeds[0].image.url) image = interaction.message.embeds[0].image.url
                if(interaction.message.embeds[0]) if(interaction.message.embeds[0].thumbnail) if(interaction.message.embeds[0].thumbnail.url) thumbnail = interaction.message.embeds[0].thumbnail.url

                if(image === undefined) image = ""
                if(thumbnail === undefined) thumbnail = ""

                const page3_modal = new ModalBuilder()
                .setCustomId(`modal_page3 ${id}`)
                .setTitle(`Configuration de la page 3`)

                const Image = new TextInputBuilder()
                .setCustomId(`image_modal_say ${id}`)
                .setLabel("Ecrivez l'URL de l'image")
                .setRequired(false)
                .setPlaceholder(`Entrez ici l'URL de l'image`)
                .setValue(image)
                .setStyle(TextInputStyle.Short)

                const Thumbnail = new TextInputBuilder()
                .setCustomId(`thumbnail_modal_say ${id}`)
                .setLabel("Ecrivez l'URL du thumbnail")
                .setRequired(false)
                .setValue(thumbnail)
                .setPlaceholder(`Entrez ici l'URL du thumbnail`)
                .setStyle(TextInputStyle.Short)

                const ActionRow_Image = new ActionRowBuilder().addComponents(Image)
                const ActionRow_Thumbnail = new ActionRowBuilder().addComponents(Thumbnail)

                page3_modal.addComponents(ActionRow_Image)
                page3_modal.addComponents(ActionRow_Thumbnail)

                await interaction.showModal(page3_modal);

                try {

                    let reponse = await interaction.awaitModalSubmit({time: 300000})

                    let image = reponse.fields.getTextInputValue(`image_modal_say ${id}`)
                    let thumbnail = reponse.fields.getTextInputValue(`thumbnail_modal_say ${id}`)

                    let contenu = interaction.message.content
                    let description = ""
                    let titre = ""
                    let couleur = ""
                    let text_footer = ""
                    let name_auteur = ""
                    let embed = true

                    const regexImages = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|tif|tiff|webp|svg|apng|ico|cur))/gi;
                    if(!regexImages.test(image)) image = ""
                    const regexImages2 = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|tif|tiff|webp|svg|apng|ico|cur))/gi;
                    if(!regexImages2.test(thumbnail)) iconurl_footer = ""

                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.description) description = interaction.message.embeds[0].data.description
                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.title) titre = interaction.message.embeds[0].data.title
                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.author) name_auteur = interaction.message.embeds[0].data.author.name
                    if(interaction.message.embeds[0]) if(interaction.message.embeds[0].data.footer) text_footer = interaction.message.embeds[0].data.footer.text
                    if(interaction.message.embeds[0]) couleur = (interaction.message.embeds[0].data.color && typeof interaction.message.embeds[0].data.color === 'number') ? interaction.message.embeds[0].data.color.toString(16) : '';
                    if(couleur !== undefined && couleur !== "") couleur = `#${couleur.toUpperCase()}`

                    if(image === "" && thumbnail === "") embed = false

                    let embed_preview = new EmbedBuilder(interaction.message.embeds[0])
                    if(!interaction.message.embeds[0]) embed_preview = new EmbedBuilder()

                    if(image !== "") embed_preview.setImage(image)
                    if(thumbnail !== "") embed_preview.setThumbnail(thumbnail)
                    if(image === "") embed_preview.setImage(null)
                    if(thumbnail === "") embed_preview.setThumbnail(null)

                    if(timestamp_message_say === "success") embed_preview.setTimestamp()
                    if(timestamp_message_say === "danger") embed_preview.setTimestamp(null)

                    await function_embed_preview(reponse, contenu, description, titre, couleur, name_auteur, text_footer, image, thumbnail, embed, embed_preview)
                } catch { return }
            }
        }

        if(interaction.customId === `retour_message_say ${id}`) {

            await interaction.deferUpdate()
            await interaction.editReply({embeds: [preview_embed_say], components: [selectmenu_say_options, boutons_say], ephemeral: true})
        }

        if(interaction.customId === `selectmenu_say_channel ${id}` || interaction.customId === `selectmenu_say_channel_fields ${id}`) await db.query(`UPDATE say SET salon = '${interaction.values[0]}' WHERE id = '${id}'`)

        if(interaction.customId === `salon_message_say ${id}`) return await interaction.reply({embeds: [embed_say_salon], components: [selectmenu_say_channel], ephemeral: true})

        if(interaction.customId === `envoyer_message_say ${id}` || interaction.customId === `envoyer_modifier_message_say ${id}`) {
            const attachments = await interaction.message.attachments.map((attachment) => { return { name: attachment.name, attachment: attachment.url }})
            const salon = await bot.channels.cache.get(salon_id)
            const embed_say_rien = await bot.function.embed_say_rien(bot)
            let message
            if(interaction.customId === `envoyer_modifier_message_say ${id}`) message = await salon.messages.cache.get(id)

            let msg
            let embed_say_réussi
            let contenu = await interaction.message.content
            const embed = await interaction.message.embeds[0]
            await interaction.deferUpdate()
            await interaction.editReply({content: "Envoie en cours...", embeds: [], files: [], components: [], ephemeral: true})

            if(contenu === "" && embed === undefined && attachments[0] === undefined) return await interaction.editReply({embeds: [embed_say_rien], files: [], components: [], ephemeral: true})

            if(interaction.customId === `envoyer_message_say ${id}`) if(embed !== undefined) msg = await salon.send({content: contenu, embeds: [embed], files: attachments})
            if(interaction.customId === `envoyer_message_say ${id}`) if(embed === undefined) msg = await salon.send({content: contenu, embeds: [], files: attachments})

            if(interaction.customId === `envoyer_modifier_message_say ${id}`) if(embed !== undefined) msg = await message.edit({content: contenu, embeds: [embed], files: attachments})
            if(interaction.customId === `envoyer_modifier_message_say ${id}`) if(embed === undefined) msg = await message.edit({content: contenu, embeds: [], files: attachments})
            
            if(interaction.customId === `envoyer_message_say ${id}`) embed_say_réussi = await bot.function.embed_say_réussi(bot, `<#${salon_id}>`, msg.url, "envoyer")
            if(interaction.customId === `envoyer_modifier_message_say ${id}`) embed_say_réussi = await bot.function.embed_say_réussi(bot, `<#${salon_id}>`, msg.url, "modifier")

            await db.query(`UPDATE say SET url = '${msg.url}', id = '${msg.id}' WHERE id = '${id}'`)
            if(salon.type === ChannelType.GuildAnnouncement) await msg.crosspost()
            await interaction.editReply({content: "", embeds: [embed_say_réussi], files: [], components: [], ephemeral: true})
        }

        if(interaction.customId === `say_menu ${id}`) {

            await interaction.deferUpdate()
            await interaction.editReply({embeds: [preview_embed_say, embed_say_fields], components: [selectmenu_say_fields, boutons_say], ephemeral: true})    
        }
        if(interaction.customId === `selectmenu_say_channel_fields ${id}`) {
            try { await interaction.deferUpdate() } catch {}
            try { await interaction.editReply({embeds: [preview_embed_say, embed_say_fields], components: [selectmenu_say_fields, boutons_say], ephemeral: true}) } catch {}
        }

        if(interaction.customId === `retour_message_say_fields ${id}` || timestamp_fields === true || interaction.customId === `selectmenu_say_embed ${id}`) {
            if(interaction.customId === `retour_message_say ${id}`) return
            let selectedCommand = ""
            if(interaction.customId === `selectmenu_say_embed ${id}`) selectedCommand = interaction.values[0];

            //fields
            if((interaction.customId === `retour_message_say_fields ${id}`) || selectedCommand === "fields") {

                try { await interaction.deferUpdate() } catch {}
                try { await interaction.editReply({embeds: [preview_embed_say, embed_say_fields], components: [selectmenu_say_fields, boutons_say], ephemeral: true}) } catch {}
            
            }

            /*if(interaction.customId === `selectmenu_say_fields ${id}`) {

            const selectedCommand = interaction.values[0];

            const fields_add = new ModalBuilder()
            .setCustomId(`field_add_say ${id}`)
            .setTitle(`Ajouter le ${selectedCommand}`)

            const question1 = new Discord.TextInputBuilder()
            .setCustomId(`field_name_say ${id}`)
            .setLabel("Ecrivez le titre du field")
            .setRequired(false)
            .setMinLength(1)
            .setPlaceholder(`Entrez votre réponse ici`)
            .setStyle(TextInputStyle.Short)

            const question2 = new Discord.TextInputBuilder()
            .setCustomId(`field_description_say ${id}`)
            .setLabel("Ecrivez la description du field")
            .setRequired(false)
            .setMinLength(1)
            .setMaxLength(4000)
            .setPlaceholder(`Entrez votre réponse ici`)
            .setStyle(TextInputStyle.Paragraph)

            const question3 = new Discord.TextInputBuilder()
            .setCustomId(`field_inline_say ${id}`)
            .setLabel(`Définir si le field doit être aligné ou pas`)
            .setRequired(false)
            .setMinLength(4)
            .setMaxLength(5)
            .setPlaceholder(`Entrez uniquement "true" ou "false" ici`)
            .setValue("true")
            .setStyle(TextInputStyle.Short)

            const ActionRow1 = new ActionRowBuilder().addComponents(question1);
            const ActionRow2 = new ActionRowBuilder().addComponents(question2);
            const ActionRow3 = new ActionRowBuilder().addComponents(question3);

            fields_add.addComponents(ActionRow1)
            fields_add.addComponents(ActionRow2)
            fields_add.addComponents(ActionRow3)

            await interaction.showModal(fields_add);

            try {

                let reponse = await interaction.awaitModalSubmit({time: 300000})

                let whatToSay = reponse.fields.getTextInputValue(`field_name_say ${id}`)
                let whatToSay2 = reponse.fields.getTextInputValue(`field_description_say ${id}`)
                let whatToSay3 = reponse.fields.getTextInputValue(`field_inline_say ${id}`)

                if(whatToSay === "") whatToSay = "false"
                if(whatToSay2 === "") whatToSay2 = "false"
                if(whatToSay3 !== "true") whatToSay3 = "false"


                whatToSay = whatToSay.replace(/'/g, "\\\'");
                whatToSay2 = whatToSay2.replace(/'/g, "\\\'");
                await db.query(`UPDATE say_fields_name SET ${selectedCommand} = '${whatToSay}' WHERE id = '${id}'`)
                await db.query(`UPDATE say_fields_description SET ${selectedCommand} = '${whatToSay2}' WHERE id = '${id}'`)
                await db.query(`UPDATE say_fields_inline SET ${selectedCommand} = '${whatToSay3}' WHERE id = '${id}'`)

                await db.query(`SELECT * FROM say_fields_name WHERE id = '${id}'`, async (err, req_name) => {
                    await db.query(`SELECT * FROM say_fields_description WHERE id = '${id}'`, async (err, req_description) => {
                        await db.query(`SELECT * FROM say_fields_inline WHERE id = '${id}'`, async (err, req_inline) => {
                            
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

                            preview_embed_say.setFields(fields);

                            await reponse.deferUpdate()
                            await reponse.editReply({embeds: [preview_embed_say, embed_say_fields], components: [selectmenu_say_fields, boutons_say1], ephemeral: true})
                        })
                    })
                })
            } catch (err) {
                try { await interaction.deferUpdate() } catch {}
                return
        }
        }*/

        }

        if(interaction.customId === `selectmenu_say_channel ${id}` || interaction.customId === `selectmenu_say_channel_fields ${id}`) {
            await db.query(`SELECT * FROM say WHERE id = '${id}'`, async (err, req_salon) => {
                const salon_id = req_salon[0].salon
                const embed_say_salon = await bot.function.embed_say_salon(bot, salon_id)
                const embed_say_salon_réussi = await bot.function.embed_say_salon_réussi(bot, salon_id)
                const selectmenu_say_channel = await bot.function.selectmenu_say_channel(id, timestamp_fields, salon_id)

                try { await interaction.deferUpdate() } catch {}
                try { await interaction.editReply({ embeds: [embed_say_salon, embed_say_salon_réussi], components: [selectmenu_say_channel], ephemeral: true }) } catch (err) { console.error(err) }
            })
        }
        /*try { if(interaction.customId === `selectmenu_say_channel ${id}` || interaction.customId === `selectmenu_say_channel_fields ${id}`) {
            const message = await interaction.channel.messages.fetch(interaction.message.id)

            await message.edit({embeds: [embed_say_salon_réussi], ephemeral: true}) }
        } catch (err) { console.error(err) }*/

        /*if(interaction.customId !== `selectmenu_say_channel ${id}` || interaction.customId !== `selectmenu_say_channel_fields ${id}`) timestamp_fields = false
        if(timestamp_fields === true) return
        setTimeout(async () => {
            await db.query(`SELECT * FROM say WHERE id = '${id}'`, async (err, req2) => {

                if(interaction.isStringSelectMenu()) return
                if(req2[0] === undefined) return
        
                active = false
                id = req2[0].id

                try { await interaction.deferUpdate() } catch {}
                try { if(interaction.customId !== `selectmenu_say_channel_fields ${id}` && interaction.customId !== `retour_message_say_fields ${id}` && interaction.customId !== `salon_message_say ${id}` && interaction.customId !== `selectmenu_say_embed ${id}` && interaction.customId !== `selectmenu_say_fields ${id}`&& interaction.customId !== `envoyer_message_say ${id}`) try { await interaction.editReply({embeds: [], components: [selectmenu_say_options, boutons_say], ephemeral: true}) } catch {} } catch {}
            })
        }, 1500)*/
    })
}