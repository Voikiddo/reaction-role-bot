const fs = require('node:fs');
const path = require('node:path');
var bodyParser = require('body-parser')
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
require("dotenv").config()

/* EXPRESS */

const express = require("express");
const { log } = require('node:console');
const app = express();
const port = 8080;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", function (req, res) {
  res.send("Bot currently running :D");
});

app.get("/reactions", (req, res) => {
	res.sendFile(__dirname + "/assets/responds.json")
})

app.post('/reactions', (req, res) => {
	// auth
	if (req.query.auth !== process.env.API_TOKEN) {
		res.status(401).send("Unauthorized")
		return
	}

	// only add response without trigger
	let data = req.body;
	console.log(data);
	if (data.has_trigger === 'true') {
		res.send('Data Received: ' + JSON.stringify(data) + ". Haven't coded it in yet sorry.");
		return
	}

	// open file
	const respondsJSONPath = path.join(__dirname, '/assets/responds.json');
	let responses = JSON.parse(fs.readFileSync(respondsJSONPath))

	// check if it already exists
	if (responses.content.no_trigger.includes(data.response)) {
		res.status(400).send("Response already exists!")
		return
	}

	// add the response to file
	responses.content.no_trigger.push(data.response)
	fs.writeFileSync(respondsJSONPath, JSON.stringify(responses))

	// success
	res.send('Data Received: ' + JSON.stringify(data) + ". Data updated.");
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

/* DISCORDJS */

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);