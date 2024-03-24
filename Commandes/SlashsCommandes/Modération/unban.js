const Discord = require("discord.js")
const { read } = require("fs")
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {

    name: "unban",
    description: "Unban un utilisateur",
    type: 1,
    utilisation: "/unban [utilisateur] (raison)",
    permission: PermissionFlagsBits.BanMembers,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "utilisateur",
            description: "L'utilisateur à débannir",
            required: true,
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.String,
            name: "raison",
            description: "La raison du débannissement",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        try {
        
            let user = args.getUser("utilisateur")
            if(!user) return message.reply({content: "Pas d'utilisateur à unban", ephemeral: true})
            let member = message.guild.members.cache.get(user.id)

            let reason = args.getString("raison")
            if(!reason) reason = "Pas de raison spécifiée";
            
            if(!(await message.guild.bans.fetch()).get(user.id)) return message.reply({content: "Cette utilisateur n'est pas banni !", ephemeral: true})

            try{await user.send(`Tu as été **UNBAN** du serveur **\`${message.guild.name}\`** par <@${message.user.id}> pour la raison suivante : \`${reason}\` !`)} catch(err) {}
            await message.reply(`${message.user} a **UNBAN** <@${user.id}> pour la raison : \`${reason}\` !`)

            await message.guild.members.unban(user, reason)

            let ID = await bot.function.createId("UNBAN")

            db.query(`INSERT INTO unbans (guild, user, author, ID, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
            
        } catch (err) {

            console.log(err)
            return message.reply({content: "Pas d'utilisateur à unban !", ephemeral: true})
        }
    }
}