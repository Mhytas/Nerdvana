const { RankCardBuilder, Font, BuiltInGraphemeProvider } = require('canvacord');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const i18n = require('i18n');

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

        await db.query(`SELECT * FROM user WHERE userID = '${member.id}' AND guildID = ${message.guild.id}`, async (err, req) => {
            await db.query(`SELECT id, xp, niveau, (SELECT COUNT(*) + 1 FROM \`user\` AS u2 WHERE (u2.niveau > u1.niveau) OR (u2.niveau = u1.niveau AND u2.xp > u1.xp)) AS position FROM \`user\` AS u1 ORDER BY niveau DESC, xp DESC;`, async (err2, all) => {
                await db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req_langue) => {
                    let langue = req_langue[0].langue
                    if(langue === "fr") i18n.setLocale("fr")
                    if(langue === "en") i18n.setLocale("en")

                    await message.deferReply({ephemeral: true})

                    //Plateforme de connexion
                    let platform = member ? member.presence ? member.presence.clientStatus : i18n.__("profil_horsligne") : i18n.__("profil_inconnu");
                    //Web
                    if (platform.web) platform = "<:navigateur:1243668743331119276>"
                    //Téléphone
                    else if (platform.mobile) platform = "<:portable:1243668747374563328>"
                    //Oridanteur
                    else if (platform.desktop) platform = "<:ordinateur:1243668745159835648>"
                    
                    
                    //Status
                    let presence = member ? member.presence ? member.presence.status : i18n.__("profil_horsligne") : i18n.__("profil_inconnu");
                    if(presence == "idle") presence = "🟡"; else if(presence == i18n.__("profil_horsligne") || presence == "offline") {presence = "⚪", platform = i18n.__("profil_horsligne")} else if(presence == "online") presence = "🟢"; else if(presence == "streaming") presence = "🟣"; else if(presence == "dnd") presence = "🔴"; else if(presence == i18n.__("profil_inconnu")) {presence = "❓", platform = "❓"}

                    //Badges
                    let badges = await member.user.flags.toArray().map(badge => badge.toUpperCase())
                    if(member.user.id === await message.guild.ownerId) badges.push("SERVEROWNER")
                    let badgeNames = i18n.__("profil_badge")
                    if(badges.length > 1) badgeNames = i18n.__("profil_badges")
            
                    const flags = {
                        STAFF: "<:STAFF:1244058464821579796>",
                        PARTNER: "<:PARTNER:1244058466902085693>",
                        HYPESQUAD: "<:HYPESQUAD:1244058469133189210>",
                        BUGHUNTERLEVEL1: "<:BUGHUNTERLEVEL1:1244058471419351182>",
                        BUGHUNTERLEVEL2: "<:BUGHUNTERLEVEL2:1244058473604317256>",
                        HYPESQUADONLINEHOUSE1: "<:HYPESQUADONLINEHOUSE1:1244059215350333531>",
                        HYPESQUADONLINEHOUSE2: "<:HYPESQUADONLINEHOUSE2:1244058477505286244>",
                        HYPESQUADONLINEHOUSE3: "<:HYPESQUADONLINEHOUSE3:1244058479694577684>",
                        PREMIUMEARLYSUPPORTER: "<:PREMIUMEARLYSUPPORTER:1244058451064258601>",
                        VERIFIEDBOT: "<:VERIFIEDBOT1:1244062331852296263><:VERIFIEDBOT2:1244062333848916029><:VERIFIEDBOT3:1244062335761514669>",
                        VERIFIEDDEVELOPER: "<:VERIFIEDDEVELOPER:1244058453081591879>",
                        CERTIFIEDMODERATOR: "<:CERTIFIEDMODERATOR:1244058456898404423>",
                        ACTIVEDEVELOPER: "<:ACTIVEDEVELOPER:1244058460320956597>",
                        SERVEROWNER: '<:SERVEROWNER:1244058462523101214>',
                    };
                    
                    const userBadges = await badges.map(badge => flags[badge]).join(' ')
                    const nombreRoles = await member.roles.cache.size - 1
                    let onlyrole = false
                    let roleName = i18n.__("profil_rôles")
                    if(nombreRoles === 0 || nombreRoles === 1) onlyrole = true
                    if(onlyrole === true) roleName = i18n.__("profil_rôle")

                    //Embed
                    let EmbedUserInfo = new EmbedBuilder()
                    .setAuthor({name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()
                    .setFooter({text: `${member.user.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
                    .setThumbnail(member.displayAvatarURL({dynamic: true}))
                    .setImage(await (await bot.users.fetch(member.id, {force: true})).bannerURL({dynamic: true, size: 4096}))
                    .setColor(bot.color)
                    .setDescription(`**__${i18n.__("profil_info1")} <@${member.user.id}>__**`)
                    
                    .addFields({name: i18n.__("profil_pseudo"), value: member.user.username, inline: true})
                    .addFields({name: i18n.__("profil_id"), value: `${member.id}`, inline: true})
                    .addFields({name: i18n.__("profil_mention"), value: `<@${member.id}>`, inline: true})
                    .addFields({name: i18n.__("profil_avatar"), value: `**[URL](${member.displayAvatarURL({dynamic: true, size: 4096})})**`, inline: true})
                    .addFields({name: i18n.__("profil_bannière"), value: `${member.user.banner ? `**[URL](${await (await bot.users.fetch(member.id, {force: true})).bannerURL({dynamic: true, size: 4096})})**` : "❌"}`, inline: true})
                    .addFields({name: i18n.__("profil_bot"), value: `${member.user.bot ? "✅" : "❌"}`, inline: true})
                    .addFields({name: i18n.__("profil_status"), value: `${presence}`, inline: true})
                    .addFields({name: i18n.__("profil_platforme"), value: `${platform}`, inline: true})
                    .addFields({name: badgeNames, value: `${badges.length ? userBadges : `<@${member.user.id}>` + i18n.__("profil_nobadge")}`, inline: true})
                    .addFields({name: i18n.__("profil_création"), value: `<t:${Math.floor(member.user.createdAt / 1000)}:F> (<t:${Math.floor(member.user.createdAt / 1000)}:R>)`, inline: true})
                    
                    member ? EmbedUserInfo.addFields({name: `__` + i18n.__("profil_info2") + member.user.username + i18n.__("profil_info2_sur") + message.guild.name + `__`, value: `\n**Arrivée sur le serveur :**\n<t:${Math.floor(member.joinedAt / 1000)}:F> (<t:${Math.floor(member.joinedAt / 1000)}:R>)`, inline: false}) : ""
                    member && nombreRoles !== 0 ? EmbedUserInfo.addFields({name: nombreRoles + roleName, value: `${member.roles.cache.filter(role => role.name !== "@everyone").sort((a, b) => b.position - a.position).map(role => role).join(", ")}`, inline: true}) : ""
                    member && onlyrole === false ? EmbedUserInfo.addFields({name: i18n.__("profil_rôle_haut"), value: `${member.roles.highest}`, inline: true}) : ""
                    member && member.nickname ? EmbedUserInfo.addFields({name: i18n.__("profil_surnom"), value: member.nickname, inline: true}) : ""

                    const user = await message.guild.members.cache.get(member.id)
                    const channel = await bot.channels.cache.get("1244233485150060665")
                    Font.loadDefault()

                    async function fonction_level (status) {
                        if(req[0].niveau === "0" && req[0].xp === "0") return await message.followUp({embeds: [EmbedUserInfo]})

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
                        let place = all.findIndex(r => r.id === message.guild.id + "_" + member.id) + 1
                        
                        new RankCardBuilder()
                        .setAvatar(member.displayAvatarURL({format: 'png', size: 512}))
                        .setBackground(bot.color)
                        .setCurrentXP(xpnow)
                        .setDisplayName(user.displayName)
                        .setGraphemeProvider(BuiltInGraphemeProvider.Twemoji)
                        .setLevel(niveaunow)
                        .setProgressCalculator(() => {
                            return (xpnow / nextLevelXP) * 100
                        })
                        .setTextStyles({
                            level:i18n.__("profil_niveau"),
                            xp: i18n.__("profil_xp"),
                            rank: i18n.__("profil_rang")
                        })
                        .setRank(place)
                        .setRequiredXP(nextLevelXP)
                        .setStatus(status)
                        .setUsername(member.username)
                        .build().then(async data => {
                            const message_image = await channel.send({files: [new AttachmentBuilder(data, {name: i18n.__("profil_rang") + ".png"})]})
                            EmbedUserInfo.setImage(await message_image.attachments.first().url)
                            await message.followUp({embeds: [EmbedUserInfo], ephemeral: true})
                        }).catch(async err => {
                            const embed_erreur = new EmbedBuilder()
                            .setColor("DarkRed")
                            .setDescription(i18n.__("profil_erreur"))
                            await message.followUp({embeds: [embed_erreur], ephemeral: true})
                            console.error(err)
                        });
                    }
    
                    try { await fonction_level(await user.presence.status) } catch { await fonction_level("offline") }
                })
            })
        })
    }
}