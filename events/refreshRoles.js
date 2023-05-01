const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return false;
    	if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return false;

		const refreshRoles = async (guild) => {
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

			const message = await guild.channels.cache
				.get('1097955935428804699')
				.messages.fetch("1097957268424773792");

			const reactions = message.reactions.cache
			const roles = await guild.roles.fetch()


			for (let role of Roles) {
				const reaction = reactions.find(r => r._emoji.id === role.emoji)
				const reactionUsersMap = await reaction.users.fetch()
				const reactionUsers = await guild.members.fetch({user: [...reactionUsersMap].map(arr => arr[0])})

				for (let user of reactionUsers) {
					if (!user[1]._roles.includes(role.ID)) {
						await member.roles.add(role.ID , `Adding roles`)
                        console.log(`Added '${role.name}' to member '${user.id}' (role refresh)`);
					}
				}
			}
		}

		const randomReply = async (message) => {
			const Replies = [
				"omg",
				"D:",
				"peepoShy",
				"why :(",
				"you're so cool peepoShy",
				"YIPPEE",
				">:)",
				"umm probably",
				Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
				`omg that's such a ${message.author.username} moment`,
				"sorry :("
			]

			let random = Math.floor(Math.random() * Replies.length);
			return message.reply(Replies[random]).catch(console.error)
		}

		if (message.mentions.has(process.env.CLIENT_ID)) {
			const guild = message.guild
			const member = await guild.members.fetch({ user: message.author.id, force: true })

			if (member.roles.cache.has('1015540320705978449')) {
				await refreshRoles(guild)
			}

			return randomReply(message)
		}
	
	}
}