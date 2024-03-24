const Discord = require("discord.js")
const ms = require("ms")
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");


module.exports = {

    name: "unmute",
    description: "Unmute un membre",
    utilisation: "/umute [membre] [raison]",
    type: 1,
    permission: PermissionFlagsBits.MuteMembers,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Le membre à unmute",
            required: true,
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.String,
            name: "raison",
            description: "La raison de l'unmute",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if(!user) return message.reply({content: "Pas de membre à unmute !", ephemeral: true})
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply({content: "Pas de membre à unmute !", ephemeral: true})

        let reason = args.getString("raison")
        if(!reason) return message.reply ({content: "Aucune raison fournie !", ephemeral: true})

        if(!member.moderatable) return message.reply({content: "Tu ne peux pas unmute un modérateur !", ephemeral: true})
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Ce membre est plus haut que toi, tu ne peux pas l'unmute", ephemeral: true})
        if(!member.isCommunicationDisabled()) return message.reply({content: "Ce membre est déjà unmute !", ephemeral: true})

        await message.reply(`${message.user} a **UNMUTE** <@${user.id}> pour la raison : \`${reason}\` !`)
        try{await user.send(`Tu as été **UNMUTE** du serveur **\`${message.guild.name}\`** par le modérateur <@${message.user.id}> pour la raison : \`${reason}\` !`)} catch(err) {}

        await member.timeout(null, reason)

        let ID = await bot.function.createId("UNMUTE")

        db.query(`INSERT INTO unmutes (guild, user, author, ID, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
    }
}