const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction, user) {
        if(reaction.message.guild.id !== process.env.GUILD_ID) return;

		// When a reaction is received, check if the structure is partial
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

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

        if (reaction.message.id === '1097957268424773792') {
            for (let role of Roles) {
                if (role.emoji===reaction._emoji.id) {
                    const guild = reaction.message.guild

                    const roleElement = guild.roles.cache.find(
                        r => r.id === role.ID
                    )

                    const member = await guild.members.fetch({ user: user.id, force: true })

                    if (roleElement && !member.roles.cache.has(role.ID)) {
                        await member.roles.add(role.ID , `Adding roles`)
                        console.log(`Added ${role.name} to member ${user.id}`);
                    }

                    break;
                }
            }
        }
	}
}