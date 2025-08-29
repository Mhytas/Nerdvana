const { ActivityType, EmbedBuilder } = require("discord.js")
const config = require("../config")
const loadSlashCommands = require("../Loaders/loadSlashCommands")
require('dotenv').config();
const mysql = require('mysql');

module.exports = async bot => {

        //Chargement de la db
        function createDatabaseConnection() {
                const db = mysql.createConnection({
                        host: process.env.DB_HOST,
                        port: process.env.DB_PORT,
                        user: process.env.DB_USER,
                        password: process.env.DB_PASSWORD,
                        database: process.env.DB_DATABASE,
                        charset: process.env.DB_CHARSET,
                });
                return db;
              }
              
              const db = createDatabaseConnection();

              db.connect((err) => {
                if (err) {
                  console.error('Erreur de connexion à la base de données:', err);
                  process.exit(1);
                } else {
                  console.log('Connexion à la base de données réussie !');
                }
              });
              bot.db = db

        //Chargement des commandes
        await loadSlashCommands(bot)
        let allcommands = [];
        await bot.commands.forEach(command => allcommands.push({commandName: command.name, commandUsage: command.utilisation, commandDescription: command.description}))

        //Ajoute le(s) utilisateur(s) / serveur(s) qui ne sont pas dans la db
        await bot.guilds.cache.forEach(async guild => { await bot.function.insertDatabase(bot, guild) })

        //Changement du status du bot et vérifie les tickets et supprime dans la db les /say pas complété depuis 1H et vérifie et ajoute le(s) utilisateur(s) et/ou serveur(s) qui ne sont pas dans la db
        setInterval(async function () {
                {statuttext = [
                        `le serveur 👀`,
                        `vos messages 👀`,
                        `la version 0.0.1 👀`,
                ]}
                const randomText = statuttext[Math.floor(Math.random() * statuttext.length)];
                //await bot.user.setActivity(`${randomText}`, {type: ActivityType.Streaming, url: config.link})
                await bot.user.setPresence({ activities: [{ name: randomText, type: ActivityType.Watching}], status: 'online' });

                /*await bot.db.query(`SELECT * FROM ticket`, async (err, req) => {
                        req.forEach(async (row) => {
                                const channel = bot.channels.cache.get(row.channel);
                                if(!channel) return await bot.db.query(`DELETE FROM ticket WHERE channel = '${row.channel}'`)
                                const timeValue = parseInt(row.time);
                                if(timeValue === "false") return
                                if (Date.now() > timeValue + 86400000) {
                                const user = row.user;
                                let Embed1 = new EmbedBuilder()
                                .setColor(bot.color)
                                .setDescription(`# :warning: Ticket inactif\nVotre ticket est inactif depuis 24h, nous vous recommandons de suivre ce ticket afin qu'il ne soit pas inactif. Le ticket sera fermé au bout de la 3ème prévention si aucune réponse n'est fournie !`)
                                channel.send({content: `<@${user}>`, embeds: [Embed1]})
                                }
                        });
                });

                for(let i = 0; i < 3; i++) {
                        let table = "say"
                        if(i === 2) table = "rôles_réactions"

                        await bot.db.query(`SELECT * FROM ${table}`, async (err, req_say) => { 
                                await req_say.forEach(async (say) => {
                                        if(!say.url) if(!say.id.startsWith('https://')) if(parseInt(say.time) + 3600000 < Date.now()) await bot.db.query(`DELETE FROM ${table} WHERE id = ?`, [say.id])
                                })
                        })

                        await bot.db.query(`SELECT * FROM ${table}`, async (err, req_table) => {
                                await req_table.forEach(async (row) => {
                                        if(row.url) if(row.url.startsWith('https://')) {
                                                const messageLink = row.url;
                                                const channelLink = row.salon
                                                const messageId = messageLink.split('/').pop()

                                                const salon = await bot.channels.fetch(channelLink)
                                                .catch(async () => { await bot.db.query(`DELETE FROM ${table} WHERE salon = ?`, [channelLink], (error, results) => {
                                                        if (error) return console.error('Erreur lors de la suppression :', error)
                                                        return
                                                })})

                                                if(salon !== undefined) { 
                                                        await bot.channels.cache.get(channelLink).messages.fetch(messageId)
                                                        .catch(async () => { await bot.db.query(`DELETE FROM ${table} WHERE url = ?`, [messageLink], (error, results) => {
                                                                if (error) return console.error('Erreur lors de la suppression :', error)
                                                                return
                                                        })})
                                                }
                                        }
                                })
                        });
                }

                await bot.guilds.cache.forEach(async guild => { 
                        await bot.function.insertDatabase(bot, guild)
                        await bot.db.query(`SELECT * FROM rôles_réactions WHERE guild_id = ${guild.id}`, async (err, req_rôles_réactions) => {
                                if(req_rôles_réactions.length === 0) await bot.db.query(`UPDATE server SET number_roles_réactions = 0 WHERE guild = '${guild.id}'`)
                      })
                })

                await bot.db.query('SELECT *, COUNT(*) AS nombre_de_lignes FROM rôles_réactions GROUP BY guild_id;', function (error, results, fields) {
                        if (error) console.error(error)
                        results.forEach(async row => { await bot.db.query(`UPDATE server SET number_roles_réactions = ${row.nombre_de_lignes} WHERE guild = '${row.guild_id}'`) });
                })*/
        }, 5000)
        
        
        //Logs dans la console
        console.log("Le status a été mise à jour avec succès !")
        console.log(`${bot.user.username} est bien en ligne !`)
}