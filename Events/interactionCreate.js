const fs = require('fs');
const path = require('path');

const handlersDir = path.join(__dirname, 'interactionCreate');
const handlers = [];

const loadHandlers = dir => {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      loadHandlers(fullPath);
    } else if (file === 'interactionCreate.js') {
      handlers.push(require(fullPath));
    }
  }
};

if (fs.existsSync(handlersDir)) {
  loadHandlers(handlersDir);
}

module.exports = async (bot, interaction) => {
  for (const handler of handlers) {
    await handler(bot, interaction);
  }
};
