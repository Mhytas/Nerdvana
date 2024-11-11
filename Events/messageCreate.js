const { ChannelType, EmbedBuilder } = require("discord.js")

module.exports = async(bot, message) => {

    let db = bot.db;

    /*if(message.content.match(new RegExp(`<@${bot.user.id}>`, 'i'))) {
        const ping_bot = new EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`${bot.user.username} est présent !`)
        .setDescription(`**Vous avez besoin d'aide ?**
Bonjour ! :wave: Tout d'abord, merci d'utiliser __${bot.user.username}__ !

- Pour consulter toutes les **commandes disponibles**, il vous suffit de taper \`/\` puis de __naviguer__ parmi toutes les commandes de ${bot.user.username} !

- Pour bien débuter votre **utilisation** de __${bot.user.username}__, nous vous recommandons d'exécuter la commande __</help:1169569507526844430>__ afin de voir toutes les **commandes disponibles** !

Si vous avez **besoin d'aide** ou si vous souhaitez simplement obtenir __plus d'informations__ sur __${bot.user.username}__, n'hésitez pas à rejoindre notre **serveur support** !`)
        .setTimestamp()
        .setFooter({ text: `Demandé par ${message.author.username}.` })
        
        await message.channel.send({embeds: [ping_bot]})
    }*/
    
    
    await db.query(`SELECT * FROM ticket WHERE channel = '${message.channel.id}'`, async (err, req_ticket) => {
        await db.query(`UPDATE ticket SET time = '${Date.now()}' WHERE channel = '${message.channel.id}'`)
    })

    if(message.channel.type === ChannelType.DM) return;
    if(message.author.bot === true) return;

    await db.query(`SELECT * FROM user WHERE guildID = '${message.guild.id}' AND userID = '${message.author.id}'`, async (err, req) => {
        await db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req_config) => {

            const xpNeeded = [100, 255, 475, 770, 1150, 1625, 2205, 2900, 3720, 4675, 
                5775, 7050, 8450, 10045, 11825, 13800, 15980, 18375, 20995, 23850, 
                26950, 30305, 33925, 37820, 42000, 46475, 51255, 56350, 61770, 67525, 
                73625, 80080, 86900, 94095, 101675, 109650, 118030, 126825, 136045, 
                145700, 155800, 166355, 177375, 188870, 200850, 213325, 226305, 239800, 
                253820, 268375, 281225, 296300, 311900, 328045, 344750, 362025, 379880,
                398325, 417370, 437025, 457300, 478205, 499750, 521945, 544800, 568325,
                592530, 617425, 643020, 669325, 696350, 724105, 752600, 781845, 811850,
                842625, 874180, 906525, 939670, 973625, 1008375, 1043850, 1080250, 1117575,
                1155825, 1195000, 1235100, 1276125, 1318075, 1360950, 1404750, 1449475,
                1495125, 1541700, 1589200, 1637625, 1686975, 1737250, 1788450, 1840575]
            
            const niveaunow = parseInt(req[0].niveau)
            const nextLevelXP = xpNeeded[niveaunow]
            const xpnow = parseInt(req[0].xp)
            let random_xp = 20 //req_config[0].random_xp
            let xptoadd = xpnow + Math.floor(Math.random() * random_xp) + 1

            await db.query(`UPDATE user SET xp = '${xptoadd}' WHERE userID = ${message.author.id} AND guildID = '${message.guild.id}'`)

            if(xpnow >= nextLevelXP) {

                //Rajout d'un niveau dans la db + message de félicitation
                await db.query(`UPDATE user SET niveau = '${niveaunow + 1}', xp = '0' WHERE userID = '${message.author.id}' AND guildID = '${message.guild.id}'`)
                message.channel.send(`:tada: Félicitations <@${message.author.id}>, tu as atteint le niveau ${niveaunow + 1}  !\n:heart: Merci beaucoup pour ton activité dans ce serveur !`)

                /*if((niveaunow + 1) === 3) {
                    message.channel.send(`:tada: ${message.author}, pour ton passage au niveau ${niveaunow + 1} voici une récompense !`)
                    console.log("Récompenses !")
                }*/
            }
        })
    })
}