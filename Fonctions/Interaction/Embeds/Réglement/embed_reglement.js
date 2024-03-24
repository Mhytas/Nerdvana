const { EmbedBuilder } = require("discord.js")

module.exports = async (bot) => {

    const embed_reglement = new EmbedBuilder()
    .setColor(bot.color)
    .setFooter({text: "Write Heberg' » Règlements", iconURL: "https://write-heberg.fr/wp-content/uploads/elementor/thumbs/pp-discord-qfk59w6p4b6o1v6ouzwtv4qysr0sb9qs10raxhasq0.png"})
    .setDescription(`
    \`\`\`📌 — #Règlements\`\`\`

    > **» Bienvenue sur le serveur de Write Heberg' !**

    > Nous vous prions de **lire** __attentivement l’entièreté des règlements ci-dessous__ : nous considérons que **tout joueur** se connectant à nos serveurs __a pris connaissance de ces dit règlements__ et **accepte** d’être sanctionné si celui-ci enfreint une quelconque règle. Nous nous gardons le droit de **modifier** les règlements à tout moment. C’est pour cela que vous devez constamment vous tenir informé de ceux-ci :

    ・[Règlement 1](https://write-heberg.fr)
    ・[Règlement 2](https://write-heberg.fr)
    ・[Règlement 3](https://write-heberg.fr)

    \`\`\`- ⛔ Attention, le non-respect des règles entraînera des sanctions. Veuillez respecter les règles de conduite énoncées dans la charte d'utilisation.\`\`\`
    `)
    return embed_reglement;
}