const Discord = require('discord.js')
const { ChannelType, EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")

module.exports = {

    name: "say",
    description: "Permet d'envoyer un message avec l'itendité du bot",
    type: 1,
    utilisation: "/say",
    permission: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    dm: false,
    category: "Administration",
    options: 
    [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "envoyer",
            description: "Envoyer un message",
            options: 
            [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "contenu",
                    description: "Le contenu du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.String,
                    name: "embed",
                    description: "Le message contient il un embed ?",
                    required: false,
                    autocomplete: true,
                }, {
                    type: ApplicationCommandOptionType.Channel,
                    name: "salon",
                    description: "Le salon où va être envoyé le message",
                    channelTypes: [ChannelType.GuildText],
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file1",
                    description: "Le file 1 du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file2",
                    description: "Le file 2 du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file3",
                    description: "Le file 3 du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file4",
                    description: "Le file 4 du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file5",
                    description: "Le file 5 du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file6",
                    description: "Le file 6 du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file7",
                    description: "Le file 7 du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file8",
                    description: "Le file 8 du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file9",
                    description: "Le file 9 du message",
                    required: false,
                }, {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "file10",
                    description: "Le file 10 du message",
                    required: false,
                }
            ],
        }, {
            type: ApplicationCommandOptionType.Subcommand,
            name: "modifier",
            description: "Modifier un messsage envoyer avec le /say",
            options: 
            [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "url",
                    description: "L'url du message",
                    required: true,
                }
            ],
        }
    ],

    async run(bot, interaction, args, db) {

        const subCommand = await args.getSubcommand()
        switch (subCommand) {
            case 'envoyer':
                let contenu = await args.getString("contenu")
                let embed = await args.getString("embed")
                let salon = await args.getChannel("salon")
                let guild = interaction.guild.id
                let date = Date.now()

                if(salon === null) salon = interaction.channel
                if(embed !== null) embed = embed.toUpperCase()
                if(embed === null) embed = "NON"
                let id = `${salon.id}_${date}`

                const embed_say_say_2000 = await bot.function.embed_say_say_2000(bot)
                const embed_say_not_message = await bot.function.embed_say_not_message(bot)
                const embed_say_option_embed_invalid = await bot.function.embed_say_option_embed_invalid(bot)
                const boutons_say = await bot.function.boutons_say(id, "danger", false, `envoyer_message_say ${id}`)
                const selectmenu_say_options = await bot.function.selectmenu_say_options(id)
                
                try { await interaction.deferReply({ephemeral: true}) } catch {}
                if(contenu !== null) if(contenu.length > 2000) return await interaction.editReply({embeds: [embed_say_say_2000], ephemeral: true})

                let file1 = await args.getAttachment("file1")
                let file2 = await args.getAttachment("file2")
                let file3 = await args.getAttachment("file3")
                let file4 = await args.getAttachment("file4")
                let file5 = await args.getAttachment("file5")
                let file6 = await args.getAttachment("file6")
                let file7 = await args.getAttachment("file7")
                let file8 = await args.getAttachment("file8")
                let file9 = await args.getAttachment("file9")
                let file10 = await args.getAttachment("file10")

                try { await interaction.deferReply({ephemeral: true}) } catch {}

                const filesArray = [file1, file2, file3, file4, file5, file6, file7, file8, file9, file10].filter(Boolean).map(file => ({ attachment: file.url, name: file.name, size: file.size}));
                filesArray.forEach(async attachment => { if(attachment.size > 25 * 1024 * 1024) {
                    await interaction.followUp({embeds: [await bot.function.embed_say_files_trop_lourd(bot, "Say", attachment.name)], ephemeral: true}) 
                    return
                }})
                
                file1 = file1 !== null ? file1.attachment : "false";
                file2 = file2 !== null ? file2.attachment : "false";
                file3 = file3 !== null ? file3.attachment : "false";
                file4 = file4 !== null ? file4.attachment : "false";
                file5 = file5 !== null ? file5.attachment : "false";
                file6 = file6 !== null ? file6.attachment : "false";
                file7 = file7 !== null ? file7.attachment : "false";
                file8 = file8 !== null ? file8.attachment : "false";
                file9 = file9 !== null ? file9.attachment : "false";
                file10 = file10 !== null ? file10.attachment : "false";

                if(contenu === null && (embed === "NON") && (file1 === "false" && file2 === "false" && file3 === "false" && file4 === "false" && file5 === "false" && file6 === "false" && file7 === "false" && file8 === "false" && file9 === "false" && file10 === "false")) return await interaction.followUp({ embeds: [embed_say_not_message], ephemeral: true })

                if(embed === "NON") {
                    try{

                        await interaction.editReply({content: "Envoie en cours...", embeds: [], files: [], components: [], ephemeral: true})
                        let msg = await salon.send({content: contenu, files: filesArray})
                        let msgURL = msg.url
                        let msgID = msg.id

                        const embed_say_réussi = await bot.function.embed_say_réussi(bot, salon, msgURL, "envoyer")
                        await interaction.editReply({content: null, embeds: [embed_say_réussi], ephemeral: true})
                        if(salon.type === ChannelType.GuildAnnouncement) await msg.crosspost()

                        await db.query(`INSERT INTO say (id, url, time, salon, guild_id) VALUES ('${msgID}', '${msgURL}', '${date}', '${salon.id}', '${guild}')`)

                    }  catch {}

                } else if(embed === "OUI") {
                    try {
                        await interaction.editReply({content: "Envoie en cours...", embeds: [], files: [], components: [], ephemeral: true})
                        await interaction.editReply({content: contenu, embeds: [], components: [selectmenu_say_options, boutons_say], files: filesArray, ephemeral: true})

                        await db.query(`INSERT INTO say (id, url, time, salon, guild_id) VALUES ('${id}', '', '${date}', '${salon.id}', '${guild}')`)
                    }  catch {}


                } else return await interaction.followUp({embeds: [embed_say_option_embed_invalid], ephemeral: true})
            break;

            case 'modifier':
                let url_modifier = await args.getString("url")

                await db.query(`SELECT * FROM say WHERE url = '${url_modifier}'`, async (err, req_modifier) => {
                    try { await interaction.deferReply({ephemeral: true}) } catch {}
                    if(req_modifier.length === 0) return await interaction.followUp({embeds: [await bot.function.embed_say_modifier_no_url(bot)], ephemeral: true})
                    let embed = false
                    let timestamp = "danger"
                    url_modifier = req_modifier[0].id
                    
                    const salon = await bot.channels.cache.get(req_modifier[0].salon)
                    let message = await salon.messages.cache.get(url_modifier)

                    if(message.embeds[0]) embed = true
                    if(message.embeds[0]) if(message.embeds[0].data.timestamp !== undefined) timestamp = "success"

                    const attachments = await message.attachments.map((attachment) => { return { name: attachment.name, attachment: attachment.url }});
                    const boutons_say = await bot.function.boutons_say(url_modifier, timestamp, embed, `envoyer_modifier_message_say ${url_modifier}`)
                    const selectmenu_say_options = await bot.function.selectmenu_say_options(url_modifier)

                    await interaction.followUp({content: message.content, embeds: message.embeds, components: [selectmenu_say_options, boutons_say], files: attachments, ephemeral: true})
                })
            break;
            default:
                await interaction.reply({content: "Une erreur est survenu, merci de contacter un membre du staff pour faire remonter l'erreur !", ephemeral: true})
            break;
        }
    }
}