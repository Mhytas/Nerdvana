require('dotenv').config();
module.exports = {
    token: process.env.TOKEN,

    //Variable utile à la commande sondage
    //couleur sondage
    DANGER: "#ff0909",
    SUCCESS: "#00ff60",
    DEFAULT: "#2f3136",

    //Je sais plus à quoi il sert 😂 mais bon dans le doute je laisse : ok
    dev: process.env.DEV,
}