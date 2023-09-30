const djs = require('discord.js');
const log = require('../../logger');
const db = require('../../db');

module.exports = {
    module: "admin",
    data: new djs.SlashCommandBuilder()
        .setName('users')
        .setDescription('Manage users')
        .setDefaultMemberPermissions(djs.PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand.setName('promote').setDescription('Promote a user')
            .addUserOption(option => option.setName('user').setDescription('The user to promote').setRequired(true))
            .addIntegerOption(option => option.setName('level').setDescription('The level to promote the user to').setRequired(true)
                .addChoices({ name: 'Developer', value: 4 },))
        ),

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'promote') {
            const userWantPromote = interaction.options.getUser('user');
            const promoteLevel = interaction.options.getInteger('level');

            // for level 4, check if interaction.user is dev
            if (promoteLevel === 4) {
                // check in db if interaction.user has permission level 4
                let user = await db.query(`SELECT * FROM users WHERE userId = '${interaction.user.id}'`);
                if (user[0].permissionLevel !== 4) {
                    log.cmd(`${interaction.user.id} tried to promote ${user.id} to level 4 but is not a developer`)
                    return interaction.reply({ content: `You are not a developer`, ephemeral: true });
                } else {
                    await db.query(`UPDATE users SET permissionLevel = ${promoteLevel} WHERE userId = '${userWantPromote.id}'`);
                    log.cmd(`${interaction.user.id} promoted ${userWantPromote.id} to level ${promoteLevel}`)
                    return interaction.reply({ content: `Promoted ${userWantPromote.tag} to level ${promoteLevel}`, ephemeral: true });
                }
            }
        }
    }
}