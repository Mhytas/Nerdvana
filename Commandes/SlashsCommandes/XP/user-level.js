const { RankCardBuilder, Font, BuiltInGraphemeProvider } = require('canvacord');
const { EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const i18n = require('i18n');


module.exports = {
    
    name: "user-level",
    description: "Donne l'xp d'un membre",
    utilisation: "/user-level [membre]",
    type: 1,
    permission: "Aucune",
    dm: false,
    category: "Expérience",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "L'xp du membre à voir",
            required: false,
            autocomplete: false
        }
    ],
    
    async run(bot, message, args, db) {
        await db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req_langue) => {
            let langue = req_langue[0].langue
            if(langue === "fr") i18n.setLocale("fr")
            if(langue === "en") i18n.setLocale("en")

            let membre = await args.getMember("membre")
            if(membre) membre = membre.user
            if(!membre) membre = await message.user
            if(!membre) {
                const no_membre = new EmbedBuilder()
                .setDescription("**" + i18n.__("xp_pasmembre") + "**")
                .setColor('#ff0000')

                await message.reply({embeds: [no_membre], ephemeral: true})
                return
            }

            await db.query(`SELECT * FROM user WHERE userID = '${membre.id}' AND guildID = ${message.guild.id}`, async (err, req) => {
                await db.query(`SELECT id, xp, niveau, (SELECT COUNT(*) + 1 FROM \`user\` AS u2 WHERE (u2.niveau > u1.niveau) OR (u2.niveau = u1.niveau AND u2.xp > u1.xp)) AS position FROM \`user\` AS u1 ORDER BY niveau DESC, xp DESC;`, async (err2, all) => {
                    
                    const noxp = new EmbedBuilder()
                    .setDescription("**" + i18n.__("xp_pasxp") + "**")
                    .setColor('#ff0000')
                    if(req[0].niveau === "0" && req[0].xp === "0") return await message.reply({embeds: [noxp], ephemeral: true})
                    
                    await message.deferReply()

                    const user = await message.guild.members.cache.get(membre.id)
                    Font.loadDefault()

                    async function fonction_level (status) {
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

                            
                        const niveaunow = parseInt(req[0].niveau)
                        const nextLevelXP = xpNeeded[niveaunow]
                        const xpnow = parseInt(req[0].xp)
                        let place = all.findIndex(r => r.id === message.guild.id + "_" + membre.id) + 1
                        
                        const rank = new RankCardBuilder()
                        .setAvatar(membre.displayAvatarURL({format: 'png', size: 512}))
                        .setBackground(bot.color)
                        .setCurrentXP(xpnow)
                        .setDisplayName(user.displayName)
                        .setGraphemeProvider(BuiltInGraphemeProvider.Twemoji)
                        .setLevel(niveaunow)
                        .setProgressCalculator(() => {
                            return (xpnow / nextLevelXP) * 100
                        })
                        .setRank(place)
                        .setRequiredXP(nextLevelXP)
                        .setStatus(status)
                        .setUsername(membre.username)

                        rank.build().then(async data => {
                            await message.followUp({files: [new AttachmentBuilder(data, {name: "rank.png"})]})
                        }).catch(err => console.error(err));
                    }

                    try {
                        const status = user.presence.status
                        status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
                        await fonction_level(status)
                    } catch { await fonction_level("offline") }
                })
            })
        })

        
    }
}
    /*const membre = message.options.getMember('membre') 

    if (!membre) {   
    let colorBackgroundBar = "#000000";
    let opacityBackgroundBar = "0.4";
    let colorBar = "#62D3F5";
     db.query(`SELECT * FROM user WHERE userID = '${message.user.id}' AND guildID = ${message.guild.id}`, async (err, req) => {
        const User = message.options.getMember("membre") || message.member;
        console.log(req[0].niveau)
   
        const xpneed = (req[0].niveau + 1) * 100
        const niveaunow = req[0].niveau
        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
        const xpnow = req[0].xp
        
        
        const rank = new canvacord.Rank()
          .setAvatar(User.user.displayAvatarURL({ size: 256 }))
          .setRank(currentRank)
          .setLevel(req[0].niveau)
          .setCurrentXP(req[0].xp)
          .setRequiredXP(calculateLevelXp(req[0].level))
          .setStatus(User.presence.status)
          .setProgressBar(bot.color, colorBar)
          .setUsername(User.user.username)
          .setDiscriminator(User.user.discriminator);
         
         const data = await rank.build();
         const attachment = new AttachmentBuilder(data);
         message.reply({ files: [attachment] });
       })*/
        /*const canvas = createCanvas(1080, 282);
        const ctx = canvas.getContext("2d")
        const background = loadImage("../../card.jpeg")
        //ctx.setSource(background)
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "000";

        ctx.globalAlpha = 1;
        ctx.font = "38px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`${xpnow} / ${niveaunow * 100} XP`, 813, 160)

        function pseudo() {
            if(message.member.user.tag.length >= 10) {
                return message.member.user.username
            } else {
                return message.member.user.tag
            }

        }
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "43px sans-serif";
        ctx.fillText(pseudo(), 380, 150) 

        ctx.fillStyle = "#33caff";
        ctx.font = "27px sans-serif";
        ctx.fillText(`LEVEL`, 935, 83);

        ctx.fillStyle = "#33caff";
        ctx.font = "55px sans-serif";
        ctx.fillText(`${niveaunow}`, 1015, 83);


            
        ctx.fillStyle = colorBackgroundBar;
        ctx.globalAlpha = opacityBackgroundBar;
        ctx.fillRect(240 + 50 + 50, 80 + 45 + 10 + 40, 700, 50);
        ctx.fillStyle = colorBar;
        ctx.globalAlpha = 1;
        const percent = (100 * xpnow) / xpneed;
        const progress = (percent * 760) / 100;
        ctx.fillRect(240 + 50 + 50, 80 + 45 + 10 + 40, progress, 50);
        ctx.restore();


        // Pick up the pen
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FF0000";
        // Start the arc to form a circle
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        // Put the pen down
        ctx.closePath();
        // Clip off the region you drew on
        ctx.clip();
        
            
        const avatar = await loadImage(User.displayAvatarURL({ format: 'jpg' }));;
        ctx.drawImage(avatar, 20, 20, 210, 210);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'exp.jpeg');
        message.channel.send({
            files: [attachment]
        });
    }
} else {
const UserMention = message.mentions.users.first();
let colorBackgroundBar = "#000000";
    let opacityBackgroundBar = "0.4";
    let colorBar = "#ffffff";
     db.query(`SELECT * FROM user WHERE userID = '${UserMention.id}' AND guildID = ${message.guild.id}`, async (err, req) => {

      
                console.log(req[0].niveau)
    
        const xpneed = (req[0].niveau + 1) * 100
        console.log(xpneed)
        const niveaunow = req[0].niveau
        const xpnow = req[0].xp



const canvas = createCanvas(1080, 282);
const ctx = canvas.getContext("2d")
const background = await loadImage("./rank-card.png");

ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

ctx.beginPath();
ctx.lineWidth = 2;
ctx.globalAlpha = 0.4;
ctx.fillStyle = "000";

ctx.globalAlpha = 1;
ctx.font = "38px sans-serif";
ctx.textAlign = "center";
ctx.fillStyle = "#FFFFFF";
ctx.fillText(`${xpnow} / ${niveaunow * 100} XP`, 813, 160)

function pseudo() {
    if(UserMention.tag.length >= 10){
        return UserMention.username
    }else{
         return UserMention.tag
    }
}
ctx.fillStyle = "#FFFFFF";
ctx.font = "43px sans-serif";
ctx.fillText(pseudo(), 380, 150) 

ctx.fillStyle = "#33caff";
ctx.font = "27px sans-serif";
ctx.fillText(`LEVEL`, 940, 83);

ctx.fillStyle = "#33caff";
ctx.font = "55px sans-serif";
ctx.fillText(`${niveaunow}`, 1015, 83);


  
  ctx.fillStyle = colorBackgroundBar;
  ctx.globalAlpha = opacityBackgroundBar;
  ctx.fillRect(240 + 50 + 50, 80 + 45 + 10 + 40, 700, 50);
  ctx.fillStyle = colorBar;
  ctx.globalAlpha = 1;
  const percent = (100 * xpnow) / xpneed;
  const progress = (percent * 760) / 100;
  ctx.fillRect(240 + 50 + 50, 80 + 45 + 10 + 40, progress, 50);
  ctx.restore();


	// Pick up the pen
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FF0000";
	// Start the arc to form a circle
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	// Put the pen down
	ctx.closePath();
	// Clip off the region you drew on
    ctx.clip();
    
  

const avatar = await loadImage(UserMention.displayAvatarURL({ format: 'jpeg' }));
ctx.drawImage(avatar, 20, 20, 210, 210);

const attachment = new MessageAttachment(canvas.toBuffer(), "exp.png")
message.channel.send({
    files: [attachment]
})})}
}}
}*/