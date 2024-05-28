const { LeaderboardBuilder, LeaderboardVariants, Font, BuiltInGraphemeProvider } = require('canvacord');
const { EmbedBuilder, AttachmentBuilder, ApplicationCommandOptionType } = require("discord.js");
const i18n = require('i18n');


module.exports = {
    
    name: "classement",
    name_localizations:({
        'fr': 'classement',
        'en-US': 'leaderboard',
        'en-GB': 'leaderboard',
    }),
    description: "Affiche le classement du serveur",
    description_localizations:({
        'fr': 'Affiche le classement du serveur',
        'en-US': 'Shows server ranking',
        'en-GB': 'Shows server ranking',
    }),
    utilisation: "/classement",
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
            description: "Affiche le classement de l'xp du serveur",
            description_localizations:({
                'fr': 'Affiche le classement de l\'xp du serveur',
                'en-US': 'Shows the server\'s XP ranking',
                'en-GB': 'Shows the server\'s XP ranking',
            }),
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "argent",
            name_localizations:({
                'fr': 'argent',
                'en-US': 'money',
                'en-GB': 'money',
            }),
            description: "Affiche le classement de l'argent du serveur",
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
                        .setDescription("**" + "Aucun membre du serveru a de l'XP !" + "**")
                        .setColor("DarkRed")
                        if(players.length === 0) return await message.reply({embeds: [noxp], ephemeral: true})
                        
                        await message.deferReply()
                        Font.loadDefault()
                        
                        try {
                            new LeaderboardBuilder()
                                .setGraphemeProvider(BuiltInGraphemeProvider.Twemoji)
                                .setBackgroundColor()
                                .setHeader({
                                    title: `Classement du serveur`,
                                    subtitle: guild.name,
                                    image: guild.iconURL()
                                })
                                .setVariant(LeaderboardVariants.Default)
                                .setPlayers(players)
                                .setTextStyles({
                                    level: i18n.__("profil_niveau"),
                                    xp: "XP",
                                })
                                .build().then(async data => {
                                    await message.followUp({files: [new AttachmentBuilder(data, {name: "leaderboard.png"})]})
                                }).catch(err => console.error(err));

                        } catch (buildErr) { return console.error(buildErr) }
                    })
                })
                break;
                /*case 'argent':
                    message.reply({content: "ping 2", ephemeral: true})
                break;*/
                default:
                    await message.reply({content: "Une erreur est survenu, merci de contacter un membre du staff pour faire remonter l'erreur", ephemeral: true})
                break;
            }
        })
    }
}