const Discord = require("discord.js")

module.exports = async (bot, interaction) => {
    let db = bot.db
    await db.query(`SELECT * FROM server WHERE guild = '${interaction.guild.id}'`, async (err, req) => {
        let langue = req[0].langue

        if(interaction.customId === "selectmenu_config") {
            let systeme = interaction.values[0];
            if(systeme === "🗣 Langue du bot") {
                const langue_bot_config = await bot.function.langue_bot_config(bot, systeme, langue);
                const selectmenu_config = await bot.function.selectmenu_config(systeme);
                const boutons_langue_bot = await bot.function.boutons_langue_bot(langue);
                
                await interaction.deferUpdate()
                await interaction.editReply({embeds: [langue_bot_config],  components: [selectmenu_config, boutons_langue_bot], ephemeral: true})
            }
        }

        if(interaction.customId === "bouton_say_fr" || interaction.customId === "bouton_say_en") {
            let langue = "fr"
            let systeme = "🗣 Langue du bot"

            if(interaction.customId === "bouton_say_fr") langue = "fr"
            if(interaction.customId === "bouton_say_en") langue = "en"
            await db.query(`UPDATE server SET langue = '${langue}' WHERE guild = '${interaction.guild.id}'`)


            const langue_bot_config = await bot.function.langue_bot_config(bot, systeme, langue);
            const selectmenu_config = await bot.function.selectmenu_config(systeme);
            const boutons_langue_bot = await bot.function.boutons_langue_bot(langue);

            await interaction.deferUpdate()
            await interaction.editReply({embeds: [langue_bot_config],  components: [selectmenu_config, boutons_langue_bot], ephemeral: true})
        }
    })
}
