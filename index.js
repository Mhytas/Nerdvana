require('dotenv').config();
const Discord = require ("discord.js")
const Player = require("discord-player")
const loadCommands = require("./Loaders/loadCommands")
const loadEvents = require("./Loaders/loadEvents")
//const { EmbedBuilder } = require("discord.js")
const i18n = require('i18n');

i18n.configure({
  locales: ['fr', 'en'], 
  directory: __dirname + '/locales', 
  defaultLocale: 'fr', 
  objectNotation: true, 
  updateFiles: true,
});


const bot = new Discord.Client({
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.Reaction,
        Discord.Partials.GuildMember,
        Discord.Partials.GuildScheduledEvent,
        Discord.Partials.ThreadMember,
        Discord.Partials.User
    ], intents: [
        Discord.GatewayIntentBits.AutoModerationConfiguration,
        Discord.GatewayIntentBits.AutoModerationExecution,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildScheduledEvents,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.MessageContent,
    ]
});

bot.player = new Player.Player(bot, {
    leaveOnEnd: true,
    leaveOnEmpty: true,
    initialVolume: 100,
    ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});

bot.commands = new Discord.Collection()
bot.color = "#58baff";
bot.function = {
  //Interaction
  //Boutons
  //Say
  boutons_say: require("./Fonctions/Interaction/Boutons/Say/boutons_say"),
  //Langue
  boutons_langue_bot: require("./Fonctions/Interaction/Boutons/Langue bot/boutons_langue_bot"),
  //Rôles réaction
  boutons_nouveau_rôles_réactions: require("./Fonctions/Interaction/Boutons/Rôles réactions/boutons_nouveau_rôles_réactions"),
  boutons_rôles_réactions: require("./Fonctions/Interaction/Boutons/Rôles réactions/boutons_rôles"),
  boutons_config_rôles_réactions_gérer: require("./Fonctions/Interaction/Boutons/Rôles réactions/boutons_config_rôles_réactions_gérer"),
  boutons_config_rôles_réactions: require("./Fonctions/Interaction/Boutons/Rôles réactions/boutons_config_rôles_réactions"),
  //Réglement
  bouton_reglement: require("./Fonctions/Interaction/Boutons/Réglement/bouton_reglement"),



  //Embeds
  //Config
  acceuil_config: require("./Fonctions/Interaction/Embeds/Acceuil/acceuil_config"),
  //Réglement
  embed_reglement: require("./Fonctions/Interaction/Embeds/Réglement/embed_reglement"),
  embed_reglement_message_attribué: require("./Fonctions/Interaction/Embeds/Réglement/embed_reglement_message_attribué"),
  embed_reglement_message_erreur1: require("./Fonctions/Interaction/Embeds/Réglement/embed_reglement_message_erreur1"),
  embed_reglement_message_erreur2: require("./Fonctions/Interaction/Embeds/Réglement/embed_reglement_message_erreur2"),
  embed_reglement_message_retirer: require("./Fonctions/Interaction/Embeds/Réglement/embed_reglement_message_retirer"),
  //Rôles réaction
  embed_role_reaction_message_fin_attribué: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_message_fin_attribué"),
  embed_role_reaction_message_fin_erreur1: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_message_fin_erreur1"),
  embed_role_reaction_message_fin_erreur2: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_message_fin_erreur2"),
  embed_role_reaction_message_fin_erreur3: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_message_fin_erreur3"),
  embed_role_reaction_message_fin_retirer: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_message_fin_retirer"),
  embed_rôles_reactions_config_existe_déjà: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_rôles_reactions_config_existe_déjà"),
  embed_rôles_réactions_rôles_erreur: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_rôles_réactions_rôles_erreur"),
  embed_rôles_message_supprimer_existe_pas: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_say_existe_pas"),
  embed_rôles_message_supprimer: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_rôles_message_supprimer"),
  embed_role_reaction_message_supprime: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_message_supprime"),
  embed_role_reaction_message_supprime2: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_message_supprime2"),
  embed_role_reaction_say_existe_pas: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_say_existe_pas"),
  embed_rôles_réaction_config: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_rôles_réaction_config"),
  embed_rôles_réaction_gérer: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_rôles_réaction_gérer"),
  embed_role_reaction_pas_lien: require("./Fonctions/Interaction/Embeds/Rôles réactions/embed_role_reaction_pas_lien"),
  //Langue
  langue_bot_config: require("./Fonctions/Interaction/Embeds/Langue bot/langue_bot_config"),
  //Ticket
  embed_config_ticket_erreur_message: require("./Fonctions/Interaction/Embeds/Tickets/embed_config_ticket_erreur_message"),
  embed_config_ticket: require("./Fonctions/Interaction/Embeds/Tickets/embed_config_ticket"),
  embed_ouverture_ticket: require("./Fonctions/Interaction/Embeds/Tickets/embed_ouverture_ticket"),
  reset_ticket: require("./Fonctions/Interaction/Embeds/Tickets/reset_ticket"),
  //Say
  embed_say_modifier_no_url: require("./Fonctions/Interaction/Embeds/Say/embed_say_modifier_no_url"),
  embed_say_fields: require("./Fonctions/Interaction/Embeds/Say/embed_say_fields"),
  embed_say_files_trop_lourd: require("./Fonctions/Interaction/Embeds/Say/embed_say_files_trop_lourd"),
  embed_say_say_2000: require("./Fonctions/Interaction/Embeds/Say/embed_say_say_2000"),
  embed_say_not_message: require("./Fonctions/Interaction/Embeds/Say/embed_say_not_message"),
  embed_say_option_embed_invalid: require("./Fonctions/Interaction/Embeds/Say/embed_say_option_embed_invalid"),
  embed_say_réussi: require("./Fonctions/Interaction/Embeds/Say/embed_say_réussi"),
  embed_say_rien: require("./Fonctions/Interaction/Embeds/Say/embed_say_rien"),
  embed_say_salon_réussi: require("./Fonctions/Interaction/Embeds/Say/embed_say_salon_réussi"),
  embed_say_salon: require("./Fonctions/Interaction/Embeds/Say/embed_say_salon"),
  preview_embed_say_default: require("./Fonctions/Interaction/Embeds/Say/preview_embed_say_default"),
  

  //Modal
  modal: require("./Fonctions/Interaction/Modal/modal"),
  
  //SelectMenu
  //Config
  selectmenu_config: require("./Fonctions/Interaction/SelectMenu/Config/selectmenu_config"),
  //Rôles
  selectmenu_rôles_réaction: require("./Fonctions/Interaction/SelectMenu/Rôles/selectmenu_rôles_réaction"),
  selectmenu_config_rôle_rôles_réaction: require("./Fonctions/Interaction/SelectMenu/Rôles/selectmenu_config_rôle_rôles_réaction"),
  selectmenu_nouveau_rôles_réaction: require("./Fonctions/Interaction/SelectMenu/Rôles/selectmenu_nouveau_rôles_réaction"),
  selectmenu_config_rôles_réaction: require("./Fonctions/Interaction/SelectMenu/Rôles/selectmenu_config_rôles_réaction"),
  //Say
  selectmenu_say_fields: require("./Fonctions/Interaction/SelectMenu/Say/selectmenu_say_fields"),
  selectmenu_say_options: require("./Fonctions/Interaction/SelectMenu/Say/selectmenu_say_options"),
  selectmenu_say_channel: require("./Fonctions/Interaction/SelectMenu/Say/selectmenu_say_channel"),

  
  //Autres
  createId: require("./Fonctions/createId"),
  generateCaptcha: require("./Fonctions/generateCaptcha"),
  searchSpam: require("./Fonctions/searchSpam"),
  insertDatabase: require("./Fonctions/insertDatabase"),
}
bot.login(process.env.TOKEN)
loadCommands(bot, process.cwd() + '/Commandes');
loadEvents(bot)

