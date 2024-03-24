const Discord = require("discord.js")
const { TextInputStyle, TextInputBuilder, ActionRowBuilder, PermissionFlagsBits, ChannelType, ApplicationCommandOptionType, ModalBuilder } = require("discord.js");
const Config = require("../../../config");


module.exports = {
    name: "sondage",
    description: "Permet de créer un sondage",
    type: 1,
    utilisation: "/sondage",
    permission: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    dm: false,
    category: "Administration",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "create",
            description: "Permet de créer un sondage",
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "finish",
            description: "Permet de faire terminier un sondage",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "message",
                    description: "L'identifiant du message contenant la sondage",
                    required: true,
                },
            ],
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "channel",
            description: "Permet de configurer le salon des sondages",
            options:[
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "salon",
                    description: "Le salon où s'enverront les sondages",
                    channelTypes: [ChannelType.GuildText],
                    required: true,
                },
            ],
        },
    ],
  
  
    async run(bot, interaction, args, db) {
        const subCommand = args.getSubcommand();
    
        switch (subCommand) {
            case 'finish':

            console.log(args.getString("message", true));
            const userId = interaction.user.id;
            db.query(`SELECT * FROM guild WHERE Guild = ${interaction.guild.id}`, async(err, req) => {

              if (err) {
                console.error(err);
                return interaction.reply({ content: "Une erreur est survenue lors de la recherche de la guilde.", ephemeral: true });
              }
      
              if (req.length >= 1) {
                db.query(`SELECT * FROM sondage WHERE MessageId = ${args.getString("message", true)}`, async(err, req1) => {
                  if (err) {
                    console.error(err);
                    return interaction.reply({ content: "Une erreur est survenue lors de la recherche du sondage.", ephemeral: true });
                  }
      
                  if (req.length >= 1) {
                    const fetchedMessage = await bot.channels.cache.get(req[0].Channel_Sondage).messages.fetch(args.getString("message", true));
                    if (!fetchedMessage) return interaction.reply({ content: "❌ Ce message n'existe pas", ephemeral: true });
                    let embed = fetchedMessage.embeds[0];
                    embed.color = Config.SUCCESS;
                    fetchedMessage.edit({ content: `Sondage terminé par <@${userId}>`, embeds: [embed], components: [] });
                    interaction.reply({ content: "✅ Sondage terminé avec succès", ephemeral: true });
                  }
                });
              }
            });
            break;


        case 'channel':

            let channel = args.getChannel("salon")
            if (!channel  || Discord.ChannelType.GuildText) return interaction.reply({ content: "❌ Ce salon n'existe pas ou ce n'est pas un salon textuel", ephemeral: true });
            
            db.query(`SELECT * FROM guild WHERE Guild = ${interaction.guild.id}`, async(err, req) => {
                if (err) throw err;
                if (req.length < 1) {
                    db.query(`INSERT INTO guild (Guild, Channel_Sondage) VALUES (${interaction.guild.id}, ${channel.id})`, (err, req) => {
                        if (err) throw err;
                        interaction.reply({ content: "✅ Vous avez défini le salon pour l'envoie des sondages", ephemeral: true });
                    });
                };
                if (req.length >= 1) {
                    db.query(`UPDATE guild SET Channel_Sondage = ${channel.id} WHERE Guild = ${interaction.guild.id}`, (err, req) => {
                        interaction.reply({ content: "✅ Vous avez mis à jour le salon pour l'envoie des sondages", ephemeral: true });
                    });
                };
            });
        break;
        case 'create':

            const modal = new ModalBuilder()
            .setCustomId('suggest-modal')
            .setTitle('Votre nouveau sondage')

            const question1 = new TextInputBuilder()
            .setCustomId('input-title')
            .setLabel("Quel est le titre de votre sondage ?")
            .setRequired(true)
            .setMinLength(0)
            .setMaxLength(100)
            .setPlaceholder("Veuillez indiquer le titre du sondage")
            .setStyle(TextInputStyle.Short)

            const question2 = new TextInputBuilder()
            .setCustomId('input-content')
            .setLabel("Quel est le contenu de votre sondage ?")
            .setRequired(true)
            .setMinLength(0)
            .setMaxLength(1024)
            .setPlaceholder("Veuillez indiquer le contenu du sondage")
            .setStyle(TextInputStyle.Paragraph)

            const question3 = new TextInputBuilder()
            .setCustomId('input-image')
            .setLabel("Quelle est l'image contenant votre sondage ?")
            .setRequired(false)
            .setMinLength(0)
            .setMaxLength(1024)
            .setPlaceholder("Type d'image pris en compte : png, jpg, gif")
            .setStyle(TextInputStyle.Short)

            const ActionRow1 = new ActionRowBuilder().addComponents(question1);
            modal.addComponents(ActionRow1)

            const ActionRow2 = new ActionRowBuilder().addComponents(question2);
            modal.addComponents(ActionRow2)

            const ActionRow3 = new ActionRowBuilder().addComponents(question3);
            modal.addComponents(ActionRow3)

            await interaction.showModal(modal);
        break;
        default:
            interaction.reply({content: "Une erreur est survenu, merci de contacter un membre du staff pour faire remonter l'erreur", ephemeral: true})
        break;
        }
    }
}