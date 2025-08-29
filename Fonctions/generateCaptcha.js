const Canvas = require("canvas");

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

module.exports = () => {
    let text = "";
    for (let i = 0; i < 6; i++) {
        text += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    }

    const canvas = Canvas.createCanvas(300, 150);
    const ctx = canvas.getContext("2d");

    ctx.font = '45px "Arial"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(text, (150 - ctx.measureText(text).width / 2), 85);

    return { canvas, text };
};
