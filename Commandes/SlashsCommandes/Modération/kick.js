const Discord = require("discord.js")
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {

    name: "kick",
    description: "Kick un membre",
    type: 1,
    utilisation: "/kick [membre] [raison]",
    permission: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Le membre à kick",
            required: true,
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.String,
            name: "raison",
            description: "La raison du kick",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {
        
        let user = args.getUser("membre")
        if(!user) return message.reply({content: "Pas de membre à kick !", ephemeral: true})
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply({content: "Pas de membre à kick !", ephemeral: true})

        let reason = args.getString("raison")
        if(!reason) reason = "Pas de raison spécifiée";

        if(message.user.id === user.id) return message.reply({content: "N'essaye pas de te kick !", ephemeral: true})
        if((await message.guild.fetchOwner()).id === user.id) return message.reply({content: "N'essaye pas de kick le propriétaire du serveur !", ephemeral: true})
        if(member && !member.kickable) return message.reply({content: "Je ne peux pas kick ce membre !", ephemeral: true})
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Tu ne peux pas kick ce membre !", ephemeral: true})

        try{await user.send(`Tu as été **KICK** du serveur **\`${message.guild.name}\`** par <@${message.user.id}> pour la raison suivante : \`${reason}\` !`)} catch(err) {}

        await message.reply(`${message.user} a **KICK** <@${user.id}> pour la raison : \`${reason}\` !`)

        await member.kick(reason)

        let ID = await bot.function.createId("KICK")

        db.query(`INSERT INTO kicks (guild, user, author, ID, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
    }
}