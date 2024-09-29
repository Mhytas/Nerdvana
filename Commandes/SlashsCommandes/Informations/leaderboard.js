const { LeaderboardBuilder, LeaderboardVariants, Font, BuiltInGraphemeProvider } = require('canvacord');
const { EmbedBuilder, AttachmentBuilder, ApplicationCommandOptionType } = require("discord.js");
const i18n = require('i18n');


module.exports = {
    
    name: "leaderboard",
    name_localizations:({
        'fr': 'classement',
        'en-US': 'leaderboard',
        'en-GB': 'leaderboard',
    }),
    description: "Shows server ranking",
    description_localizations:({
        'fr': 'Affiche le classement du serveur',
        'en-US': 'Shows server ranking',
        'en-GB': 'Shows server ranking',
    }),
    utilisation: "/leaderboard",
    type: 1,
    permission: "Aucune",
    dm: false,
    category: "Informations",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "xp",
            name_localizations:({
                'fr': 'xp',
                'en-US': 'xp',
                'en-GB': 'xp',
            }),
            description: "Shows the server\'s XP ranking",
            description_localizations:({
                'fr': 'Affiche le classement de l\'xp du serveur',
                'en-US': 'Shows the server\'s XP ranking',
                'en-GB': 'Shows the server\'s XP ranking',
            }),
        },{
            type: ApplicationCommandOptionType.Subcommand,
            name: "invitations",
            name_localizations:({
                'fr': 'invitations',
                'en-US': 'invitations',
                'en-GB': 'invitations',
            }),
            description: "Shows the server's invitation ranking",
            description_localizations:({
                'fr': 'Affiche le classement des invitations du serveur',
                'en-US': 'Shows the server\'s invitation ranking',
                'en-GB': 'Shows the server\'s invitation ranking',
            }),
        },{
            type: ApplicationCommandOptionType.Subcommand,
            name: "money",
            name_localizations:({
                'fr': 'argent',
                'en-US': 'money',
                'en-GB': 'money',
            }),
            description: "Shows server money ranking",
            description_localizations:({
                'fr': 'Affiche le classement de l\'argent du serveur',
                'en-US': 'Shows server money ranking',
                'en-GB': 'Shows server money ranking',
            }),
        },
    ],
    
    async run(bot, message, args, db) {
        await db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req_langue) => {
            let langue = req_langue[0].langue
            if(langue === "fr") i18n.setLocale("fr")
            if(langue === "en") i18n.setLocale("en")

            const subCommand = await args.getSubcommand();
            switch (subCommand) {
                case 'xp':
                await db.query(`SELECT userID, xp, niveau FROM user AS u1 WHERE u1.xp > 0 OR u1.niveau > 0 ORDER BY niveau DESC, xp DESC LIMIT 10`, async (err, req) => {
                    if (err) return console.error(err)
                    
                    const guild = await bot.guilds.fetch(message.guild.id);
                    let players = []
                    let position = 1
                    for(const player of req) {
                        try {
                            let player_user = await guild.members.fetch(player.userID)
                            if(player_user.user.bot) continue
                            players.push({
                                displayName: player_user.displayName,
                                username: player_user.user.username,
                                level: player.niveau,
                                xp: player.xp,
                                rank: position,
                                avatar: player_user.displayAvatarURL({format: 'png', size: 512}),
                            })
                            position = position + 1
                        } catch (fetchErr) {
                            console.error(`Impossible de récupérer l'utilisateur ${player.userID} : ${fetchErr.message}`);
                        }
                    }

                    const noxp = new EmbedBuilder()
                    .setDescription("**" + i18n.__("leaderboard_noxp") + "**")
                    .setColor("DarkRed")
                    if(players.length === 0) return await message.reply({embeds: [noxp], ephemeral: true})
                    
                    await message.deferReply()
                    Font.loadDefault()
                    
                    try {
                        new LeaderboardBuilder()
                            .setGraphemeProvider(BuiltInGraphemeProvider.Twemoji)
                            .setBackgroundColor()
                            .setHeader({
                                title: i18n.__("leaderboard_titre_xp"),
                                subtitle: guild.name,
                                image: guild.iconURL()
                            })
                            .setVariant(LeaderboardVariants.Default)
                            .setPlayers(players)
                            .setTextStyles({
                                level: i18n.__("leaderboard_niveau"),
                                xp: i18n.__("leaderboard_xp"),
                                rank: i18n.__("leaderboard_rang"),
                            })
                            .build().then(async data => {
                                await message.followUp({files: [new AttachmentBuilder(data, {name: "leaderboard.png"})]})
                            }).catch(err => console.error(err));

                    } catch (buildErr) { return console.error(buildErr) }
                })
                break;
                
                case 'invitations':
                    await db.query(`SELECT userID, invites FROM user AS u1 WHERE u1.invites > 0 ORDER BY invites DESC LIMIT 10`, async (err, req) => {
                        if (err) return console.error(err)
                                            
                        const guild = await bot.guilds.fetch(message.guild.id);
                        let players = []
                        let position = 1
                        for(const player of req) {
                            try {
                                let player_user = await guild.members.fetch(player.userID)
                                if(player_user.user.bot) continue
                                players.push({
                                    displayName: player_user.displayName,
                                    username: player_user.user.username,
                                    level: "",
                                    xp: player.invites,
                                    rank: position,
                                    avatar: player_user.displayAvatarURL({format: 'png', size: 512}),
                                })
                                position = position + 1
                            } catch (fetchErr) {
                                console.error(`Impossible de récupérer l'utilisateur ${player.userID} : ${fetchErr.message}`);
                            }
                        }
    
                        const noxp = new EmbedBuilder()
                        .setDescription("**" + i18n.__("leaderboard_noinvite") + "**")
                        .setColor("DarkRed")
                        if(players.length === 0) return await message.reply({embeds: [noxp], ephemeral: true})
                        
                        await message.deferReply()
                        Font.loadDefault()
                        
                        try {
                            new LeaderboardBuilder()
                                .setGraphemeProvider(BuiltInGraphemeProvider.Twemoji)
                                .setBackgroundColor()
                                .setHeader({
                                    title: i18n.__("leaderboard_titre_invite"),
                                    subtitle: guild.name,
                                    image: guild.iconURL()
                                })
                                .setVariant(LeaderboardVariants.Default)
                                .setPlayers(players)
                                .setTextStyles({
                                    level: "",
                                    xp: i18n.__("leaderboard_invite"),
                                    rank: i18n.__("leaderboard_rang"),
                                })
                                .build().then(async data => {
                                    await message.followUp({files: [new AttachmentBuilder(data, {name: "leaderboard.png"})]})
                                }).catch(err => console.error(err));
    
                        } catch (buildErr) { return console.error(buildErr) }
                    })
                break;
                
                case 'money':
                    await db.query(`SELECT userID, argent, max_argent FROM user AS u1 WHERE u1.argent > 0 ORDER BY argent DESC LIMIT 10`, async (err, req) => {
                        if (err) return console.error(err)
                                            
                        const guild = await bot.guilds.fetch(message.guild.id);
                        let players = []
                        let position = 1
                        for(const player of req) {
                            try {
                                let player_user = await guild.members.fetch(player.userID)
                                if(player_user.user.bot) continue
                                players.push({
                                    displayName: player_user.displayName,
                                    username: player_user.user.username,
                                    level: player.max_argent + " 💰",
                                    xp: player.argent,
                                    rank: position,
                                    avatar: player_user.displayAvatarURL({format: 'png', size: 512}),
                                })
                                position = position + 1
                            } catch (fetchErr) {
                                console.error(`Impossible de récupérer l'utilisateur ${player.userID} : ${fetchErr.message}`);
                            }
                        }
    
                        const noxp = new EmbedBuilder()
                        .setDescription("**" + i18n.__("leaderboard_noargent") + "**")
                        .setColor("DarkRed")
                        if(players.length === 0) return await message.reply({embeds: [noxp], ephemeral: true})
                        
                        await message.deferReply()
                        Font.loadDefault()
                        
                        try {
                            new LeaderboardBuilder()
                                .setGraphemeProvider(BuiltInGraphemeProvider.Twemoji)
                                .setBackgroundColor()
                                .setHeader({
                                    title: i18n.__("leaderboard_titre_argent"),
                                    subtitle: guild.name,
                                    image: guild.iconURL()
                                })
                                .setVariant(LeaderboardVariants.Default)
                                .setPlayers(players)
                                .setTextStyles({
                                    level: i18n.__("leaderboard_argent_record"),
                                    xp: i18n.__("leaderboard_argent"),
                                    rank: i18n.__("leaderboard_rang"),
                                })
                                .build().then(async data => {
                                    await message.followUp({files: [new AttachmentBuilder(data, {name: "leaderboard.png"})]})
                                }).catch(err => console.error(err));
    
                        } catch (buildErr) { return console.error(buildErr) }
                    })
                break;

                default:
                    const embed_erreur_subcommands = new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription("**" + i18n.__("erreur_subcommands") + "**")
                    await message.reply({embeds: [embed_erreur_subcommands], ephemeral: true})
                break;
            }
        })
    }
}