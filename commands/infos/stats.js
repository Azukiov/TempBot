const djs = require('discord.js');

module.exports = {
    module: "infos",
    data: new djs.SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get bot stats'),

    async execute(client, interaction) {
        const botName = client.user.username;

        const uptime = client.uptime;
        const uptimeString = `${Math.floor(uptime / 86400000)}d ${Math.floor(uptime / 3600000) % 24}h ${Math.floor(uptime / 60000) % 60}m ${Math.floor(uptime / 1000) % 60}s`;

        const embed = new djs.EmbedBuilder()
            .setAuthor({ name: `${botName} stats`, iconURL: client.user.avatarURL(), ulr: process.env.INVITE_URL })
            .setDescription(`Uptime: ${uptimeString}`)

        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}