const { PermissionFlagsBits, ApplicationCommandOptionType, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {

    name: "clear",
    description: "Clear un nombre de message",
    type: 1,
    utilisation: "/clear [nombre] (salon)",
    permission: PermissionFlagsBits.ManageMessages,
    ownerOnly: false,
    dm: false,
    category: "Modération",
    options: [
        {
            type: ApplicationCommandOptionType.Number,
            name: "nombre",
            description: "Le nombre de message à supprimer",
            required: true,
            min_value: 1,
            max_value: 100,
            autocomplete: false
        }, {
            type: ApplicationCommandOptionType.Channel,
            name: "salon",
            description: "Le salon où il faut supprimer les messages",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel;
        //if(channel.type !== ChannelType.GuildText) return message.reply({content: "Vérifie que tu as bien mis un salon textuel !", ephemeral: true})

        let number = args.getNumber("nombre")
        if(parseInt(number) <= 0 || parseInt(number) > 100) return message.reply({content: "Tu dois indiquer un nombre entre **1** et **100** inclus !", ephemeral: true})

        try{
            
            let messages = await channel.bulkDelete(parseInt(number))

            await message.reply({content: `**${messages.size}** messages on été suprimmés dans le salon ${channel} !`, ephemeral: true})

        } catch (err) {


            let Embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription("❌ Dans ta selction de messages, certain date de plus de 14 jours et par conséquence ne peuvent pas être supprimés par moi !")
            try{ await message.reply({embeds: [Embed], ephemeral: true}) } catch (err) {console.error(err)}
        }
    }
}