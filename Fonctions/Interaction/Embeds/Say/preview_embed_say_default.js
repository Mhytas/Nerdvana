const { EmbedBuilder } = require("discord.js")

module.exports = async (bot) => {

    const preview_embed_say_default = new EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({
        name: `${bot.user.username} - Say - Message`,
        iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`,
    })
    .setDescription(`Pour configurer l'embed vous devez cliquez sur le select menu, il vous proposera 3 choix permettant d'accéder à 3 pages différentes :

### __Page 1 :__
- Contenu
- Description
- Titre
- URL du titre
- Couleur

### __Page 2 :__
- Nom de l'auteur
- Image de l'auteur
- URL de l'auteur
- Nom du footer
- Image du footer

### __Page 3 :__
- Image
- Thumbnail



Chaque page aura les boutons suivant
### __Envoyer :__
Pour pouvoir envoyer le message

### __Fields :__
Pour pouvoir configurer les fields

### __Informations :__
pour pouvoir revoir ce message`)
    .setTimestamp()
    .setFooter({text: "Say"})

    return preview_embed_say_default;
}