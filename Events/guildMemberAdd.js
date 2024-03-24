const Discord = require("discord.js")
const canvacord = require("canvacord");
const { Welcomer } = canvacord;
const ms = require("ms");

module.exports = async(bot, member, type, invite) => {

    let bot_id = bot.user.id
    let db = bot.db

    //logs
    await db.query(`SELECT * FROM server WHERE guild = '${member.guild.id}'`, async (err, req) => {
        let logs = member.guild.channels.cache.find((channel) => channel.id === req[0].logs)
        if(!logs) console.log("Aucune salon de logs trouvé !", err)
        
        
        let EmbedUserLogs = new Discord.EmbedBuilder()
        .setTimestamp()
        .setFooter({text: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL({dynamic: true, size: 4096})})
        .setImage(await (await bot.users.fetch(member.user.id, {force: true})).bannerURL({dynamic: true, size: 4096}))
        .setAuthor({name: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true, size: 4096 })})
        .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 4096}))
        .setColor("#32CD32")
        .setFields(
            { name: '😃 Nom :', value: `${member.user.username}`, inline: true },
            { name: '🔰 Mention :', value: `<@${member.user.id}>`, inline: true },
            { name: '🆔 ID :', value: `${member.user.id}`, inline: true },
            { name: '🤖 Bot :', value: `${member.user.bot ? "✅" : "❌"}`, inline: true },
            { name: '🕰️ Création du compte :', value: `<t:${Math.floor(member.user.createdAt / 1000)}:F> (<t:${Math.floor(member.user.createdAt / 1000)}:R>)`, inline: true },
            { name: '👨 Avatar :', value: `[URL](${member.user.displayAvatarURL({dynamic: true, size: 4096})})`, inline: true },
            { name: '🖼️ Bannière :', value: `${member.user.banner ? `**[URL](${await (await bot.users.fetch(member.user.id, {force: true})).bannerURL({dynamic: true, size: 4096})})**` : "❌"}`, inline: true },
        )
        if(req[0].antiraid === "true") EmbedUserLogs.addFields({ name: ' :no_entry: Antiraid :', value: `L'utilisateur a été kick à causse de l'antiraid !`, inline: true })

        try { await logs.send({embeds: [EmbedUserLogs]}) } catch (err) {console.log(`Erreurs lors de l'envoie de l'embed d'arriver :`, err)}

        
        //antiraid
        if(req[0].antiraid === "true") {

            try{await member.user.send("Le serveur est en mode antiraid pour le moment, réssaye plus tard !")} catch(err) {}

            let reason = "Antiraid activé"

            await member.kick(reason)

            let ID = await bot.function.createId("KICK-ANTIRAID")
    
            await db.query(`INSERT INTO kicks (guild, user, author, ID, reason, date) VALUES ('${member.guild.id}', '${member.id}', '${bot_id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
        }
        
        //invitetracker + message de bienvenue
        await db.query(`SELECT * FROM server WHERE guild = '${member.guild.id}'`, async (err, all) => {
            if(all[0].antiraid === "true") return;
            await bot.function.insertDatabase(bot, member.guild)

            const welcomeChannel = member.guild.channels.cache.find((channel) => channel.id === all[0].arrive);

            const home = new Welcomer()
            .setUsername(member.user.username)
            .setAvatar(member.displayAvatarURL({dynamic: true, size: 4096}))
            .setMemberCount(member.guild.members.cache.filter(member => !member.user.bot).size)
            .setGuildName(member.guild.name)

            if(type === 'unknown' || type === undefined) home.build().then(data => {
                try {
                    welcomeChannel.send({content : `Bienvenue ${member} ! Je ne comprends pas comment vous avez rejoint le serveur...`, files: [new Discord.AttachmentBuilder(data, {name: "home.png"})]})
                } catch (err) {console.log(`Erreurs lors de l'envoie de l'embed d'arriver :`, err)}
            })

            if (type !== 'unknown' && type !== undefined) await db.query(`SELECT * FROM user WHERE ID = '${member.guild.id}' AND userID = '${invite.inviter.id}'`, async (err, req) => {

                let invitations = parseInt(req[0].invites) + 1
                console.log(req[0].invites)
                console.log(invitations)
                
                await db.query(`UPDATE user SET invites = '${invitations}' WHERE guildID = '${member.guild.id}' AND userID = '${invite.inviter.id}'`) 

                home.build().then(data => {

                    let invitations = parseInt(req[0].invites) + 1

                    if (type === 'normal') {
                        if(invitations === 1) {
                            try { welcomeChannel.send({content : `Bienvenue ${member} ! Vous avez été invité par <@${invite.inviter.id}> qui a maintenant ${invitations} invitation !`, files: [new Discord.AttachmentBuilder(data, {name: "home.png"})]}); } catch (err) {console.log(`Erreurs lors de l'envoie de l'embed d'arriver :`, err)}
                        } else {
                            try { welcomeChannel.send({content : `Bienvenue ${member} ! Vous avez été invité par <@${invite.inviter.id}> qui a maintenant ${invitations} invitations !`, files: [new Discord.AttachmentBuilder(data, {name: "home.png"})]}); } catch (err) {console.log(`Erreurs lors de l'envoie de l'embed d'arriver :`, err)}
                        }
                    }

                    else if (type === 'vanity') {
                        try { welcomeChannel.send({content : `Bienvenue ${member} ! Vous avez rejoint en utilisant une invitation personnalisée !`, files: [new Discord.AttachmentBuilder(data, {name: "home.png"})]}); } catch (err) {console.log(`Erreurs lors de l'envoie de l'embed d'arriver :`, err)}
                    }
                    
                    else if (type === 'permissions') {
                        try { welcomeChannel.send({content : `Bienvenue ${member} ! Je n'arrive pas à comprendre comment vous vous êtes inscrit car je n'ai pas l'autorisation "Gérer le serveur" !`, files: [new Discord.AttachmentBuilder(data, {name: "home.png"})]}); } catch (err) {console.log(`Erreurs lors de l'envoie de l'embed d'arriver :`, err)}
                    }
                })
            })
        })
        
        
        //roles
        let non_verifie = "false"
        let verifie = "false"
        let membres = "false"

        //Non vérifié
        if(req[0].non_verifie !== "false") { 
            non_verifie = member.guild.roles.cache.find(r => r.id === req[0].non_verifie); }
            else { return }
        
        
        //Vérifié
        if(req[0].verifie !== "false") {
            verifie = member.guild.roles.cache.find(r => r.id === req[0].verifie); }
            else { return }

        //Membres
        if(req[0].membres !== "false" && req[0].captcha !== "false") {
            membres = member.guild.roles.cache.find(r => r.id === req[0].membres); }
            else { return }
        
        if(req.length < 1) return;



        //captcha
        let EmbedNoCaptcha = new Discord.EmbedBuilder()
        .setTimestamp()
        .setColor(bot.color)
        .setDescription("Je n'ai pas trouvé le salon du captcha")


        //verification si le captcha peut-être activé ou pas
        if(req[0].antiraid === "true") return;
        if(req[0].captcha === "false") return member.roles.add(membres);


        //Attibution du rôles Non verifie
        if(req[0].non_verifie !== "false") member.roles.add(non_verifie)


        //Configuration du salon captcha avec vérification qu'il existe
        let channel = member.guild.channels.cache.get(req[0].captcha)
        if(!channel) {
            if(logs) {
                logs.send({embeds: [EmbedNoCaptcha]})
                return
            } else return
        }

        try {
            await channel.permissionOverwrites.create(non_verifie.id, {
                SendMessages: true,
                ViewChannel: true,
                ReadMessageHistory: true
            })
        } catch {}



        //génération du code pour le captcha
        let caracters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"]
        let text = [];
        for(let i = 0; i < 6; i++) text.push(caracters[Math.floor(Math.random() * caracters.length)]);
        text = text.join("");

        //création de l'embed
        const EmbedCaptcha = new Discord.EmbedBuilder()
        .setTitle("Captcha")
        .setColor("#444037")
        .setDescription("Pour accéder au reste du serveur veuillez tapez le code présent ci-dessous")
        .setTimestamp()
        .setFooter({text: `Sécrutité antibot`, iconURL: bot.user.displayAvatarURL({dynamic: true, size: 4096})})
        .setFields(
            { name: '🔐 Code :', value: `\`${text}\``, inline: true },
            { name: '⏱ Temps avant expulsion :', value: `<t:${Math.floor(Date.now() / 1000) + ms("5m") / 1000}:R>`, inline: true },
        )
        

        //envoi du message
        let msg = await channel.send({content: `**${member} Merci de suivre les informations ci-dessous pour pouvoir accéder au reste du serveur !**`, embeds: [EmbedCaptcha]/*files: [new Discord.AttachmentBuilder((await captcha.canvas).toBuffer(), {name: "captcha.png"})]*/})

        //rajout dans la db l'ID du message du captcha
        await db.query(`INSERT INTO captcha (guildID, MessageID, UserID) VALUES ('${member.guild.id}', '${msg.id}', '${member.user.id}')`)
        
        try{
        
            let filter = m => m.author.id === member.user.id;
            let response = (await channel.awaitMessages({filter, max: 1, time: 300000, errors: ["time"]})).first()

            if(response.content === text) {

                //enlever le message de la db
                await db.query(`DELETE FROM captcha WHERE MessageID = '${msg.id}'`)

                await response.delete()
                if(req[0].règlement !== "false") {
                    let msg2 = await msg.reply({content: `${member} Tu as fini de compléter le captcha tu peux maintenant aller lire le règlement juste là => <#${req[0].règlement}>`, ephemeral: true})
                    await channel.permissionOverwrites.delete(member.user.id)
                    if(req[0].verifie !== "false") await member.roles.add(verifie)
                    if(req[0].non_verifie !== "false") await member.roles.remove(non_verifie)
                    try { await msg.delete() } catch {}
                    try { await msg2.delete() } catch {}

                } else {
                    await channel.permissionOverwrites.delete(member.user.id)
                    if(req[0].verifie !== "false") await member.roles.add(verifie)
                    if(req[0].non_verifie !== "false") await member.roles.remove(non_verifie)
                    try { await msg.delete() } catch {}
                }
                 } else {
                    
                    
                    //enlever le message de la db
                    await db.query(`DELETE FROM captcha WHERE MessageID = '${msg.id}'`)
                     
                    try { await msg.delete() } catch {}
                    try { await response.delete() } catch {}
                    try{await member.user.send("Tu as échoué le captcha ! Tu peux rententer en cliquant ici => https://discord.gg/sMyfTefgYc TZJ5x3EpUM !")} catch(err) {}
                    await channel.permissionOverwrites.delete(member.user.id)

                    let reason = "Le captcha a mal été rempli !"

                    await member.kick(reason)

                    let ID = await bot.function.createId("KICK-CAPTCHA")
                         
                    await db.query(`INSERT INTO kicks (guild, user, author, ID, reason, date) VALUES ('${member.guild.id}', '${member.id}', '${bot_id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
                 }


        } catch(err) {
            
            console.log(err)

            //enlever le message de la db
            await db.query(`DELETE FROM captcha WHERE MessageID = '${msg.id}'`)

            //supprimer le message
            try{ await msg.delete() } catch {}
            try{ await member.user.send("Tu as mis trop de temps à compléter le captcha ! Tu peux rententer en cliquant ici => https://discord.gg/sMyfTefgYc TZJ5x3EpUM !")} catch(err) {}
            try{ await channel.permissionOverwrites.delete(member.user.id) } catch {}

            let reason = "Le captcha n'a pas été complété dans le temps impartie !"

            try{ await member.kick(reason) } catch {}

            let ID = await bot.function.createId("KICK-CAPTCHA")
    
            await db.query(`INSERT INTO kicks (guild, user, author, ID, reason, date) VALUES ('${member.guild.id}', '${member.id}', '${bot_id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
        }
    })
}