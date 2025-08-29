const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
  const eventsDir = path.join(__dirname, '..', 'Events');
  const disabledFolderName = 'Désactivés'; // Nom du dossier à ignorer

  // Collectionne les gestionnaires d'événements par nom
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
        console.log(
          `L'événement ${eventName} du dossier ${eventFolderName} a été chargé avec succès !`
        );
      }
    }
  };

  loadEventFiles(eventsDir);

  // Ajoute un seul listener par événement et exécute tous les gestionnaires associés
  for (const [eventName, eventHandlers] of Object.entries(handlers)) {
    bot.on(eventName, (...args) => {
      for (const handler of eventHandlers) {
        handler(bot, ...args);
      }
    });
  }
};