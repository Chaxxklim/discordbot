// const { Client, Intents } = require('discord.js');
const { token, youtube_key } = require('./config.json');
// const client = new Client({ intents : [Intents.FLAGS.GUILDS] });
//test

const { Client, Collection, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS]
});
const ytdl = require("discord-ytdl-core");
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, SubscriptionStatus } = require('@discordjs/voice');
const player = createAudioPlayer();

//봇 서버 시작될 때 한번만 실행
client.once('ready', ()=> { 
    console.log('심재린 준비완료');
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === '재린') {
		await interaction.reply('이재명 화이팅!');
	} else if (commandName === '뭐먹지'){
        await interaction.reply('아무거나 먹어라');
    }
});



client.login(token);