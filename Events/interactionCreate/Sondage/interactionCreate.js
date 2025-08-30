const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
let Config = require("../../../config")

module.exports = async (bot, interaction) => {
    
    let db = bot.db;

    //sondage
    if (interaction.isModalSubmit()) {
        if(interaction.customId === 'suggest-modal') {
        await db.query(`SELECT * FROM guild WHERE Guild = ${interaction.guild.id}`, async(err, req) => {
            if (req.length >= 1) {
    
                const channel = bot.channels.cache.get(req[0].Channel_Sondage)
    
                const embed = new EmbedBuilder()
                .setAuthor({ name: `sondage - ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setColor(Config.DEFAULT)
                .setFields([
                    { name: `**${interaction.fields.getTextInputValue('input-title')}**`, value: interaction.fields.getTextInputValue('input-content') },
                    { name: "Pour :", value: '0', inline: true },
                    { name: "Neutre :", value: '0', inline: true },
                    { name: "Contre :", value: '0', inline: true }
                ])
                if(interaction.fields.getTextInputValue("input-image")) embed.setImage(interaction.fields.getTextInputValue("input-image") && !/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/.test(interaction.fields.getTextInputValue('input-image')) ? null : interaction.fields.getTextInputValue('input-image'))
                
                const Row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('sondage-for')
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Success),
                
                new ButtonBuilder()
                .setCustomId('sondage-neutral')
                .setEmoji('🤷')
                .setStyle(Discord.ButtonStyle.Secondary), 
                
                new ButtonBuilder()
                .setCustomId('sondage-against')
                .setEmoji('❌')
                .setStyle(Discord.ButtonStyle.Primary)
                )
    
                const message = await channel.send({ embeds: [embed], components: [Row] });
                const messageId = message.id;
    
                await interaction.reply({ content: '✅ Votre sondage a été envoyée !', ephemeral: true });
    
                const threadOptions = {
                    name: interaction.fields.getTextInputValue('input-title'),
                    autoArchiveDuration: Discord.ThreadAutoArchiveDuration.OneWeek, 
                    startMessage: messageId,
                };
    
                await channel.threads.create(threadOptions);
    
                db.query(`INSERT INTO sondage (MessageId, Author, Yes, Neutral, No, Users) VALUES ('${messageId}', '${interaction.user.id}', '0', '0', '0', '[]')`, (err, req) => {})
            } else {
                return await interaction.reply({ content: '❌ Vous n\'avez pas défini le salon pour l\'envoie des sondages.', ephemeral: true });
            }
        })
      }
    }

    if (interaction.isButton()) {
        if (interaction.customId == 'sondage-for') {
            await db.query(`SELECT * FROM sondage WHERE MessageId = ${interaction.message.id}`, async(err, req) => {
                if (err) throw err;
                if (req.length >= 1) {
                    if (req[0].Author.includes(interaction.user.id)) return await interaction.reply({ content: "❌ Vous ne pouvez pas voter à votre propre sondage.", ephemeral: true });
                    if (req[0].Users.includes(interaction.user.id)) return await interaction.reply({ content: "❌ Vous ne pouvez pas voter deux fois sur ce sondage.", ephemeral: true });
                    db.query(`UPDATE sondage SET Yes=Yes + 1, Users='${[req[0].Users.replace("[", "").replace("]", "")]}, ${interaction.user.id}]' WHERE MessageId = ${interaction.message.id};`, async(err, results) => {
                        if (err) throw err;
    
                        await interaction.update({ embeds: [new EmbedBuilder().setAuthor({ name: `${interaction.message.embeds[0].author.name}`, iconURL: `${interaction.message.embeds[0].author.iconURL}` }).setColor(Config.DEFAULT).addFields([{ name: `${interaction.message.embeds[0].fields[0].name}`, value: `${interaction.message.embeds[0].fields[0].value}` }, { name: `${interaction.message.embeds[0].fields[1].name}`, value: `${Number(interaction.message.embeds[0].fields[1].value) + Number(1)}`, inline: true }, { name: `${interaction.message.embeds[0].fields[2].name}`, value: `${interaction.message.embeds[0].fields[2].value}`, inline: true }, { name: `${interaction.message.embeds[0].fields[3].name}`, value: `${interaction.message.embeds[0].fields[3].value}`, inline: true }])] })
                    })
                }
            })
        }
        if (interaction.customId == 'sondage-neutral') {
            db.query(` SELECT * FROM sondage WHERE MessageId = ${interaction.message.id}`, async(err, req) => {
                if (err) throw err;
                if (req.length >= 1) {
                    if (req[0].Author.includes(interaction.user.id)) return await interaction.reply({ content: "❌ Vous ne pouvez pas voter à votre propre sondage.", ephemeral: true });
                    if (req[0].Users.includes(interaction.user.id)) return await interaction.reply({ content: "❌ Vous ne pouvez pas voter deux fois sur ce sondage.", ephemeral: true });
                    db.query(`UPDATE sondage SET Neutral=Neutral + 1, Users='${[req[0].Users.replace("[", "").replace("]", "")]}, ${interaction.user.id}]' WHERE MessageId = ${interaction.message.id};`, async(err, results) => {
                        if (err) throw err;
                        await interaction.update({ embeds: [new EmbedBuilder().setAuthor({ name: `${interaction.message.embeds[0].author.name}`, iconURL: `${interaction.message.embeds[0].author.iconURL}` }).setColor(Config.DEFAULT).addFields([{ name: `${interaction.message.embeds[0].fields[0].name}`, value: `${interaction.message.embeds[0].fields[0].value } ` }, { name: `${ interaction.message.embeds[0].fields[1].name } `, value: `${ interaction.message.embeds[0].fields[1].value } `, inline: true }, { name: `${ interaction.message.embeds[0].fields[2].name } `, value: `${ Number(interaction.message.embeds[0].fields[2].value) + Number(1) } `, inline: true }, { name: `${interaction.message.embeds[0].fields[3].name } `, value: `${interaction.message.embeds[0].fields[3].value } `, inline: true }])] })
                    })
                }
            })
        }
        if (interaction.customId == 'sondage-against') {
            db.query(` SELECT * FROM sondage WHERE MessageId = ${interaction.message.id}`, async(err, req) => {
                if (err) throw err;
                if (req.length >= 1) {
                    if (req[0].Author.includes(interaction.user.id)) return await interaction.reply({ content: "❌ Vous ne pouvez pas voter à votre propre sondage.", ephemeral: true });
                    if (req[0].Users.includes(interaction.user.id)) return await interaction.reply({ content: "❌ Vous ne pouvez pas voter deux fois sur ce sondage.", ephemeral: true })
                    db.query(`UPDATE sondage SET No=No + 1, Users = '${[req[0].Users.replace("[", "").replace("]", "")]}, ${interaction.user.id}]'WHERE MessageId = ${interaction.message.id}; `, async(err, results) => {
                        if (err) throw err;
    
                        await interaction.update({ embeds: [new EmbedBuilder().setAuthor({ name: `${interaction.message.embeds[0].author.name}`, iconURL: `${interaction.message.embeds[0].author.iconURL}` }).setColor(Config.DEFAULT).addFields([{ name: `${interaction.message.embeds[0].fields[0].name}`, value: `${interaction.message.embeds[0].fields[0].value}` }, { name: `${interaction.message.embeds[0].fields[1].name}`, value: `${interaction.message.embeds[0].fields[1].value}`, inline: true }, { name: `${interaction.message.embeds[0].fields[2].name}`, value: `${interaction.message.embeds[0].fields[2].value}`, inline: true }, { name: `${interaction.message.embeds[0].fields[3].name} `, value: `${Number(interaction.message.embeds[0].fields[3].value) + (Number(1))}`, inline: true }])] })
                    })
                }
            })
        }
    }
}