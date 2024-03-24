module.exports = async bot => {
    await bot.application.commands.set(Array.from(bot.commands.values()))
    console.log("Les slashs commandes ont été créées avec succès !")
};