const Discord = require("discord.js")
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");


module.exports = {

    name: "warn",
    description: "Warn un membre",
    utilisation: "/warn [membre] [raison]",
    type: 1,
    permission: PermissionFlagsBits.ModerateMembers,
    ownerOnly: false,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Le membre à warn",
            required: true,
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.String,
            name: "raison",
            description: "La raison du warn",
            required: true,
            autocomplete: true
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if(!user) return message.reply({content: "Pas de membre à warn !", ephemeral: true})
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply({content: "Pas de membre à warn !", ephemeral: true})

        let reason = args.getString("raison")
        if(reason === "Modification | Titre & Description") reason = "Nous souhaitons vous rappeler qu'en accord avec les règles du salon de <@1061590203086680065>, il est strictement interdit de modifier le nom ou la description de votre offre une fois celle-ci prise. En cas de non-respect de cette règle, votre offre sera immédiatement supprimée."
        if(!reason) return message.reply ({content: "Aucune raison fournie !", ephemeral: true})

        if(message.user.id === user.id) return message.reply({content: "N'essaye pas de te warn !", ephemeral: true})
        if((await message.guild.fetchOwner()).id === user.id) return message.reply({content: "N'essaye pas de warn le propriétaire du serveur !", ephemeral: true})
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Tu ne peux pas warn ce membre !", ephemeral: true})
        if((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Je ne peux pas warn ce membre !", ephemeral: true})

        try{await user.send(`Tu as été **WARN** du serveur **\`${message.guild.name}\`** par le modérateur <@${message.user.id}> pour la raison : \n\n${reason}`)} catch(err) {}

        await message.reply(`${message.user} a **WARN** <@${user.id}> pour la raison : \n\n${reason}`)

        let ID = await bot.function.createId("WARN")

        db.query(`INSERT INTO warns (guild, user, author, ID, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)

    }
}