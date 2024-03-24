const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
    
module.exports = {
  
    name: "reglement",
    description: "Reglement du discord",
    utilisation: "/reglement",
    type: 1,
    permission: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    dm: false,
    category: "Administration",
    options: [
        {
            type: ApplicationCommandOptionType.Role,
            name: "rôle",
            description: "Le rôle qui sera attribué",
            required: true,
        }
    ],
    
    async run(bot, interaction, args, db) {
        const rôle = await args.getRole("rôle")
        const guild = await bot.guilds.cache.get(interaction.guild.id)
        const rôle_bot = await guild.members.cache.get(bot.user.id).roles.highest.rawPosition
        let systeme = "📜 Réglement"

        await interaction.deferReply({ephemeral: true})

        if(rôle.position === rôle_bot) return interaction.followUp({embeds: [await bot.function.embed_rôles_réactions_rôles_erreur(bot, systeme, rôle.id, "mien")], ephemeral: true})
        if(rôle.position > rôle_bot) return interaction.followUp({embeds: [await bot.function.embed_rôles_réactions_rôles_erreur(bot, systeme, rôle.id, "suppérieur")], ephemeral: true})
        if(!rôle.editable) return interaction.followUp({embeds: [await bot.function.embed_rôles_réactions_rôles_erreur(bot, systeme, rôle.id, "attribuer")], ephemeral: true})

        await interaction.channel.send({embeds: [await bot.function.embed_reglement(bot)], components: [await bot.function.bouton_reglement(rôle.id)]})
        .then(async () => await interaction.followUp({content: "Le message a été envoyé avec succès !", ephemeral: true}))
        .catch(async (err) => {
            await interaction.followUp({content: "Le message ne sait pas envoyé vérifie que tu as bien rentre l'url du webhook !", ephemeral: true})
            console.error(err)
        });
    }
}