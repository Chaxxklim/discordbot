const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('재린').setDescription('왜라고 대답합니다.'),
	new SlashCommandBuilder().setName('뭐먹지').setDescription('아무거나 먹으라고 대답합니다.')

]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('성공.'))
	.catch(console.error);