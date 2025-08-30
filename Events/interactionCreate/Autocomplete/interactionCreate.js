const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

    let db = bot.db;

    if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

        let entry = interaction.options.getFocused()

        if(interaction.commandName === "help"){

        let choices = bot.commands.filter(cmd => cmd.category.includes(entry))
        await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice, value: choice})))
        }

        if(interaction.commandName === "mute"){

            let choices = ["1 minute", "2 minutes", "5 minutes", "10 minutes", "15 minutes", "20 minutes", "30 minutes", "45 minutes", "1 heure", "2 heures", "5 heures", "12 heures", "1 jour", "2 jours", "3 jours", "4 jours", "5 jours", "6 jours", "1 semaine", "1,5 semaines", "2 semaines", "2,5 semaines", "3 semaines", "3,5 semaines", "4 semaines"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "sécurité"){

            let choices = ["Captcha", "AntiMessages", "AntiRaid"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "roles"){

            let choices = ["Ajouter", "Enlever"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }
        
        if(interaction.commandName === "warn"){

            let choices = ["Modification | Titre & Description"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "ban"){

            let choices = ["Promotion de service d'hébergement frauduleux (mettre le nom ici)"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "config"){

            let choices = ["🏠 Accueil", "🎫 Ticket", "🗣 Langue du bot", "🎭 Rôles réactions"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "role-arrive"){

            let choices = ["Visiteurs", "Rien"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }
        
        if(interaction.commandName === "pub"){

            let choices = ["Oui", "Non"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "say"){

            let choices = ["Oui", "Non"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "ticket"){

            let choices = ["Reactionrole", "Bouton"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "reset"){

            let choices = ["bans", "kicks", "mutes", "unbans", "unmutes", "warns", "toutes", "xp"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }
        
        if(interaction.commandName === "liste"){

            let choices = ["ban", "kick", "mute", "unban", "unmute", "warn"/*, "toutes"*/]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "status"){

            let choices = ["Listening", "Playing", "Competing", "Watching", "Streaming", "Par défaut"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }
    }
}