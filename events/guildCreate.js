const djs = require('discord.js');
const log = require('../logger');
const db = require('../db');

module.exports = {
    name: djs.Events.GuildCreate,
    async execute(guild) {
        let client = guild.client;

        // add guild to database table guilds and guildStats
        let guildCheck = await db.query(`SELECT * FROM guilds WHERE guildId = '${guild.id}'`);
        if (!guildCheck[0]) await db.query(`INSERT INTO guilds (guildId) VALUES ('${guild.id}')`);
        log.db(`Added ${guild.id} to table guilds`)
        let guildStatsCheck = await db.query(`SELECT * FROM guildStats WHERE guildId = '${guild.id}'`);
        if (!guildStatsCheck[0]) await db.query(`INSERT INTO guildStats (guildId) VALUES ('${guild.id}')`);
        log.db(`Added ${guild.id} to table guildStats`)

        
        const guildStats = await db.query(`SELECT * FROM guildStats WHERE enabled = TRUE`);
        guildStats.forEach(async guild => {
            const channel = client.channels.cache.get(guild.channelId);
            if (!channel) return;
            const guildId = client.guilds.cache.get(guild.guildId);
            if (!guildId) return;
            // get all members and bots in guild
            const members = await guildId.members.fetch();
            // keep also bots
            const membersCount = members.size;
            // rename channel 
            channel.setName(`Members: ${membersCount}`);
            log.info(`Updated channel name for ${guildId.name} to Members: ${membersCount}`)
        });
    }
}