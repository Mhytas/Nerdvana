const Discord = require("discord.js");
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Ban un membre",
    type: 1,
    utilisation: "/ban [membre] [raison]",
    permission: PermissionFlagsBits.BanMembers,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Le membre à bannir",
            required: true,
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.String,
            name: "raison",
            description: "La raison du bannissement",
            required: true,
            autocomplete: true
        }
    ],

    async run(bot, message, args, db) {

        try {
            let user = await bot.users.fetch(args._hoistedOptions[0].value);
            if(!user) return message.reply({content: "Pas de membre à bannir !", ephemeral: true});
            let member = message.guild.members.cache.get(user.id);

            let reason = args.getString("raison");
            if(reason === "Promotion de service d'hébergement frauduleux (mettre le nom ici)") reason = "Promotion de service d'hébergement frauduleux";
            if(!reason) return message.reply ({content: "Aucune raison fournie !", ephemeral: true});

            if(message.user.id === user.id) return message.reply({content: "N'essaye pas de te bannir !", ephemeral: true});
            if((await message.guild.fetchOwner()).id === user.id) return message.reply({content: "N'essaye pas de ban le propriétaire du serveur !", ephemeral: true});

            if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Tu ne peux pas bannir ce membre !", ephemeral: true});
            if(member && !member.bannable) return message.reply({content: "Je ne peux pas bannir ce membre !", ephemeral: true});
            
            let bannedUsers = await message.guild.bans.fetch();
            if(bannedUsers.get(user.id)) return message.reply({content: "Ce membre est déjà ban !", ephemeral: true});

            try {
                await user.send(`Tu as été **BAN** du serveur **\`${message.guild.name}\`** par <@${message.user.id}> pour la raison suivante : \n\n${reason}`);
            } catch(err) {
                console.log(err);
            }

            await message.guild.bans.create(user.id, {reason: `${message.user.username} : ${reason}`});

            await message.reply(`${message.user} a **BAN** <@${user.id}> pour la raison : \n\n${reason}`);

            let ID = await bot.function.createId("BAN");
            
            const escapedReason = mysql.escape(reason);

            db.query(`INSERT INTO bans (guild, user, author, ID, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`);

            connection.query(insertQuery, (error, results, fields) => {
                if (error) {
                  console.error(error);
                  return message.reply({ content: "Une erreur s'est produite lors de l'insertion dans la base de données.", ephemeral: true });
                }
                connection.end();
            });

        } catch (err) {
            
            console.log(err);
            return message.reply({content: "Une erreur s'est produite en essayant de bannir ce membre.", ephemeral: true});
        }
    }
}
