const { PermissionFlagsBits, ChannelType, ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js")
const i18n = require('i18n');

module.exports = {
    
    name: "clone",
    name_localizations:({
        'fr': 'clone',
        'en-US': 'clone',
        'en-GB': 'clone',
    }),
    description: "Permet de cloner un salon et de sauvegarder l'ancien dans une catégorie",
    description_localizations:({
        'fr': 'Permet de cloner un salon et de sauvegarder l\'ancien dans une catégorie',
        'en-US': 'Allows you to clone a channel and save the old one in a category',
        'en-GB': 'Allows you to clone a channel and save the old one in a category',
    }),
    type: 1,
    utilisation: "/clone (salon) (catégorie)",
    permission: PermissionFlagsBits.ManageChannels,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: "salon",
            name_localizations:({
                'fr': 'salon',
                'en-US': 'channel',
                'en-GB': 'channel',
            }),
            description: "Salon à cloner",
            description_localizations:({
                'fr': 'Salon à cloner',
                'en-US': 'Channel to clone',
                'en-GB': 'Channel to clone',
            }),
            required: false,
            channelTypes: [ChannelType.GuildText],
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.Channel,
            name: "catégorie",
            name_localizations:({
                'fr': 'catégorie',
                'en-US': 'category',
                'en-GB': 'category',
            }),
            description: "Catégorie où sauvegarder le salon",
            description_localizations:({
                'fr': 'Catégorie où sauvegarder le salon',
                'en-US': 'Category where to save the channel',
                'en-GB': 'Category where to save the channel',
            }),
            required: false,
            channelTypes: [ChannelType.GuildCategory],
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {
        await db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req_langue) => {

            let langue = req_langue[0].langue
            if(langue === "fr") i18n.setLocale("fr")
            if(langue === "en") i18n.setLocale("en")

            let systeme = `/${i18n.__("clone_system")}`
            let temps_supression = 10

            try { await message.deferReply({ ephemeral: true }) } catch {}
            
            let channel = args.getChannel("salon")
            if(!channel) channel = message.channel
            if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) {
                
                const embed_erreur_pas_de_salon = new EmbedBuilder()
                .setColor("DarkRed")
                .setAuthor({
                    name: `${bot.user.username} - ${systeme}`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                })
                .setDescription(i18n.__("clone_erreur_pas_de_salon"))
                .setTimestamp()
                .setFooter({text: systeme})

                await message.editReply({embeds: [embed_erreur_pas_de_salon], ephemeral: true})
                return
            }
                
            let category = args.getChannel("catégorie")
            if(!category) {
                
                const embed_pas_de_catégorie = new EmbedBuilder()
                .setColor(bot.color)
                .setAuthor({
                    name: `${bot.user.username} - ${systeme}`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                })
                .setDescription(i18n.__("clone_pas_de_categorie_P1") + `**${channel.name}**` + i18n.__("clone_pas_de_categorie_P2"))
                .setTimestamp()
                .setFooter({text: systeme})

                const bouton_pas_de_catégorie = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setCustomId(`Confirmer_catégorie_clone ${channel.id}`)
                    .setDisabled(false)
                    .setEmoji("✅")
                    .setLabel("Confirmer")
                    .setStyle(ButtonStyle.Success)
                )
                .addComponents(new ButtonBuilder()
                    .setCustomId("Annuler_catégorie_clone")
                    .setDisabled(false)
                    .setEmoji("✖")
                    .setLabel("Annuler")
                    .setStyle(ButtonStyle.Danger)
                )

                await message.editReply({embeds: [embed_pas_de_catégorie], components: [bouton_pas_de_catégorie], ephemeral: true})
                return
            } else { 
                
                let channel_name = channel.name
                let new_channel = await channel.clone()
                await channel.setParent(category)
                await channel.setName(channel_name + " backup")
                
                const embed_channel = new EmbedBuilder()
                .setColor(bot.color)
                .setAuthor({
                    name: `${bot.user.username} - ${systeme}`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                })
                .setDescription(`${i18n.__("clone_delete_message_le_salon")} **${channel.name}** ${i18n.__("clone_delete_message_channel")}`)
                .setTimestamp()
                .setFooter({text: systeme})
                
                const embed_message = new EmbedBuilder()
                .setColor(bot.color)
                .setAuthor({
                    name: `${bot.user.username} - ${systeme}`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                })
                .setDescription(`${i18n.__("clone_delete_message_le_salon")} **${channel_name}** ${i18n.__("clone_delete_message_reply_P1")} <#${new_channel.id}>${i18n.__("clone_delete_message_reply_P2")}`)
                .setTimestamp()
                .setFooter({text: systeme})
                
                const bouton_message = new ActionRowBuilder().addComponents(new ButtonBuilder()
                    .setCustomId("Delete_message_clone")
                    .setEmoji("🗑")
                    .setLabel(`${i18n.__("clone_delete_message_bouton_P1")} ${temps_supression} ${i18n.__("clone_delete_message_bouton_P2")} `)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
                )
                
                await new_channel.send({content: `<@${message.user.id}>`, embeds: [embed_channel], components: [bouton_message]})
                .then(msg => {
                    
                    let message_secondes = i18n.__("clone_delete_message_bouton_P2")
                    
                    const countdown = setInterval(async () => {
                        temps_supression--;
                        if (temps_supression > 0) {
                            if(temps_supression === 1 ) message_secondes = i18n.__("clone_delete_message_bouton_P3")
                            
                                const bouton_message = new ActionRowBuilder().addComponents(new ButtonBuilder()
                                .setCustomId("Delete_message_clone")
                                .setEmoji("🗑")
                                .setLabel(`${i18n.__("clone_delete_message_bouton_P1")} ${temps_supression} ${message_secondes}`)
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                                )
                                
                            try { await msg.edit({components: [bouton_message]}) } catch {}
                            
                        } else {
                            try { await msg.delete().catch() } catch {}
                            clearInterval(countdown)
                        }
                    }, 1000)
                })
                .catch();
                try { await message.editReply({embeds: [embed_message]}) } catch {}
            }
        }
    )}
}