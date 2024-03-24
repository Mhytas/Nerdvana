const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

    let db = bot.db;

    //bouton menu /aide
    if(interaction.isButton()) {
        if(interaction.customId === "menu") {
            let categories = []
            bot.commands.forEach(command => {
                if(!categories.includes(command.category)) categories.push(command.category)                
            })
            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Commandes du bot`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setDescription(`Commandes disponibles : \`${bot.commands.size}\`\n Catégories disponibles : \`${categories.length}\``)
            .setTimestamp()

            //ajouter les commandes slash dans l'embed
            for (const cat of categories.sort()) {
                let commands = bot.commands.filter(cmd => cmd.category === cat && cmd.type === 1);
                const fieldValues = commands.map(cmd => `\`${cmd.utilisation}\` : ${cmd.description}`);
                if (fieldValues.length > 0) {
                    Embed.addFields({ name: `${cat}`, value: `${fieldValues.join("\n")}` });
                }
            }

            //ajouter les application user dans l'embed
            let commands_uers = bot.commands.filter(cmd => cmd.type === 2);
            const fieldValues_user = commands_uers.map(cmd => `\`${cmd.utilisation}\``);
            if (fieldValues_user.length > 0) {
                Embed.addFields({ name: `Application utilisateur`, value: `${fieldValues_user.join("\n")}` });
            }

            /*//ajouter les application message dans l'embed
            let commands_message = bot.commands.filter(cmd => cmd.type === 3);
            const fieldValues_message = commands_message.map(cmd => `\`${cmd.utilisation}\``);
            if (fieldValues_message.length > 0) {
                Embed.addFields({ name: `Application utilisateur`, value: `${fieldValues_message.join("\n")}` });
            }*/

            await interaction.deferUpdate()
            await interaction.editReply({ embeds: [Embed], components: [interaction.message.components[0], interaction.message.components[1]]});
        }
    }

    
    //select menu commandes /aide
    if(interaction.customId === "commande_select") {
        const selectedCommand = interaction.values[0];
        command = bot.commands.get(selectedCommand);

            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Commande ${command.name}`)
            .setFooter({text: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL({dynamic: true})})
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFields(
                { name: "Nom", value: `\`${command.name}\``, inline: true },
                { name: "Description", value: `\`${command.description}\``, inline: true },
                { name: "Permission requise", value: `\`${typeof command.permission !== "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\``, inline: true },
                { name: "alex_write uniquement", value: `\`${command.ownerOnly ? "Oui" : "Non"}\``, inline: true },
                { name: "Commande en DM", value: `\`${command.dm ? "Oui" : "Non"}\``, inline: true },
                { name: "Catégorie", value: `\`${command.category}\``, inline: true }
              );

            // Ajouter les options de commande dans la description
            const EmbedselectedCommand = bot.commands.find(cmd => cmd.name === selectedCommand);
            if (EmbedselectedCommand) {
                if (EmbedselectedCommand.options) {
                    const commandOptions = EmbedselectedCommand.options.map(option => `\`${option.name}\` : ${option.description}`);
                    const value = commandOptions.join("\n");
                    Embed.addFields({
                        name: "Options de commande ",
                        value: value,
                        inline: true
                    });
                } else {
                    Embed.addFields({
                        name: "Options de commande ",
                        value: "Cette options n'a pas de commande",
                        inline: true
                    });
                }
            }
              

            let Menu = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("menu")
                    .setEmoji("🏠")
                    .setLabel("Menu")
                    .setStyle(Discord.ButtonStyle.Success)
            )

            await interaction.deferUpdate()
            await interaction.editReply({ embeds: [Embed], components: [interaction.message.components[0], interaction.message.components[1], Menu]});
    }


    //select menu application /aide
    if(interaction.customId === "user_select" || interaction.customId === "message_select") {

        const selectedCommand = interaction.values[0];
        command = bot.commands.get(selectedCommand);
    
            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Commande ${command.name}`)
            .setFooter({text: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL({dynamic: true})})
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFields(
                { name: "Nom", value: `\`${command.name}\``, inline: true },
                { name: "Permission requise", value: `\`${typeof command.permission !== "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\``, inline: true },
                { name: "alex_write uniquement", value: `\`${command.ownerOnly ? "Oui" : "Non"}\``, inline: true },
                { name: "Commande en DM", value: `\`${command.dm ? "Oui" : "Non"}\``, inline: true },
                { name: "Catégorie", value: `\`${command.category}\``, inline: true }
              );
              
              
    
            let Menu = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("menu")
                    .setEmoji("🏠")
                    .setLabel("Menu")
                    .setStyle(Discord.ButtonStyle.Success)
            )
    
            await interaction.deferUpdate()
            await interaction.editReply({ embeds: [Embed], components: [interaction.message.components[0], interaction.message.components[1], Menu]});
        }
}
