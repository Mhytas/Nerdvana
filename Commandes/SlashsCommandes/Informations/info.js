const Discord = require('discord.js')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    
    name: "info",
    description: "Les infos sur soit le bot soit un utilisateur",
    type: 1,
    utilisation: "/info",
    permission: "Aucune",
    ownerOnly: false,
    dm: false,
    category: "Informations",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "user",
            description: "Permet d'avoir des informations sur un utilisateur",
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "membre",
                    description: "Le membre dont vous voulez obtenir d'avantage d'informations",
                    required: false,
                    autocomplete: false,
                },
            ],
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "bot",
            description: "Permet d'avoir les informations sur le bot"
        },
    ],

    async run(bot, message, args, db) {

        const subCommand = args.getSubcommand(); // Obtenez le nom de la sous-commande à partir des arguments

        switch (subCommand) {
            case 'user':
                let user = args.getUser('membre')
                if(!user) user = message.user
                let member = message.guild.members.cache.get(user.id)
                


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

                await message.reply({embeds: [EmbedUserInfo], ephemeral: true})
                break;
            case 'bot':
                let Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`🤖${bot.user.username}🤖`)
                .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                .setFooter({text: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL({dynamic: true})})
                .setImage(bot.user.banner ? bot.user.banner : undefined)
                .setDescription(`**✉️ Information Général ✉️\n🤖Nom : \`${bot.user.username}\`\n📇Identifiant : \`${bot.user.id}\`\n😎 Gérant : <@408675475313917963>\n👨‍💻 Développeur : <@719475397783453697>\n\n📊 Informations Statistics 📊\nSalons : \`${bot.channels.cache.size.toLocaleString()}\`\nMembres Total modérés : \`${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\`\nCommandes disponibles : \`${bot.commands.size}\`**`)
                
                await message.reply({embeds : [Embed], ephemeral :true})
            break;
            default:
                message.reply({content: "Une erreur est survenu, merci de contacter un membre du staff pour faire remonter l'erreur", ephemeral: true})
            break;
        }
    }
}