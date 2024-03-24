const Discord = require("discord.js")

module.exports = async (bot, guild) => {

    let db = bot.db;
    let guildName = guild.name.replace(/'/g, "\'").replace(/[\u{1F000}-\u{1F6FF}]/gu, '');
  
    //insérer les données dans la table server de la db
    try {
      await db.query(`SELECT * FROM server WHERE guild = ${guild.id}`, async (err, req) => {
        if(err) return console.error(err)
      
        if (req.length === 0) {
        
        await db.query("INSERT INTO server (`guild`, `guild_name`) VALUES (?, ?)",[guild.id, guildName]);
        console.log("Données server insérées avec succès !");
      }
    });
    } catch (err) {console.error("Erreur lors de l'insertion dans la base de données :", err);}

    //insérer les données dans la table config_ticket de la db
    for (let i = 1; i < 5; i++) {
      let table_config_ticket = "config_ticket"
      if(i === 2) table_config_ticket = "config_ticket_fields_description"
      if(i === 3) table_config_ticket = "config_ticket_fields_inline"
      if(i === 4) table_config_ticket = "config_ticket_fields_name"

      try {
        await db.query(`SELECT * FROM ${table_config_ticket} WHERE guildID = ${guild.id}`, async (err, req) => {
          if(err) return console.error(err)
          
          if(req.length === 0) {
          
          await db.query(`INSERT INTO ${table_config_ticket} (\`guildID\`) VALUES (?)`,[guild.id]);
          console.log(`Données ${table_config_ticket} insérées avec succès !`);
        }
      });
      } catch (err) {console.error("Erreur lors de l'insertion dans la base de données :", err);}
    }
  
  // Insérer les données dans la table "user" de la base de données
  await db.query(`SELECT * FROM user WHERE guildID = ${guild.id}`, async (err, req) => {
    if(err) return console.error(err)
  
    const members = await guild.members.fetch();
  
    members.forEach(async (member) => {
      /*let guildName = member.guild.name.replace(/'/g, "\\'").replace(/[\u{1F000}-\u{1F6FF}]/gu, '');
      let userName = member.user.username.replace(/'/g, "\\'").replace(/[\u{1F000}-\u{1F6FF}]/gu, '');*/
      let guildID = member.guild.id
      let memberID = member.user.id
      let ID = `${guildID}_${memberID}`
      
      // Vérifier si l'utilisateur existe déjà dans la base de données
      try{
        await db.query(`SELECT * FROM user WHERE ID = '${ID}'`, async (err, req) => {
          if(err) return console.error(err)
  
          if (req.length === 0) {
            // L'utilisateur n'existe pas, on l'insère dans la base de données
            await db.query(`INSERT INTO user (guildID, userID, ID) VALUES ('${guildID}', '${memberID}', '${ID}')`)
            console.log(`L'utilisateur ${member.user.username} vient d'être ajoutée à la table user du serveur ${member.guild.name}`);
          }
        })
      } catch (error) {
        console.error("Erreur lors de la vérification ou de l'ajout de la colonne user :", error);
      }
    })
  })
}