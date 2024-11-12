const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js")
const i18n = require('i18n');

module.exports = async (bot, interaction, args) => {
    if(interaction.isButton()) {
        
        if(!interaction.customId) return
        let customId = interaction.customId.split(" ")
        let id = customId[customId.length - 1];
        
        await bot.db.query(`SELECT * FROM server WHERE guild = '${interaction.guild.id}'`, async (err, req_langue) => {

            let langue = req_langue[0].langue
            if(langue === "fr") i18n.setLocale("fr")
            if(langue === "en") i18n.setLocale("en")
            
            let systeme = `/${i18n.__("clone_system")}`
            let temps_supression = 10

            try { await interaction.deferUpdate() } catch {}

            if(interaction.customId === `Confirmer_catégorie_clone ${id}`) {

                try { await bot.channels.fetch(id) } catch {

                    const embed_erreur_salon_supprimé = new EmbedBuilder()
                    .setColor("DarkRed")
                    .setAuthor({
                        name: `${bot.user.username} - ${systeme}`,
                        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                    })
                    .setDescription(i18n.__("clone_erreur_salon_supprimé"))
                    .setTimestamp()
                    .setFooter({text: systeme})
    
                    await interaction.editReply({embeds: [embed_erreur_salon_supprimé], components: [], ephemeral: true})
                    return
                }

                let channel = await bot.channels.fetch(id)

                let new_channel = await channel.clone()
                await channel.delete()
    
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
                .setDescription(`${i18n.__("clone_delete_message_le_salon")} **${channel.name}** ${i18n.__("clone_delete_message_reply_P1")} <#${new_channel.id}>${i18n.__("clone_delete_message_reply_P2")}`)
                .setTimestamp()
                .setFooter({text: systeme})
    
                const bouton_message = new ActionRowBuilder().addComponents(new ButtonBuilder()
                    .setCustomId("Delete_message_clone")
                    .setEmoji("🗑")
                    .setLabel(`${i18n.__("clone_delete_message_bouton_P1")} ${temps_supression} ${i18n.__("clone_delete_message_bouton_P2")} `)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
                )
                
                await new_channel.send({content: `<@${interaction.user.id}>`, embeds: [embed_channel], components: [bouton_message]})
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
                try { await interaction.editReply({embeds: [embed_message], components: [], ephemeral: true}) } catch {}
                
            } else if(interaction.customId === "Annuler_catégorie_clone") {

                const embed_annuler = new EmbedBuilder()
                .setColor("DarkRed")
                .setAuthor({
                    name: `${bot.user.username} - ${systeme}`,
                    iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
                })
                .setDescription(i18n.__("clone_commande_annuler"))
                .setTimestamp()
                .setFooter({text: systeme})
                

                await interaction.editReply({embeds: [embed_annuler], components: []})
            }
        })
    }
}