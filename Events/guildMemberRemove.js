const Discord = require("discord.js")
const canvacord = require("canvacord");
const { Leaver } = canvacord;

module.exports = async(bot, member, type, invite) => {

    let db = bot.db
    if(member === bot) return

    //logs
    db.query(`SELECT * FROM server WHERE guild = '${member.guild.id}'`, async (err, req) => {

        let logs = ""
        if(req[0] !== undefined) logs = member.guild.channels.cache.find((channel) => channel.id === req[0].logs)
        if(!logs) console.log("Aucune salon de logs trouvé !", err)

        
        let EmbedUserLogs = new Discord.EmbedBuilder()
        .setTimestamp()
        .setFooter({text: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL({dynamic: true, size: 4096})})
        .setImage(await (await bot.users.fetch(member.user.id, {force: true})).bannerURL({dynamic: true, size: 4096}))
        .setAuthor({name: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true, size: 4096 })})
        .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 4096}))
        .setColor("#ED0000")
        .setFields(
            { name: '😃 Nom :', value: `${member.user.username}`, inline: true },
            { name: '🔰 Mention :', value: `<@${member.user.id}>`, inline: true },
            { name: '🆔 ID :', value: `${member.user.id}`, inline: true },
            { name: '🤖 Bot :', value: `${member.user.bot ? "✅" : "❌"}`, inline: true },
            { name: '🕰️ Création du compte :', value: `<t:${Math.floor(member.user.createdAt / 1000)}:F> (<t:${Math.floor(member.user.createdAt / 1000)}:R>)`, inline: true },
            { name: '👨 Avatar :', value: `[URL](${member.user.displayAvatarURL({dynamic: true, size: 4096})})`, inline: true },
            { name: '🖼️ Bannière :', value: `${member.user.banner ? `**[URL](${await (await bot.users.fetch(member.user.id, {force: true})).bannerURL({dynamic: true, size: 4096})})**` : "❌"}`, inline: true },
        )
        if(req[0] !== undefined) if(req[0].antiraid === "true") EmbedUserLogs.addFields({ name: ' :no_entry: Antiraid :', value: `L'utilisateur a été kick à causse de l'antiraid !`, inline: true })

        try { await logs.send({embeds: [EmbedUserLogs]}) } catch (err) {console.log(`Erreurs lors de l'envoie de l'embed de départ :`, err)}
        

        //message de départ
        db.query(`SELECT * FROM server WHERE guild = '${member.guild.id}'`, async (err, req) => {

            if(req.length < 1) return;
            if(req[0].antiraid === "true") return;

                const DepartChannel = member.guild.channels.cache.find((channel) => channel.id === req[0].depart);

                const home = new Leaver()
                .setUsername(member.user.username)
                .setAvatar(member.displayAvatarURL({dynamic: true, size: 4096}))
                .setMemberCount(member.guild.members.cache.filter(member => !member.user.bot).size)
                .setGuildName(member.guild.name)

                home.build().then(data => {

                    try { DepartChannel.send({files: [new Discord.AttachmentBuilder(data, {name: "home.png"})]}) } catch (err) {console.log(`Erreurs lors de l'envoie de l'embed de départ :`, err)}
            })
        })

        
        //captcha
        //enleve le message de captcha de la db + de Discord
        db.query(`SELECT * FROM captcha WHERE UserID = '${member.user.id}' AND GuildID = '${member.guild.id}'`, async (err, req) => {
            if (req.length < 1) return;

            db.query(`SELECT * FROM server WHERE guild = '${member.guild.id}'`, async (err, all) => {
                const msg = await bot.channels.cache.get(all[0].captcha).messages.fetch(req[0].MessageID);
                const channel = member.guild.channels.cache.get(all[0].captcha)

                await msg.delete()
                await channel.permissionOverwrites.delete(member.user.id)
                db.query(`DELETE FROM captcha WHERE MessageID = '${req[0].MessageID}'`)
            })
        })
    })
}