const Discord = require('discord.js')
const { ApplicationCommandOptionType } = require("discord.js")

module.exports = {

    name: "ping",
    description: "Obtenez le ping du bot",
    type: 1,
    utilisation: "/ping",
    permission: "Aucune",
    ownerOnly: false,
    dm: true,
    category: "Informations",
    /*options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "ping1",
            description: "Le premier ping"
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "ping2",
            description: "Le deuxième ping"
        },
    ],*/

    async run(bot, message, args, db) {

        /*const subCommand = args.getSubcommand(); // Obtenez le nom de la sous-commande à partir des arguments

        switch (subCommand) {
            case 'ping1':*/
                let reloadPing = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("ping")
                        .setEmoji("🔄")
                        .setLabel("Actualiser")
                        .setStyle(Discord.ButtonStyle.Success)
                )
     
            // Ping de l'API de discord
            let APIPing = bot.ws.ping
            let APIemoji;
            if(APIPing <= 200) { APIemoji = "🟢" }
            else if(APIPing <= 400 && APIPing >= 200) { APIemoji = "🟠" }
            else if(APIPing >= 400) {APIemoji = "🔴" }
     
            let PingEmbed = new Discord.EmbedBuilder()
                .setDescription(`\`${APIemoji}\` Pong ! | Ping de l'API : **${APIPing}ms**`)
                .setColor(bot.color)
                                
            await message.reply({embeds: [PingEmbed], components: [reloadPing], ephemeral: true})
            /*break;
            case 'ping2':
                message.reply({content: "ping 2", ephemeral: true})
            break;
            default:
                message.reply({content: "Une erreur est survenu, merci de contacter un membre du staff pour faire remonter l'erreur", ephemeral: true})
            break;
        }*/
    }
}