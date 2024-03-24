const Discord = require("discord.js")

module.exports = {

    name: "aide",
    description: "Envoie les commandes du bot",
    type: 1,
    utilisation: "/aide",
    permission: "Aucune",
    ownerOnly: false,
    dm: true,
    category: "Informations",

    async run(bot, message, args, db) {

            let categories = []
            bot.commands.forEach(command => {
                if(!categories.includes(command.category)) categories.push(command.category)                
            })

            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Commandes du bot`)
            .setFooter({text: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL({dynamic: true})})
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

            //Ajouter les commandes slash dans le selectmenu
            const selectMenuCommandes = new Discord.StringSelectMenuBuilder()
                .setCustomId("commande_select")
                .setPlaceholder("Sélectionnez une commande");

                for (const cat of categories.sort()) {
                    let commands = bot.commands.filter(cmd => cmd.category === cat && cmd.type === 1);
                    const fieldValues = commands.map(cmd => `\`${cmd.utilisation}\` : ${cmd.description}`);
                    if (fieldValues.length > 0) {
                        const options = commands.map(command => ({
                            label: `/${command.name}`,
                            description: command.description,
                            value: command.name,
                        }));
                        selectMenuCommandes.addOptions(options);
                    }
                }

            // Ajouter les commandes user en dessous de l'embed
            const selectMenuUser = new Discord.StringSelectMenuBuilder()
            .setCustomId("user_select")
            .setPlaceholder("Sélectionnez une application d'utilisateur")
            .addOptions
            (
                {
                label: "Profil",
                value: "Profil",
                }/*,
                {
                label: "2",
                value: "2",
                },
                {
                label: "3",
                value: "3",
                },
                {
                label: "4",
                value: "4",
                },
                {
                label: "5",
                value: "5",
                }*/
            )

            /*// Ajouter les commandes d'application de message en dessous de l'embed
            const selectMenuMessage = new Discord.StringSelectMenuBuilder()
            .setCustomId("message_select")
            .setPlaceholder("Sélectionnez une application de message")
            .addOptions
            (
                {
                label: "1",
                value: "1",
                },
                {
                label: "2",
                value: "2",
                },
                {
                label: "3",
                value: "3",
                },
                {
                label: "4",
                value: "4",
                },
                {
                label: "5",
                value: "5",
                }
            )*/


            const actionRow = new Discord.ActionRowBuilder()
            .addComponents(selectMenuCommandes)

            const actionRow2 = new Discord.ActionRowBuilder()
            .addComponents(selectMenuUser)

            /*const actionRow3 = new Discord.ActionRowBuilder()
            .addComponents(selectMenuMessage)*/

            await message.reply({ embeds: [Embed], components: [actionRow, actionRow2/*, actionRow3*/], ephemeral: true });
    }
}