const Discord = require("discord.js")
const ownerId = ['408675475313917963'];

module.exports = async (bot, interaction) => {

    let db = bot.db;
    let id = interaction.targetId
    
    if(interaction.type === Discord.InteractionType.ApplicationCommand) {

        const command = bot.commands.get(interaction.commandName);
        if(command.ownerOnly && !ownerId.includes(interaction.user.id)) return interaction.reply({content: ":x: Seul <@408675475313917963> peut utiliser cette commande !", ephemeral: true});
        command.run(bot, interaction, interaction.options, db, id);
    }

}