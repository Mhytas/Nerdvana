const Discord = require("discord.js")
const Canvas = require("canvas")

module.exports = async () => {

    let caracters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"]
    let text = [];
    for(let i = 0; i < 6; i++) text.push(caracters[Math.floor(Math.random() * caracters.length)]);
    text = text.join("");

    const canvas = Canvas.createCanvas(300, 150)
    const ctx = canvas.getContext("2d")

    ctx.font = '45px "Arial"'
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(text, (150 - (ctx.measureText(text).width) / 2), 85)

    return{canvas: canvas, text: text}
}