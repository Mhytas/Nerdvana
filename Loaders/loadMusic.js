const fs = require("fs")

module.exports = async bot => {

    fs.readdirSync("./Music").filter(f => f.endsWith(".js")).forEach(async file => {

        let event = require (`../Music/${file}`)
        bot.palyer.on(file.split(".js").join(""), event.bind(null, bot))
    })
    console.log(`L'évènement ${file} a été chargé avec succès !`)
}