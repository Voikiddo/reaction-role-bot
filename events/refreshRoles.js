const { Events } = require('discord.js');
const { log } = require('node:console');
const fs = require('node:fs');
const path = require('node:path');

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
				},
				{
					name: 'Heyy Updates Ping',
					ID: '1107002591755391060',
					emoji: '1010148937769959456'
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
						await user[1].roles.add(role.ID , `Adding roles`)
						.then(()=>{
							console.log(`Added '${role.name}' to member '${user[1].id}' (role refresh)`);
						})
						.catch(err=>{
							console.error(err)
							console.log(`Trouble adding '${role.name}' to member '${user[1].id}' (role refresh)`);
						})
					}
				}
			}
		}

		const randomReply = async (message) => {
			const respondsJSONPath = path.join(__dirname, '../assets/responds.json');
			const responds = JSON.parse(fs.readFileSync(respondsJSONPath)).content

			let respondMessage

			// has trigger
			let fullMessage
			if (message.partial) {
				await message.fetch()
					.then(m => {
						fullMessage = m.content.toLowerCase();
					})
					.catch(error => {
						console.log('Something went wrong when fetching the message: ', error);
					});
			} else {
				fullMessage = message.content.toLowerCase();
			}

			for (let triggeredRespond of responds.has_trigger) {
				const trigger = triggeredRespond.trigger
				const odds = parseFloat(triggeredRespond.odds)
				const respondContents = triggeredRespond.response

				const rand = Math.random()
				if (fullMessage.includes(trigger) && rand < odds) {
					const rand2 = Math.random()
					let randomIndex = Math.floor(rand2 * respondContents.length)
					respondMessage = respondContents[randomIndex]
				}
			}

			// no trigger
			if (!respondMessage) {
				const Replies = responds.no_trigger
				let randomIndex = Math.floor(Math.random() * Replies.length)
				respondMessage = Replies[randomIndex]
			}

			// replace
			const author = message.guild.members._cache.find(e=>e.user.toString()===message.author.toString())
			respondMessage = respondMessage.replaceAll('$number', Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
			respondMessage = respondMessage.replaceAll('$author', author.nickname?author.nickname:message.author.username)

			// responding
			return message.reply(respondMessage).catch((error)=>{
				if (!(error.rawError.code === '50013')) console.error(error)
				else console.log("Someone tried to do @heyy without giving heyy permission kek")
			})
		}

		if (message.mentions.has(process.env.CLIENT_ID)) {
			const guild = message.guild
			if(guild.id !== process.env.GUILD_ID) return randomReply(message)

			const member = await guild.members.fetch({ user: message.author.id, force: true })

			if (member.roles.cache.has('1015540320705978449')) {
				await refreshRoles(guild)
			}

			return randomReply(message).catch((error)=>{
				if (error.rawError && !(error.rawError.code === '50013')) console.error(error)
				else console.error(error)
			})
		}
	
	}
}
