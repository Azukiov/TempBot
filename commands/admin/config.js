const djs = require('discord.js');
const log = require('../../logger');
const db = require('../../db');

module.exports = {
    module: 'admin',
    data: new djs.SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure the bot')
        .setDefaultMemberPermissions(djs.PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand.setName('color').setDescription('Configure colors (HEX format, ex: #ffffff)')
            .addStringOption(option => option.setName('color').setDescription('The color for all messages').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('stats').setDescription('Configure stats')
            .addChannelOption(option => option.setName('channel').setDescription('The channel to send stats to').addChannelTypes(djs.ChannelType.GuildVoice).setRequired(true))
            .addBooleanOption(option => option.setName('enabled').setDescription('Whether to enable stats').setRequired(true))
        ),

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "color") {
            const color = interaction.options.getString('color');

            // check if color is in HEX format
            if (!/^#[0-9A-F]{6}$/i.test(color)) return interaction.reply({ content: `Color must be in HEX format (ex: #ffffff)`, ephemeral: true });

            await db.query(`UPDATE guildColor SET color = '${color}' WHERE guildId = '${interaction.guild.id}'`);
            log.db(`Updated color for ${interaction.guild.id} in table guilds`)

            interaction.reply({ content: `Updated color to \`${color}\``, ephemeral: true });
            log.info(`${interaction.user.id} updated color for ${interaction.guild.id}`)
        }

        if (subcommand === "stats") {
            const channel = interaction.options.getChannel('channel');
            const enabled = interaction.options.getBoolean('enabled');

            let guildStats = await db.query(`SELECT * FROM guildStats WHERE guildId = '${interaction.guild.id}'`);
            if (!guildStats[0]) await db.query(`INSERT INTO guildStats (guildId) VALUES ('${interaction.guild.id}')`);
            log.db(`Added ${interaction.guild.id} to table guildStats`)
            await db.query(`UPDATE guildStats SET channelId = '${channel.id}', enabled = ${enabled} WHERE guildId = '${interaction.guild.id}'`);
            log.db(`Updated ${interaction.guild.id} in table guildStats`)
            log.cmd(`${interaction.user.id} updated stats for ${interaction.guild.id}`)
            return interaction.reply({ content: `Updated stats for ${interaction.guild.name}`, ephemeral: true });
        }
    }
}