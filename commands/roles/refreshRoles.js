const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refreshroles')
		.setDescription('Refresh custom roles.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
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

		const guild = interaction.guild
		const message = await guild.channels.cache
			.get('1097955935428804699')
			.messages.fetch("1097957268424773792");

		const reactions = message.reactions.cache

		for (let role of Roles) {
			const reaction = reactions.find(r => r._emoji.id === role.emoji)
			const reactionUsers = await reaction.users.fetch()
			for (let user of reactionUsers) {
				const member = await guild.members.fetch({ user: user.id, force: true })

				if (!member.roles.cache.has(role.ID)) {
					await member.roles.add(role.ID , `Adding roles`)
					console.log(`Added ${role.name} to member ${user.id}`);
				}
			}
		}
		
		await interaction.reply(`Custom roles refreshed!`);
	},
};
