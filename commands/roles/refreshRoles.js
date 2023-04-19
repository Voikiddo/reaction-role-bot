const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refresh roles')
		.setDescription('Refresh custom roles.'),
	async execute(interaction) {
        const Roles = [
            {
                name: 'Announcement Ping',
                ID: '1098074252785242183',
                emoji: '1090243506561364059'
            },
            {
                name: 'Game Test',
                ID: '1098074614682370148',
                emoji: '1085138186776363029'
            },
            {
                name: 'Live Ping',
                ID: '1098074736317186138',
                emoji: '1093582195479822386'
            }
        ]

		// for (let role of Roles) {
		// 	const guild = interaction.guild

		// 	const roleElement = guild.roles.cache.find(
		// 		r => r.id === role.ID
		// 	)

		// 	const member = await guild.members.fetch({ user: user.id, force: true })

		// 	if (roleElement && !member.roles.cache.has(role.ID)) {
		// 		await member.roles.add(role.ID , `Adding roles`)
		// 		console.log(`Added ${role.name} to member ${user.id}`);
		// 	}

		// 	break;
		// }
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`WIP`);
	},
};
