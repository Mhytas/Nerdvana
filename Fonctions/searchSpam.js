const { PermissionFlagsBits } = require("discord.js");
const User = new Map();

module.exports = async message => {

    if(message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;

    if(User.get(message.author.id)) {

        const data = User.get(message.author.id)
        let difference = message.createdTimestamp - data.lastMessage.createdTimestamp;

        if(difference > 3000) {

            clearTimeout(data.timer)
            data.msgCount += 1;
            data.lastMessage = message

            data.timer = setTimeout(() => {
                User.delete(message.author.id)
            }, 10000)

            User.set(message.author.id, data)

        } else {

            if(++data.msgCount > 5) {

                await message.member.timeout(300000, "Spam")
                await message.channel.send(`**:warning: ${message.author} a été mute pendant 5 minutes car il spammé ! :warning:**`)

                const messages = await message.channel.messages.fetch({ limit: 100, before: message.id });
                const userMessages = messages.filter(m => m.author.id === message.author.id).first(10);
                await message.channel.bulkDelete(userMessages);

            } else {

                User.set(message.author.id, data)
            }
        }

    } else {

        let FN = setTimeout(() => {
            User.delete(message.author.id)
        }, 10000)

        User.set(message.author.id, {
            msgCount: 1,
            lastMessage : message,
            timer: FN
        })
    }
}
