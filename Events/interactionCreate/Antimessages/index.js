const Discord = require("discord.js")
let salonantimessages = ["1078716490603298828", "1078720212406386768"];
let visiteurs = "1100827523899727953";

module.exports = async (bot, interaction) => {

    let db = bot.db;

    //AntiMessages
    if(interaction.isButton()) {
        //Désactivé
        if(interaction.customId === "non-antimessages") {

            //changé permission du rôle visiteurs
            try {
                // Supprimer la permission d'envoi de messages pour le rôle spécifié dans tous les canaux du serveur
                bot.guilds.cache.forEach((guild) => {
                guild.roles.cache.forEach((role) => {
                    if (role.id === visiteurs) {
                    guild.channels.cache.forEach(async (channel) => {
                        if(!salonantimessages.includes(channel.id)) return
                        if(channel.type !== Discord.ChannelType.GuildText && channel.type !== Discord.ChannelType.GuildVoice) return
                        const permissions = channel.permissionsFor(role);
                    
                        // Vérifier si le rôle a déjà la permission d'envoi de messages
                        if (permissions.missing('SendMessages')) {
                        channel.permissionOverwrites.create(role, { SendMessages: true })
                            .then(() => console.log(`Permission d'envoi de messages activé pour le rôle ${role.name} dans le canal ${channel.name}`))
                            .catch(console.error);
                        }
                    });
                }
                });
            });
        } catch (error) { console.error(`Une erreur s'est produite :`, error) }

            db.query(`UPDATE server SET antimessages = 'false' WHERE server.guild = '${interaction.guild.id}'`)
            await interaction.deferUpdate()
            await interaction.editReply({content: "L'antimessages a bien été désactivé !", ephemeral: true})
        }


        //Activé
        if(interaction.customId === "oui-antimessages") {
            
            //changé permission du rôle visiteurs
            try {
                // Supprimer la permission d'envoi de messages pour le rôle spécifié dans tous les canaux du serveur
                bot.guilds.cache.forEach((guild) => {
                guild.roles.cache.forEach((role) => {
                    if (role.id === visiteurs) {
                    guild.channels.cache.forEach(async (channel) => {
                        if(!salonantimessages.includes(channel.id)) return
                        if(channel.type !== Discord.ChannelType.GuildText && channel.type !== Discord.ChannelType.GuildVoice) return
                        const permissions = channel.permissionsFor(role);
                    
                        // Vérifier si le rôle a déjà la permission d'envoi de messages
                        if (permissions.has('SendMessages')) {
                        channel.permissionOverwrites.create(role, { SendMessages: false })
                            .then(() => console.log(`Permission d'envoi de messages supprimée pour le rôle ${role.name} dans le canal ${channel.name}`))
                            .catch(console.error);
                        }
                    });
                }
                });
            });
        } catch (error) { console.error(`Une erreur s'est produite :`, error) }

            db.query(`UPDATE server SET antimessages = 'true' WHERE server.guild = '${interaction.guild.id}'`)
            await interaction.deferUpdate()
            await interaction.editReply({content: "L'antimessages a bien été activé !", ephemeral: true})
        }
    }
}
