const Discord = require("discord.js")
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {

    name: "mute",
    description: "Mute un membre",
    utilisation: "/mute [membre] [temps] [raison]",
    type: 1,
    permission: PermissionFlagsBits.MuteMembers,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Le membre à mute",
            required: true,
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.String,
            name: "temps",
            description: "Le temps du mute (aide toi de l'autocomplete)",
            required: true,
            autocomplete: true
        }, {
            type: ApplicationCommandOptionType.String,
            name: "raison",
            description: "La raison du mute",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        temps = "millisecondes"

        let user = args.getUser("membre")
        if(!user) return message.reply({content: "Pas de membre à mute !", ephemeral: true})
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply({content: "Pas de membre à mute !", ephemeral: true})

        let time = args.getString("temps")
        if(!time) return message.reply({content: "Aucun temps fourni !", ephemeral: true})
        //if(isNaN(ms(time))) return message.reply({content: "Pas le bon format", ephemeral: true})
        if((time) > 2419200) return message.reply({content: "Le mute ne peut pas durer plus de 28 jours", ephemeral: true})
        /*console.log(time)
        time = time / 1000
        console.log(time)*/

        let reason = args.getString("raison")
        if(!reason) return message.reply ({content: "Aucune raison fournie !", ephemeral: true})

        if(message.user.id === user.id) return message.reply({content: "N'essaye pas de te mute !", ephemeral: true})
        if((await message.guild.fetchOwner()).id === user.id) return message.reply({content: "N'essaye pas de mute le propriétaire du serveur !", ephemeral: true})
        if(!member.moderatable) return message.reply({content: "Tu ne peux pas mute un modérateur !", ephemeral: true})
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Tu ne peux pas mute ce membre car il est au dessus de toi !", ephemeral: true})
        if(member.isCommunicationDisabled()) return message.reply({content: "Ce membre est déjà mute !", ephemeral: true})

        //automatique
        if(time === "1 minute") {
            time = 60} else if(time === "2 minutes") {
                time = 120} else if(time === "5 minutes") {
                    time = 300} else if(time === "10 minutes") {
                        time = 600} else if(time === "15 minutes") {
                            time = 900} else if(time === "20 minutes") {
                                time = 1200} else if(time === "30 minutes") {
                                    time = 1800} else if(time === "45 minutes") {
                                        time = 2700} else if(time === "1 heure") {
                                            time = 3600} else if(time === "2 heures") {
                                                time = 7200} else if(time === "5 heures") {
                                                    time = 18000} else if(time === "12 heures") {
                                                        time = 43200} else if(time === "1 jour") {
                                                            time = 86400} else if(time === "2 jours") {
                                                                time = 172800} else if(time === "3 jours") {
                                                                    time = 259200} else if(time === "4 jours") {
                                                                        time = 345600} else if(time === "5 jours") {
                                                                            time = 432000} else if(time === "6 jours") {
                                                                                time = 518400} else if(time === "1 semaine") {
                                                                                    time = 604800} else if(time === "1,5 semaines") {
                                                                                        time = 907200} else if(time === "2 semaines") {
                                                                                            time = 1209600} else if(time === "2,5 semaines") {
                                                                                                time = 1512000} else if(time === "3 semaines") {
                                                                                                    time = 1814400} else if(time === "3,5 semaines") {
                                                                                                        time = 2116800} else if(time === "4 semaines") {
                                                                                                            time = 2419199} else return message.reply({content: "Merci d'indiquer un date valide !", ephemeral: true})

        if(time >= 86400) { //jours

            await member.timeout((time * 1000), reason)

            time = time / 86400,
            time = Math.round(time),
            temps = "jours"
        
            try {await user.send(`Tu as été **MUTE** du serveur $**\`${message.guild.name}\`** par ${message.user.tag} jusqu'au <t:${Math.floor(parseInt(Date.now()) / 1000 + time * 86400)}:F> pour la raison : \`${reason}\` !`)} catch(err) {}

            await message.reply(`${message.user} a **MUTE** <@${user.id}> jusqu'au <t:${Math.floor(parseInt(Date.now()) / 1000 + time * 86400)}:F> pour la raison : \`${reason}\` !`)

            let ID = await bot.function.createId("MUTE")

            db.query(`INSERT INTO mutes (guild, user, author, ID, time, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${time} ${temps}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
        } else
        
        if(time >= 3600) { //heures
            
            await member.timeout((time * 1000), reason)

            time = time / 3600,
            time = Math.round(time),
            temps = "heures"
        
            try {await user.send(`Tu as été **MUTE** du serveur **\`${message.guild.name}\`** par ${message.user.tag} jusqu'au <t:${Math.floor(parseInt(Date.now()) / 1000 + time * 3600)}:F> pour la raison : \`${reason}\` !`)} catch(err) {}

            await message.reply(`${message.user} a **MUTE** <@${user.id}> jusqu'à <t:${Math.floor(parseInt(Date.now()) / 1000 + time * 3600)}:t> pour la raison : \`${reason}\` !`)

            let ID = await bot.function.createId("MUTE")

            db.query(`INSERT INTO mutes (guild, user, author, ID, time, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${time} ${temps}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
        } else
        
        if(time >= 60) { //minutes

            await member.timeout((time * 1000), reason)

            time = time / 60,
            time = Math.round(time),
            temps = "minutes"
        
            try {await user.send(`Tu as été **MUTE** du serveur **\`${message.guild.name}\`** par ${message.user.tag} jusqu'à <t:${Math.floor(parseInt(Date.now()) / 1000 + time * 60)}:t> pour la raison : \`${reason}\` !`)} catch(err) {}

            await message.reply(`${message.user} a **MUTE** <@${user.id}> jusqu'à <t:${Math.floor(parseInt(Date.now()) / 1000 + time * 60)}:t> pour la raison : \`${reason}\` !`)

            let ID = await bot.function.createId("MUTE")

            db.query(`INSERT INTO mutes (guild, user, author, ID, time, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${time} ${temps}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
        } else
        
        /*if(time)*/ { //secondes

            await member.timeout((time * 1000), reason)

            //time = time / 1000,
            time = Math.round(time),
            temps = "secondes"
        
            try {await user.send(`Tu as été **MUTE** du serveur **\`${message.guild.name}\`** par ${message.user.tag} jusqu'à <t:${Math.floor(parseInt(Date.now()) / 1000 + time)}:T> pour la raison : \`${reason}\` !`)} catch(err) {}

            await message.reply(`${message.user} a **MUTE** <@${user.id}> jusqu'à <t:${Math.floor(parseInt(Date.now()) / 1000 + time)}:T> pour la raison : \`${reason}\` !`)

            let ID = await bot.function.createId("MUTE")

            db.query(`INSERT INTO mutes (guild, user, author, ID, time, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${time} ${temps}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
        }/* else { //millisecondes

            await member.timeout(ms(time), reason)

            time = Math.round(time),
            temps = "millisecondes"
        
            try {await user.send(`Tu as été **MUTE** du serveur **\`${message.guild.name}\`** par ${message.user.tag} jusqu'à <t:${Math.floor(parseInt(Date.now()) / 1000 + time * 3600)}:T> pour la raison : \`${reason}\` !`)} catch(err) {}

            await message.reply(`${message.user} a **MUTE** <@${user.id}> jusqu'à <t:${Math.floor(parseInt(Date.now()) / 1000 + time * 3600)}:T> pour la raison : \`${reason}\` !`)

            let ID = await bot.function.createId("MUTE")

            db.query(`INSERT INTO mutes (guild, user, author, ID, time, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${time} ${temps}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
        }*/
    }
}