const { RankCardBuilder, Font, BuiltInGraphemeProvider } = require('canvacord');
const { EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const i18n = require('i18n');


module.exports = {
    
    name: "niveau",
    name_localizations:({
        'fr': 'niveau',
        'en-US': 'level',
        'en-GB': 'level',
    }),
    description: "Affiche l'xp d'un membre",
    description_localizations:({
        'fr': 'Affiche l\'xp d\'un membre',
        'en-US': 'Shows a member\'s XP',
        'en-GB': 'Shows a member\'s XP',
    }),
    utilisation: "/niveau [membre]",
    type: 1,
    permission: "Aucune",
    dm: false,
    category: "Informations",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            name_localizations:({
                'fr': 'membre',
                'en-US': 'member',
                'en-GB': 'member',
            }),
            description: "L'xp du membre à voir",
            description_localizations:({
                'fr': 'L`\'xp du membre à voir',
                'en-US': 'Member\'s XP to see',
                'en-GB': 'Member\'s XP to see',
            }),
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
                        .setTextStyles({
                            level:i18n.__("profil_niveau"),
                            xp: i18n.__("profil_xp"),
                            rank: i18n.__("profil_rang")
                        })
                        .setRank(place)
                        .setRequiredXP(nextLevelXP)
                        .setStatus(status)
                        .setUsername(membre.username)

                        rank.build().then(async data => {
                            await message.followUp({files: [new AttachmentBuilder(data, {name: "rank.png"})]})
                        }).catch(err => console.error(err));
                    }

                    try { await fonction_level(await user.presence.status) } catch { await fonction_level("offline") }
                })
            })
        })

        
    }
}