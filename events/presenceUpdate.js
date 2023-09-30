const djs = require('discord.js');
const log = require('../logger');

module.exports = {
    name: djs.Events.PresenceUpdate,
    async execute(oldPresence, newPresence) {
        const member = newPresence.member;
        
        const customStatus = newPresence.activities.find(activity => activity.type === djs.ActivityType.Custom);
        if (newPresence.guild.id === '863498186715037746') {
            const customStatusState = customStatus?.state;
            const inviteCode = customStatusState?.match(/.gg\/(\w+)/)?.[1];
            const invite = await newPresence.client.fetchInvite(inviteCode).catch(() => null);
            const roleId = "1155348616664322203"

            if (invite?.guild.id === newPresence.guild.id) {
                member.roles.add(roleId).catch(err => log.error(err))
            } else {
                member.roles.remove(roleId).catch(err => log.error(err))
            } 

        } else return;

    }
}