module.exports = async (bot, interaction) => {

    if(interaction.customId) if(interaction.customId.startsWith("bouton_reglement")) {
        let customId = interaction.customId.split(" ")
        let id = customId[customId.length - 1]
        let systeme = "📜 Réglement"

        await interaction.deferUpdate()
        const role = await interaction.guild.roles.cache.get(id)

        if(!role) {
            await interaction.followUp({ embeds : [await bot.function.embed_reglement_message_erreur1(bot, systeme)], ephemeral: true })
            await interaction.message.edit({ components: [await bot.function.bouton_reglement(null)] });
            return
        }

        if (interaction.member.roles.cache.has(id)) {
            await interaction.followUp({ embeds : [await bot.function.embed_reglement_message_retirer(bot, systeme, role)], ephemeral: true })
            return
        } else {
            try {
                await interaction.member.roles.add(id);
                await interaction.followUp({ embeds : [await bot.function.embed_reglement_message_attribué(bot, systeme, role)], ephemeral: true })
                return
            } catch (error) {
                await interaction.followUp({ embeds : [await bot.function.embed_reglement_message_erreur2(bot, systeme)], ephemeral: true })
                console.error(`Erreur lors de l'ajout du rôle :`, error);
                return
            }
        }

    }
}