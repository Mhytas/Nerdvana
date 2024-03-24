const Discord = require('discord.js')
const canvacord = require("canvacord");
const {createCanvas, loadImage} = require("canvas")
const { EmbedBuilder } = require("discord.js");

module.exports = {
    
    name: "Profil",
    type: 2,
    utilisation: "Profil",
    permission: "Aucune",
    ownerOnly: false,
    dm: false,
    category: "Informations",
    options: [],

    async run(bot, message, args, db, id) {

        let member = message.guild.members.cache.get(id)

        db.query(`SELECT * FROM user WHERE userID = '${id}' AND guildID = ${message.guild.id}`, async (err, req) => {
            db.query(`SELECT * FROM user WHERE guildID = '${message.guild.id}'`, async (err, all) => {

                console.log(req)
                console.log(all)
        
                //les badges
                /*let guild = message.guild
                const userFlags = await user.fetchFlags().then(e => e.toArray());
                let s;
                if(userFlags.size > 1) { s = "Badges" } else { s = "Badge" };
        
                const flags = {
                    Staff: 'https://cdn.discordapp.com/emojis/885910656325410827.png?v=1',
                    Partner: 'https://cdn.discordapp.com/emojis/885911476580253806.png?v=1',
                    BugHunterLevel1: 'https://cdn.discordapp.com/emojis/885910368336117902.png?v=1',
                    BugHunterLevel2: 'https://cdn.discordapp.com/emojis/885910424506204160.png?v=1',
                    HypeSquadOnlineHouse1: '<:HypeSquadOnlineHouse1:1116777556578943057>',
                    HypeSquadOnlineHouse2: 'https://cdn.discordapp.com/emojis/885911240319324240.png?v=1',
                    HypeSquadOnlineHouse3: 'https://cdn.discordapp.com/emojis/885911094319804476.png?v=1',
                    PremiumEarlySupporter: 'https://cdn.discordapp.com/emojis/885910855571619872.png?v=1',
                    TeamPseudoUser: 'Équipe Discord',
                    System: 'Système',
                    VerifiedBot: 'VerifiedBot',
                    VerifiedDeveloper: 'https://cdn.discordapp.com/emojis/885911544884498492.png?v=1',
                    CertifiedModerator: 'https://cdn.discordapp.com/emojis/1057351259109200053.png?v=1',
                    4194304: '<:ActiveDeveloper:1116776375722987632>',
                    Hypesquad: "https://cdn.discordapp.com/emojis/885911355142569985.png?v=1",
                    BotHttpInteractions: "<:BotHTTPInteractions:1116783532921069699>",
                    ServerOwner: "https://cdn.discordapp.com/emojis/832979220387856385.png?v=1",
                    NitroSubscriber: "https://cdn.discordapp.com/emojis/838059673700663316.png?v=1",
                };
                
                if (user.id === guild.fetchOwner().id) {
                    flags.ServerOwner = 'https://cdn.discordapp.com/emojis/832979220387856385.png?v=1';
                }
                **${s}** : ${userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : '❌'}*/



                //plateforme de connexion
                let platform = member ? member.presence ? member.presence.clientStatus : "Hors ligne" : "Inconnu";
                //web
                if (platform.web) platform = "<:navigateur:1126652187058118676>"
                //telephone
                else if (platform.mobile) platform = "<:portable:1126652190547771442>"
                //oridanteur
                else if (platform.desktop) platform = "<:ordinateur:1126652188433850400>"
                
                
                //status
                let presence = member ? member.presence ? member.presence.status : "Hors ligne" : "Inconnu";
                if(presence == "idle") presence = "🟡"; else if(presence == "Hors ligne" || presence == "offline") {presence = "⚪", platform = "Hors ligne"} else if(presence == "online") presence = "🟢"; else if(presence == "streaming") presence = "🟣"; else if(presence == "dnd") presence = "🔴"; else if(presence == "Inconnu") {presence = "❓", platform = "❓"}

                //embed
                let EmbedUserInfo = new Discord.EmbedBuilder()
                    //.setAuthor({name: user.username, iconURL: user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()
                    .setFooter({text: `${member.user.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
                    .setThumbnail(member.displayAvatarURL({dynamic: true}))
                    .setImage(await (await bot.users.fetch(member.id, {force: true})).bannerURL({dynamic: true, size: 4096}))
                    .setColor(bot.color)
                    .setDescription(`**__Informations sur ${member.user.username}__**`)
                    
                    .addFields({name: `Pseudo :`, value: `${member.user.username}`, inline: true})
                    .addFields({name: `Surnom :`, value: `${member ? member.nickname ? member.nickname : "❌" : "❓"}`, inline: true})
                    .addFields({name: `ID :`, value: `${member.id}`, inline: true})
                    .addFields({name: `Mention :`, value: `<@${member.id}>`, inline: true})
                    .addFields({name: `Avatar :`, value: `**[URL](${member.displayAvatarURL({dynamic: true, size: 4096})})**`, inline: true})
                    .addFields({name: `Bannière :`, value: `${member.user.banner ? `**[URL](${await (await bot.users.fetch(member.id, {force: true})).bannerURL({dynamic: true, size: 4096})})**` : "❌"}`, inline: true})
                    .addFields({name: `Bot :`, value: `${member.user.bot ? "✅" : "❌"}`, inline: true})
                    .addFields({name: `Status :`, value: `${presence}`, inline: true})
                    .addFields({name: `Plateforme de connexion :`, value: `${platform}`, inline: true})
                    .addFields({name: `Création du compte :`, value: `<t:${Math.floor(member.user.createdAt / 1000)}:F> (<t:${Math.floor(member.user.createdAt / 1000)}:R>)`, inline: true})
                    
                    member ? EmbedUserInfo.addFields({name: `__Informations de ${member.user.username} sur ${message.guild.name}__`, value: `\n**Arrivée sur le serveur :** <t:${Math.floor(member.joinedAt / 1000)}:F> (<t:${Math.floor(member.joinedAt / 1000)}:R>)`, inline: false}) : ""
                    
                    member ? EmbedUserInfo.addFields({name: `${member.roles.cache.size}-Rôles :`, value: `${member.roles.cache.map(r => `${r}`).join(" ")}`, inline: true}) : ""
                    
                    member ? EmbedUserInfo.addFields({name: `Rôle le plus haut :`, value: `${member.roles.highest}`, inline: true}) : ""


                    const noxp = new EmbedBuilder()
                    .setDescription('Ce membre n\'a pas d\'xp')
                    .setColor('#ff0000')

                    if(req < 1) return message.reply({embeds: [noxp, EmbedUserInfo], ephemeral: true})
                    await message.deferReply({ephemeral: true})
    
                    const user = message.guild.members.cache.get(id)
                    let status = ""
                    try { status = user.presence.status } catch { status = "offline" }
                    status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
                        
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
                    let place = all.findIndex(r => r.userID === id) + 1
                    
                    const rank = new canvacord.Rank()
                    .setStatus(status)
                    .setAvatar(member.displayAvatarURL({dynamic: true}))
                    .setCurrentXP(xpnow)
                    .setRequiredXP(nextLevelXP)
                    .setStatus(status)
                    .setProgressBar("#62D3F5", "COLOR")
                    .setUsername(member.user.username)
                    .setDiscriminator("    ")
                    .setRank(place)
                    .setLevel(niveaunow)
                    //.setBackground("https://cdn.discordapp.com/attachments/935825524687781978/1118169260976525372/card.png")

                    rank.build().then(data => { message.followUp({files: [new Discord.AttachmentBuilder(data, {name: "rank.png"})], embeds: [EmbedUserInfo], ephemeral: true}) });
                
            })
        })
    }
}