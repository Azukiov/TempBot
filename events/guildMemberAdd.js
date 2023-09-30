const djs = require('discord.js');
const log = require('../logger');
const db = require('../db');

module.exports = {
    name: djs.Events.GuildMemberAdd,
    async execute(member) {
        // add user to database
        let user = await db.query(`SELECT * FROM users WHERE userId = '${member.id}'`);
        if (!user[0]) await db.query(`INSERT INTO users (userId) VALUES ('${member.id}')`);
        log.db(`Added ${member.id} to table users`)


        const channelJoin = member.guild.channels.cache.find(ch=> ch.id === process.env.JOIN_ID);
        if (channelJoin) {
            channelJoin.send(`Welcome to the server, ${member}!`);
            log.info(`User ${member.id} joined ${member.guild.id} with the invite ${member.guild.vanityURLCode}`)
        } else {
            return;
        }

        const channelMemberCount = member.guild.channels.cache.find(ch=> ch.id === process.env.MEMBER_COUNT_ID);
        if (channelMemberCount) {
            channelMemberCount.setName(`Members: ${member.guild.memberCount}`);
        } else {
            return;
        }

    }
}