const fs = require('fs');
const path = require('path');
module.exports = (bot) => {
  const eventsDir = path.join(__dirname, '..', 'Event');
  const disabledFolderName = 'Désactivés'; // Nom du dossier à ignorer
  const handlers = {};

  const loadEventFiles = (dir, parentFolderName = '') => {
    const eventFiles = fs.readdirSync(dir);

    for (const file of eventFiles) {
      const filePath = path.join(dir, file);
      const stat = fs.lstatSync(filePath);
      if (stat.isDirectory()) {
        // Vérifie si le dossier est "Désactivés", si c'est le cas, passe à l'itération suivante
        if (file === disabledFolderName) continue;

        const folderName = path.basename(filePath);
        const newParentFolderName = parentFolderName
          ? path.join(parentFolderName, folderName)
          : folderName;

        loadEventFiles(filePath, newParentFolderName); // Appel récursif pour charger les fichiers dans les sous-dossiers
      } else if (file.endsWith('.js')) {
        const event = require(filePath);
        const eventName = file.split('.')[0];

        if (!handlers[eventName]) handlers[eventName] = [];
        handlers[eventName].push(event);

        const eventFolderName = parentFolderName || `Events`;
        console.log(`L'événement ${eventName} du dossier ${eventFolderName} a été chargé avec succès !`);
      }
    }
  };

  loadEventFiles(eventsDir);

  for (const [eventName, events] of Object.entries(handlers)) {
    bot.on(eventName, (...args) => {
      for (const evt of events) {
        evt(bot, ...args);
      }
    });
  }
};