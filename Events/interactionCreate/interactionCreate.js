const fs = require('fs');
const path = require('path');

const handlers = [];
const baseDir = __dirname;

const loadHandlers = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadHandlers(fullPath);
    } else if (entry.name === 'index.js') {
      handlers.push(require(fullPath));
    }
  }
};

loadHandlers(baseDir);

module.exports = async (bot, interaction) => {
  for (const handler of handlers) {
    await handler(bot, interaction);
  }
};
