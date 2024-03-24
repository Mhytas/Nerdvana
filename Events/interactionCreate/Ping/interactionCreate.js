const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

    let db = bot.db;

    //ping
    if(interaction.isButton()) {
        if(interaction.customId === "ping") {

            let reloadPing = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("ping")
                    .setEmoji("🔄")
                    .setLabel("Actualiser")
                    .setStyle(Discord.ButtonStyle.Success)
            )
            /*const pingUser = interaction.createdTimestamp - Date.now();
                let emojiUser;
                if(pingUser < 200) { emojiUser = "🟢" } 
                else if (pingUser < 400 && pingUser > 200) { emojiUser = "🟠" }
                else if(pingUser > 400) {emojiUser = "🔴" };
            
                // Ping de l'API de discord*/
            	let APIPing = bot.ws.ping
                let APIemoji;
                if(APIPing < 200) { APIemoji = "🟢" }
                else if(APIPing < 400 && APIPing > 200) { APIemoji = "🟠" }
                else if(APIPing > 400) {APIemoji = "🔴" }
    
            let PingEmbed = new Discord.EmbedBuilder()
                .setDescription(`\`${APIemoji}\` Pong ! | Ping de l'API : **${APIPing}ms**`)
                .setColor(bot.color)
                //\`${emojiUser}\` Pong ! | Votre ping : **${pingUser}ms**\n
    
            await interaction.deferUpdate()
            await interaction.editReply({embeds: [PingEmbed], components: [reloadPing]})
        }
    }
}
