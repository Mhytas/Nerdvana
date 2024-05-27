const { LeaderboardBuilder, LeaderboardVariants, Font, BuiltInGraphemeProvider } = require('canvacord');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const i18n = require('i18n');


module.exports = {
    
    name: "leaderboard",
    description: "Affiche le classemen du serveur",
    utilisation: "/leaderboard",
    type: 1,
    permission: "Aucune",
    dm: false,
    category: "Expérience",
    options: [],
    
    async run(bot, message, args, db) {
        await db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req_langue) => {
            let langue = req_langue[0].langue
            if(langue === "fr") i18n.setLocale("fr")
            if(langue === "en") i18n.setLocale("en")

                await db.query(`SELECT * FROM user WHERE guildID = ${message.guild.id} ORDER BY niveau DESC, xp DESC LIMIT 10`, async (err, req) => {
                    await db.query(`SELECT id, xp, niveau, (SELECT COUNT(*) + 1 FROM \`user\` AS u2 WHERE (u2.niveau > u1.niveau) OR (u2.niveau = u1.niveau AND u2.xp > u1.xp)) AS position FROM \`user\` AS u1 ORDER BY niveau DESC, xp DESC;`, async (err2, all) => {
                        if (err) return console.error(err)
                        if (err2) return console.error(err2)

                    /*const noxp = new EmbedBuilder()
                    .setDescription("**" + "Le serveur n'a aucun XP !" + "**")
                    .setColor('#ff0000')
                    if(req[0].niveau === "0" && req[0].xp === "0") return await message.reply({embeds: [noxp], ephemeral: true})*/
                    
                    await message.deferReply()
                    Font.loadDefault()

                    const guild = await bot.guilds.fetch(message.guild.id);
                    
                    let players = []
                    for(const player of req) {
                        try {
                            let player_user = await guild.members.fetch(player.userID);
                            players.push({
                                displayName: player_user.displayName,
                                username: player_user.user.username,
                                level: player.niveau,
                                xp: player.xp,
                                rank: all.findIndex(r => r.id === message.guild.id + "_" + player.userID) + 1,
                                avatar: player_user.displayAvatarURL({format: 'png', size: 512}),
                            });
                        } catch {}
                    }

                    try {
                        new LeaderboardBuilder()
                            .setGraphemeProvider(BuiltInGraphemeProvider.Twemoji)
                            .setBackground(null)
                            .setBackgroundColor("#AEF786")
                            .setHeader({
                                title: `Classement du serveur`,
                                subtitle: guild.name,
                                image: guild.iconURL()
                            })
                            .setVariant(LeaderboardVariants.Default)
                            .setPlayers(players)
                            .build().then(async data => {
                                await message.followUp({files: [new AttachmentBuilder(data, {name: "leaderboard.png"})]})
                            }).catch(err => console.error(err));

                    } catch (buildErr) { return console.error(buildErr) }
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