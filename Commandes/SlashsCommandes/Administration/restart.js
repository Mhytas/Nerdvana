const { PermissionFlagsBits } = require("discord.js")
const config = require('../../../config');
    
module.exports = {
  
    name: "restart",
    description: "Restart le bot en cas de crash (n'applique pas les nouvelles modifications de code)",
    utilisation: "/restart",
    type: 1,
    permission: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    dm: false,
    category: "Administration",
    options: [],
    
    async run(bot, message, args, db) {

        await bot.user.setActivity("Entrain de redémarrer 🔄"/*, {type: Discord.ActivityType["Playing"]}*/)
        await message.reply({content: "Le bot a bien été restart !", ephemeral: true})
        console.log('Le bot a bien été restart');
        await bot.destroy();

    // Relancez le bot après une courte pause
    setTimeout(() => {
        bot.login(config.token)
    }, 2000); // 2000 millisecondes (2 secondes) de pause avant de relancer le bot
    }
}