const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = {

    name: "aide",
    name_localizations:({
        'fr': 'aide',
        'en-US': 'help',
        'en-GB': 'help',
    }),
    description: "Envoie les commandes du bot",
    description_localizations:({
        'fr': 'Envoie les commandes du bot',
        'en-US': 'Sends bot commands',
        'en-GB': 'Sends bot commands',
    }),
    type: 1,
    permission: "Aucune",
    dm: false,
    utilisation: "/aide",
    category: "Informations",
    ownerOnly: false,

    async run(bot, message, args, db) {

            let categories = []
            bot.commands.forEach(command => {
                if(!categories.includes(command.category)) categories.push(command.category)
            })

            let Embed = new EmbedBuilder()
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
            const selectMenuCommandes = new StringSelectMenuBuilder()
                .setCustomId("commande_select")
                .setPlaceholder("Sélectionnez une commande");

            let commands = bot.commands
                .filter(cmd => cmd.type === 1)
                .sort((a, b) => a.name.localeCompare(b.name))

            const fieldValues = commands.map(cmd => `\`${cmd.utilisation}\` : ${cmd.description}`);
            if (fieldValues.length > 0) {
                const options = commands.map(command => ({
                    label: `/${command.name}`,
                    description: command.description,
                    value: command.name,
                }));
                selectMenuCommandes.addOptions(options);
            }

            // Ajouter les commandes user en dessous de l'embed
            const selectMenuUser = new StringSelectMenuBuilder()
            .setCustomId("user_select")
            .setPlaceholder("Sélectionnez une application d'utilisateur")

            let commands_user = bot.commands
            .filter(cmd => cmd.type === 2)
            .sort((a, b) => a.name.localeCompare(b.name))

            const fieldValuesUser = commands_user.map(cmd => `\`${cmd.utilisation}\` : ${cmd.description}`);
            if (fieldValuesUser.length > 0) {
                const options = commands_user.map(command => ({
                    label: command.name,
                    description: command.description,
                    value: command.name,
                }));
                selectMenuUser.addOptions(options);
            }

            /*// Ajouter les commandes d'application de message en dessous de l'embed
            const selectMenuMessage = new StringSelectMenuBuilder()
            .setCustomId("message_select")
            .setPlaceholder("Sélectionnez une application de message")

            let commands_message = bot.commands
            .filter(cmd => cmd.type === 3)
            .sort((a, b) => a.name.localeCompare(b.name))

            const fieldValuesMessage = commands_message.map(cmd => `\`${cmd.utilisation}\` : ${cmd.description}`);
            if (fieldValuesMessage.length > 0) {
                const options = commands_message.map(command => ({
                    label: command.name,
                    description: command.description,
                    value: command.name,
                }));
                selectMenuMessage.addOptions(options);
            }*/

            const actionRow = new ActionRowBuilder()
            .addComponents(selectMenuCommandes)

            const actionRow2 = new ActionRowBuilder()
            .addComponents(selectMenuUser)

            /*const actionRow3 = new ActionRowBuilder()
            .addComponents(selectMenuMessage)*/

            await message.reply({ embeds: [Embed], components: [actionRow, actionRow2/*, actionRow3*/], ephemeral: true });
    }
}