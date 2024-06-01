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
        },
        {
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
        {
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

                await db.query(`SELECT * FROM user WHERE guildID = ${message.guild.id}`, async (err, req) => {
                    await db.query(`SELECT id, xp, niveau, (SELECT COUNT(*) + 1 FROM \`user\` AS u2 WHERE (u2.niveau > u1.niveau) OR (u2.niveau = u1.niveau AND u2.xp > u1.xp)) AS position FROM \`user\` AS u1 ORDER BY niveau DESC, xp DESC;`, async (err2, all) => {
                        if (err) return console.error(err)
                        if (err2) return console.error(err2)
                        
                        const guild = await bot.guilds.fetch(message.guild.id);

                        const sortedResults = req.sort((a, b) => {
                            if (b.niveau === a.niveau) { return b.xp - a.xp }
                            return b.niveau - a.niveau;
                        });
                        
                        let players = []
                        for(const player of sortedResults.slice(0, 10)) {
                            try {
                                let player_user = await guild.members.fetch(player.userID)
                                if(player.xp === 0 && player.niveau === 0) continue
                                if(player_user.user.bot) continue
                                players.push({
                                    displayName: player_user.displayName,
                                    username: player_user.user.username,
                                    level: player.niveau,
                                    xp: player.xp,
                                    rank: all.findIndex(r => r.id === message.guild.id + "_" + player.userID) + 1,
                                    avatar: player_user.displayAvatarURL({format: 'png', size: 512}),
                                })
                            } catch {}
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
                                    title: i18n.__("leaderboard_titre"),
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
                })
                break;
                case 'money':
                    message.reply({content: "ping 2", ephemeral: true})
                break;
                case 'invitations':
                    await db.query(`SELECT * FROM user WHERE guildID = '${message.guild.id}' ORDER BY invites DESC`, async (err, req) => {
                        if(err) return console.log(err)
                        
                        const leaderboard = new EmbedBuilder()
                        .setColor(bot.color)
                        .setTitle("🏆 Classement des invitations 🏆")
                        .setDescription("Voici le top 10 des membres qui ont invité le plus de personnes 👥")
                        .setThumbnail(await message.guild.iconURL({ dynamic: true }))
                        .setTimestamp()
                        .setFooter({ text: "Invitez vos amis pour grimper dans le classement ! 🚀", iconURL: bot.user.avatarURL() });

                        for(let i = 0; i < req.length && i < 10; i++) {
                            if(req[i].invites === "0") continue
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

                        const embed_erreur_no_invitations = new EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("**" + i18n.__("erreur_no_invitations") + "**")
                        if(leaderboard.data.fields === undefined) return message.reply({embeds: [embed_erreur_no_invitations], ephemeral: true})
                        
                        await message.reply({ embeds: [leaderboard] });
                    });
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