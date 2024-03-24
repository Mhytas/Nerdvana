const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

    let db = bot.db;

    //AntiRaid
    if(interaction.isButton()) {
        //Désactivé
        if(interaction.customId === "non-antiraid") {

            db.query(`UPDATE server SET antiraid = 'false' WHERE server.guild = '${interaction.guild.id}'`)
            await interaction.deferUpdate()
            await interaction.editReply({content: "L'antiraid a bien été désactivé !", ephemeral: true})
        }

        //Activé
        if(interaction.customId === "oui-antiraid") {

            db.query(`UPDATE server SET antiraid = 'true' WHERE server.guild = '${interaction.guild.id}'`)
            await interaction.deferUpdate()
            await interaction.editReply({content: "L'antiraid a bien été activé !", ephemeral: true})
        }
    }
}
