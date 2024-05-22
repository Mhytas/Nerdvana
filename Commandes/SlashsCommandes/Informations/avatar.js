const { EmbedBuilder, ApplicationCommandOptionType } = require(`discord.js`);
const i18n = require('i18n');

module.exports = {
    name: "avatar",
    description: "Permet d'avoir l'avatar et la bannière d'un membre",
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
      await db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req_langue) => {
        let langue = req_langue[0].langue
        if(langue === "fr") i18n.setLocale("fr")
        if(langue === "en") i18n.setLocale("en")

        let user = await args.getUser("membre")
        if(!user) user = await message.user
          
        let banner = await (await bot.users.fetch(user.id, { force: true })).bannerURL({ dynamic: true, size: 4096 });
        let avatar = await user.displayAvatarURL({ size: 1024, format: "png", dynamic: true })

        const embed_avatar = new EmbedBuilder()
        .setColor(bot.color)
        .setAuthor({ name: i18n.__("avatar_avatar") + user.username, iconURL: `${avatar}`})
        .setImage(avatar)

        const embed_bannière = new EmbedBuilder()
        .setColor(bot.color)
        .setAuthor({ name: i18n.__("avatar_bannière") + user.username, iconURL: `${avatar}`})
        .setDescription(banner ? null : `**<@${user.id}>` + i18n.__("avatar_pas_bannière") +`**`)
        .setImage(banner)

        await message.reply({embeds: [embed_avatar, embed_bannière], ephemeral: true})
      })
    }
}