const Discord = require('discord.js')
const Canvas = require("discord-canvas-easy")
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const background = "../../leaderboard_black.png"

module.exports = {
  name: "top",
  description: "Donne le classement de l'expérience ou des inviations",
  type: 1,
  utilisation: "/top",
  permission: "Aucune",
  ownerOnly: false,
  dm: false,
  category: "Informations",
  options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "experience",
            description: "Donne le classement de l'expérience du serveur",
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "invitations",
            description: "Donne le classement des invitations du serveur",
        }
    ],


    async run(bot, message, args, db) {
      
      const subCommand = args.getSubcommand()

      switch (subCommand) {
          case 'invitations':
         db.query(`SELECT * FROM user WHERE guildID='${message.guild.id}' ORDER BY invites DESC`, async (err, req) => {
      if (err) throw err;

      const leaderboard = new EmbedBuilder()
        .setColor("#F2B90C")
        .setTitle("🏆 Classement des invitations 🏆")
        .setDescription("Voici le top 10 des membres qui ont invité le plus de personnes 👥")
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: "Invitez vos amis pour grimper dans le classement ! 🚀", iconURL: bot.user.avatarURL() });

      for (let i = 0; i < req.length && i < 10; i++) {
        const user = await bot.users.fetch(req[i].userID);
        let medal = "";
        if (i === 0) medal = ":first_place:";
        else if (i === 1) medal = ":second_place:";
        else if (i === 2) medal = ":third_place:";
        leaderboard.addFields({
          name: `${medal} ${i+1}. ${user.username}`,
          value: `**Nombre d'invitations :** \`${req[i].invites}\` 👥`,
          inline: true,
        });
      }

      message.reply({ embeds: [leaderboard] });
    });
    break;
    case 'experience':
      db.query(`SELECT * FROM user WHERE guildID = '${message.guild.id}' ORDER BY niveau DESC, xp DESC`, async (err, req) => {

      const noxp = new EmbedBuilder()
      .setDescription("Personne n'a d'xp sur le serveur ! :sob:")
      .setColor('#ff0000')

    if(req < 1) return message.reply({embeds: [noxp], ephemeral: true})
    
  await message.deferReply()
    
      const xpNeeded = [100, 255, 475, 770, 1150, 1625, 2205, 2900, 3720, 4675, 
              5775, 7050, 8450, 10045, 11825, 13800, 15980, 18375, 20995, 23850, 
              26950, 30305, 33925, 37820, 42000, 46475, 51255, 56350, 61770, 67525, 
              73625, 80080, 86900, 94095, 101675, 109650, 118030, 126825, 136045, 
              145700, 155800, 166355, 177375, 188870, 200850, 213325, 226305, 239800, 
              253820, 268375, 281225, 296300, 311900, 328045, 344750, 362025, 379880,
              398325, 417370, 437025, 457300, 478205, 499750, 521945, 544800, 568325,
              592530, 617425, 643020, 669325, 696350, 724105, 752600, 781845, 811850,
              842625, 874180, 906525, 939670, 973625, 1008375, 1043850, 1080250, 1117575,
              1155825, 1195000, 1235100, 1276125, 1318075, 1360950, 1404750, 1449475,
              1495125, 1541700, 1589200, 1637625, 1686975, 1737250, 1788450, 1840575]
    
      const Leaderboard = new Canvas.Leaderboard()
        .setBot(bot)
        .setGuild(message.guild)
        .setBackground("https://cdn.discordapp.com/attachments/935825524687781978/1118169261349814292/leaderboard_black.png")
        .setColorFont("#000")

        for(let i = 0; i < (req.length > 10 ? 10 : req.length); i++) {
            let niveaunow = req[i].niveau
            let nextLevelXP = xpNeeded[niveaunow]
            let xpnow = req[i].xp
            Leaderboard.addUser(await bot.users.fetch(req[i].userID), niveaunow, xpnow, nextLevelXP)
      }
        const Image = await Leaderboard.toLeaderboard()
    
      await message.followUp({files: [new Discord.AttachmentBuilder(Image.toBuffer(), {name: "leaderboard.png"})]})
    })
    break;
    default:
      message.reply({content: "Une erreur est survenu, merci de contacter un membre du staff pour faire remonter l'erreur", ephemeral: true})
      break;
    }  
  }
}