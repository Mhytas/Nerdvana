const { EmbedBuilder, ApplicationCommandOptionType } = require(`discord.js`);

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

      let user = await args.getUser("membre")
      if(!user) user = await message.user
        
      let banner = await (await bot.users.fetch(user.id, { force: true })).bannerURL({ dynamic: true, size: 4096 });
      let avatar = await user.displayAvatarURL({ size: 1024, format: "png", dynamic: true })

      const embed_avatar = new EmbedBuilder()
      .setColor(bot.color)
      .setAuthor({ name: `Avatar de ${user.username}`, iconURL: `${avatar}`})
      .setImage(avatar)

      const embed_bannière = new EmbedBuilder()
      .setColor(bot.color)
      .setAuthor({ name: `Bannière de ${user.username}`, iconURL: `${avatar}`})
      .setDescription(banner ? null : `**<@${user.id}> n'a pas de bannière !**`)
      .setImage(banner)

      await message.reply({embeds: [embed_avatar, embed_bannière], ephemeral: true})
    }
}