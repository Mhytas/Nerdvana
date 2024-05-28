module.exports = async(bot, member) => {

    //Supprimer le membre quand il part
    await bot.db.query(`DELETE FROM user WHERE id = '${member.guild.id}_${member.id}'`)
}