/*
// Système de Logs
// Logs lorsque le bot a une erreur
bot.on('error', error => {console.log(error.message)})

// Logs lorsque le bot est déconnecté
bot.on('disconnect', event => {console.log("Bot déconnecté")})

// Logs lorsque le bot tente de se reconnecter
bot.on('reconnecting', () => {console.log("Tentative de reconnexion en cours...")})

// Fonction pour envoyer les logs dans le salon spécifié
function sendLogEmbed(embed) {
  const channelId = '1078720122270781500';
  const channel = bot.channels.cache.get(channelId);
    channel.send(embed)}

// Exemple pour l'événement 'channelCreate'
bot.on('channelCreate', channel => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Nouveau salon')
    .setFields(
      { name: 'Nom du salon', value: channel.name },
      { name: 'Description', value: channel.topic },
      { name: 'ID du salon', value: channel.id }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'channelUpdate'
bot.on('channelUpdate', (oldChannel, newChannel) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Mise à jour de salon')
    .setDescription(`Le salon ${oldChannel.name} a été mis à jour.`)
    .setFields(
      { name: 'Nouveau nom', value: newChannel.name },
      { name: 'Description', value: newChannel.topic },
      { name: 'Nouvelle position', value: newChannel.rawPosition.toString() }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'channelDelete'
bot.on('channelDelete', channel => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Suppression de salon')
    .setFields(
      { name: 'Nom du salon', value: channel.name },
      { name: 'ID du salon', value: channel.id }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildBanAdd'
bot.on('guildBanAdd', (guild, user) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Membre banni')
    .setFields(
      { name: 'Membre', value: user.username },
      { name: 'ID du membre', value: user.id }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildBanRemove'
bot.on('guildBanRemove', (guild, user) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Bannissement levé')
    .setFields(
      { name: 'Membre', value: user.username },
      { name: 'ID du membre', value: user.id }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildRoleCreate'
bot.on('guildRoleCreate', role => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Nouveau rôle')
    .setFields(
      { name: 'Nom du rôle', value: role.name },
      { name: 'ID du rôle', value: role.id }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildRoleDelete'
bot.on('guildRoleDelete', role => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Suppression de rôle')
    .setFields(
      { name: 'Nom du rôle', value: role.name },
      { name: 'ID du rôle', value: role.id }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildRoleUpdate'
bot.on('guildRoleUpdate', (oldRole, newRole) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Mise à jour de rôle')
    .setDescription(`Le rôle ${oldRole.name} a été mis à jour.`)
    .setFields(
      { name: 'Nouveau nom', value: newRole.name },
      { name: 'Nouvelle couleur', value: newRole.hexColor }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildUpdate'
bot.on('guildUpdate', (oldGuild, newGuild) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Mise à jour de serveur')
    .setFields(
      { name: 'Ancien nom', value: oldGuild.name },
      { name: 'Nouveau nom', value: newGuild.name }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'messageDelete'
bot.on('messageDelete', message => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Message supprimé')
    .setFields(
      { name: 'Auteur', value: message.author.username },
      { name: 'Contenu', value: message.content }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'messageDeleteBulk'
bot.on('messageDeleteBulk', messages => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Messages supprimés en masse')
    .setFields(
      { name: 'Nombre de messages supprimés', value: messages.size.toString() }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'messageUpdate'
bot.on('messageUpdate', (oldMessage, newMessage) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Message modifié')
    .setDescription(`Le message de ${oldMessage.author.username} a été modifié.`)
    .setFields(
      { name: 'Ancien contenu', value: oldMessage.content },
      { name: 'Nouveau contenu', value: newMessage.content }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildMemberAdd'
bot.on('guildMemberAdd', member => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Nouveau membre rejoint')
    .setFields(
      { name: 'Membre', value: member.user.username },
      { name: 'ID du membre', value: member.user.id }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildMemberKick'
bot.on('guildMemberKick', member => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Membre expulsé')
    .setFields(
      { name: 'Membre', value: member.user.username },
      { name: 'ID du membre', value: member.user.id }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildMemberRemove'
bot.on('guildMemberRemove', member => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Membre quitté')
    .setFields(
      { name: 'Membre', value: member.user.username },
      { name: 'ID du membre', value: member.user.id }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildMemberNickUpdate'
bot.on('guildMemberNickUpdate', (member, oldNick, newNick) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Mise à jour de pseudo')
    .setDescription(`Le pseudo de ${member.user.username} a été mis à jour.`)
    .setFields(
      { name: 'Ancien pseudo', value: oldNick },
      { name: 'Nouveau pseudo', value: newNick }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'voiceChannelLeave'
bot.on('voiceChannelLeave', (member, oldChannel) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Membre quitté un salon vocal')
    .setFields(
      { name: 'Membre', value: member.user.username },
      { name: 'Salon précédent', value: oldChannel.name }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'voiceChannelJoin'
bot.on('voiceChannelJoin', (member, newChannel) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Membre a rejoint un salon vocal')
    .setFields(
      { name: 'Membre', value: member.user.username },
      { name: 'Nouveau salon', value: newChannel.name }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'voiceChannelSwitch'
bot.on('voiceChannelSwitch', (member, oldChannel, newChannel) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Membre a changé de salon vocal')
    .setFields(
      { name: 'Membre', value: member.user.username },
      { name: 'Salon précédent', value: oldChannel.name },
      { name: 'Nouveau salon', value: newChannel.name }
    );
  
  sendLogEmbed(embed);
});

// Exemple pour l'événement 'guildEmojisUpdate'
bot.on('guildEmojisUpdate', (guild, oldEmojis, newEmojis) => {
  const embed = new Discord.EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('Mise à jour des emojis')
    .setFields(
      { name: 'Anciens emojis', value: oldEmojis.map(emoji => emoji.toString()).join(' ') },
      { name: 'Nouveaux emojis', value: newEmojis.map(emoji => emoji.toString()).join(' ') }
    );
  
  sendLogEmbed(embed);
});



process.on("unhandledRejection", (reason, p) => {
	console.log(" [AntiCrash] :: Unhandled Rejection/Catch");
	console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
	console.log(" [AntiCrash] :: Uncaught Exception/Catch");
	console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
	console.log(" [AntiCrash] :: Uncaught Exception/Catch (MONITOR)");
	console.log(err, origin);
});
process.on("multipleResolves", (err, type, promise, reason) => {
	console.log(" [AntiCrash] :: Multiple Resolves");
	console.log(err, type, promise, reason);
});
process.on('unhandledRejection', error => {
	if (error.name === "DiscordAPIError[10062]") return;
    else console.error('Unhandled promise rejection:', error);
});
*/