const fs = require('fs');
const path = require('path');

const handlers = [];

const baseDir = path.join(__dirname, 'interactionCreate');

if (fs.existsSync(baseDir)) {
  for (const dir of fs.readdirSync(baseDir)) {
    const handlerPath = path.join(baseDir, dir, 'index.js');
    if (fs.existsSync(handlerPath)) {
      handlers.push(require(handlerPath));
    }
  }
}

module.exports = async (bot, interaction) => {
  for (const handler of handlers) {
    await handler(bot, interaction);
  }
};
