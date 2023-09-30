const djs = require('discord.js');
const log = require('../logger');
const db = require('../db');

module.exports = {
    name: djs.Events.ClientReady,
    async execute(client) {
        log.start(`Logged in as ${client.user.tag}!`)


        // TABLES FOR DATABASE
        const guilds = client.guilds.cache;

        await db.query(`CREATE TABLE IF NOT EXISTS guilds (
            guildId VARCHAR(255) PRIMARY KEY,
            premium BOOLEAN DEFAULT FALSE)`);
        // guilds.forEach(async guild => {
        //     let guildCheck = await db.query(`SELECT * FROM guilds WHERE guildId = '${guild.id}'`);
        //     if (!guildCheck[0]) await db.query(`INSERT INTO guilds (guildId) VALUES ('${guild.id}')`);
        //     log.db(`Added ${guild.id} to table guilds`)
        // });

        await db.query(`CREATE TABLE IF NOT EXISTS guildColor (
            guildId VARCHAR(255) PRIMARY KEY,
            color VARCHAR(255) DEFAULT NULL,
            error VARCHAR(255) DEFAULT "#ff0000")`);
        // guilds.forEach(async guild => {
        //     let guildCheck = await db.query(`SELECT * FROM guildColor WHERE guildId = '${guild.id}'`);
        //     if (!guildCheck[0]) await db.query(`INSERT INTO guildColor (guildId) VALUES ('${guild.id}')`);
        //     log.db(`Added ${guild.id} to table guildColor`)
        // });

        await db.query(`CREATE TABLE IF NOT EXISTS guildStats (
                guildId VARCHAR(255) PRIMARY KEY,
                channelId VARCHAR(255) DEFAULT NULL,
                withBots BOOLEAN DEFAULT FALSE,
                enabled BOOLEAN DEFAULT FALSE)`);
        // guilds.forEach(async guild => {
        //     let guildCheck = await db.query(`SELECT * FROM guildStats WHERE guildId = '${guild.id}'`);
        //     if (!guildCheck[0]) await db.query(`INSERT INTO guildStats (guildId) VALUES ('${guild.id}')`);
        //     log.db(`Added ${guild.id} to table guildStats`)
        // });

        await db.query(`CREATE TABLE IF NOT EXISTS users (
            userId VARCHAR(255) PRIMARY KEY,
            permissionLevel INT DEFAULT 0)`);
        // guilds.forEach(async guild => {
        //     const members = await guild.members.fetch();
        //     members.forEach(async member => {
        //         let userCheck = await db.query(`SELECT * FROM users WHERE userId = '${member.id}'`);
        //         if (!userCheck[0]) await db.query(`INSERT INTO users (userId) VALUES ('${member.id}')`);
        //         log.db(`Added ${member.id} to table users`)
        //     })
        // });



        // UPDATE CHANNEL
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