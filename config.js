require('dotenv').config();
module.exports = {
    token: process.env.TOKEN,
    
    //couleur sondage
    DANGER: "#ff0909",
    SUCCESS: "#00ff60",
    DEFAULT: "#2f3136",

    dev: process.env.DEV,
}