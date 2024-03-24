const Discord = require("discord.js")
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {

    name: "liste",
    description: "Affiche la liste de modération d'un membre",
    utilisation: "/list [category] [membre]",
    type: 1,
    permission: PermissionFlagsBits.ModerateMembers,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "categorie",
            description: "La categorie de modération que tu veux regarder",
            required: true,
            autocomplete: true
        }, {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Le membre à qui vous souhaitez voir la categorie",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let categorie = args.getString("categorie")
        if(categorie !== "ban" && categorie !== "kick" && categorie !== "mute" && categorie !== "unban" && categorie !== "unmute" && categorie !== "warn" && categorie !== "toutes") return message.reply({content: "Merci de mettre une réponse valide !", ephemeral: true})

        let user = args.getUser("membre")
        if(!user) return message.reply({content: "Pas de membre !", ephemeral: true})
        /*let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply({content: "Pas de membre !", ephemeral: true})*/
        db.query(`SELECT * FROM ${categorie}s WHERE guild = '${message.guild.id}' AND user = '${user.id}'`, async (err, req) => {

            if(req.length < 1 ) return message.reply({content: `Ce membre n'a jamais été **${categorie}** !`, ephemeral: true})
            await req.sort((a, b) => parseInt(b.date) - parseInt(a.date))

            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`⚠ Du à la limation de l'API de Discord, je ne peux pas afficher plus de 25 ${categorie}s ! ⚠`)
            .setDescription(`${categorie}(s) de **<@${user.id}>** *(${user.id})*`)
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: `${categorie}(s)`})

            for(let i = 0; i < req.length; i++) {
                
                Embed.addFields([{name: `__${categorie} n°${i+1} :__`, value: `> **Auteur** : ${(await bot.users.fetch(req[i].author))} *(${(await bot.users.fetch(req[i].author)).id})*\n> **ID** : \`${req[i].ID}\`\n> **Raison** : \`${req[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}:F>`}])
            }

            await message.reply({embeds: [Embed], ephemeral: true})
        })
    }
}