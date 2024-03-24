const Discord = require('discord.js')
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require(`discord.js`);

module.exports = {
    name: "avatar",
    description: "Permet d'avoir la photo de profil et la bannière d'un membre",
    permission: "Aucune",
    dm: false,
    type: 1,
    category: "Informations",
    utilisation: "/avatar [membre]",
    options: [
      {
        type: ApplicationCommandOptionType.User,
        name: "membre",
        description: "Le membre a affiché l'avatar",
        required: false,
        autocomplete: false,
      }
    ],

    async run(bot, message, args, db) {

        let usermention = args.getUser("membre")
        if(!usermention) usermention = message.user
        
        let banner = await (await bot.users.fetch(usermention.id, { force: true })).bannerURL({ dynamic: true, size: 4096 });

        const cmp = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Photo de Profil`)
            .setCustomId(`avatar`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setLabel(`Bannière`)
            .setCustomId(`banner`)
            .setStyle(ButtonStyle.Secondary)
        )

        const cmp2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Photo de Profil`)
            .setCustomId(`avatar`)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setLabel(`Bannière`)
            .setCustomId(`banner`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary)
        )

        const embed = new EmbedBuilder()
        .setColor(`ffffff`)
        .setAuthor({ name: `${usermention.tag}`, iconURL: `${usermention.displayAvatarURL({ dynamic: true, size: 512 })}`})
        .setTitle(`Download`)
        .setURL(usermention.displayAvatarURL({ size: 1024, format: `png`, dynamic: true}))
        .setImage(usermention.displayAvatarURL({ size: 1024, format: "png", dynamic: true }))

        const embed2 = new EmbedBuilder()
        .setColor(`ffffff`)
        .setAuthor({ name: `${usermention.tag}`, iconURL: `${usermention.displayAvatarURL({ dynamic: true, size: 512 })}`})
        .setDescription(banner ? usermention.bannerURL({dynamic: true, size: 4096})  : "L'utilisateur n'a pas de bannière !")
        .setTitle(`Download`)
        .setURL(banner)
        .setImage(banner)

        const messages = await message.reply({content: `${usermention.displayAvatarURL({ size: 1024, format: "png", dynamic: true })}`, embeds: [], components: [cmp], ephemeral: true})
        const collector = await messages.createMessageComponentCollector();

        collector.on(`collect`, async c => {
      
            if (c.customId === 'avatar') {
              
              if (c.user.id !== message.user.id) {
                return await c.reply({ content: `Seulement <@${message.user.id}> peut intéragir avec ce bouttons !`, ephemeral: true})
              }
              
              await c.update({content: `${usermention.displayAvatarURL({ size: 1024, format: "png", dynamic: true })}`, embeds: [], components: [cmp], ephemeral: true})
            }

            if (c.customId === 'banner') {
              
              if (c.user.id !== message.user.id) {
                return await c.reply({ content: `Seulement <@${message.user.id}> peut intéragir avec ce bouttons !`, ephemeral: true})
              }
                
              await c.update({content: `${banner ? usermention.bannerURL({dynamic: true, size: 4096})  : "L'utilisateur n'a pas de bannière !"}`, embeds: [], components: [cmp2], ephemeral: true})
            }

            if (c.customId === 'delete') {
              
              if (c.user.id !== message.user.id) {
                return await c.reply({ content: `Seulement <@${message.user.id}> peut intéragir avec ce bouttons !`, ephemeral: true})
              }
              
              message.deleteReply();
            }
          })
    }
}