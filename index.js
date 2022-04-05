//API 버전 확인해볼것
//돌아가긴 하는데 유튜브가...
// async, await 공부할것
// const { Client, Intents } = require('discord.js');
const { token, youtube_key } = require('./config.json');
// const client = new Client({ intents : [Intents.FLAGS.GUILDS] });
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS]
});
const ytdl = require("discord-ytdl-core");
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, SubscriptionStatus } = require('@discordjs/voice');
const player = createAudioPlayer();


const Youtube = require('youtube-node');
const youtube = new Youtube();
//YouTube Data API v3 개인key값
youtube.setKey(youtube_key);

//봇 서버 시작될 때 한번만 실행
client.once('ready', ()=> { 
    console.log('심재린 준비완료');
})

//else
const fs = require('fs');
const { join } = require('path');
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const youtubeInfo_embed = {
    color: '#00fa9a',
    title: '재생목록에 추가됨!',
    description: ''
};

//state
client.on('ready', () => {
    console.log('심재린 작동중...');
    client.user.setActivity('찢재명 지지', { type: 'PLAYING' })
});

//shardError
client.on('shardError', error => {
    console.log('여기부터 에러입니다;');
	console.error('A websocket connection encountered an error:', error);
});

//msg
client.on('messageCreate', async msg => {
    if (msg.content.indexOf('-p ') != -1) {
        msg.react('👌')
        let keyword = msg.content.substr(2).trim()
        console.log(keyword)
        let url = ''

        //// 검색 옵션
        youtube.addParam('type', 'video');

        //search
        youtube.search(keyword, 1, (err, result) => {
            if (err) {
                msg.reply('오류가 발생했습니다!')
            }
            let title = result["items"][0]["snippet"]["title"];
            url = `https://www.youtube.com/watch?v=${result["items"][0]["id"]["videoId"]}`

            let stream = ytdl(url, {
                filter: "audioonly",
                opusEncoded: true,
                encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
            });

            const connection = joinVoiceChannel({
                channelId: msg.member.voice.channel.id,
                guildId: msg.guild.id,
                adapterCreator: msg.guild.voiceAdapterCreator
            })

            let resource = createAudioResource(stream);
            player.play(resource)
            player.on("error", console.error);
            connection.subscribe(player)

            msg.reply('재생합니다!')
        });
    } else if (msg.content == '-stop') {
        player.stop()
        msg.react('🛑')
        msg.reply('재생을 중지합니다!')
    } else if (msg.content == '-pause') {
        player.pause()
        msg.react('⏸')
        msg.reply('일시정지합니다!')
    } else if (msg.content == '-play') {
        player.unpause()
        msg.react('⏯')
        msg.reply('다시 재생합니다!')
    }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === '재린') {
		await interaction.reply('이재명 화이팅!');
	} else if (commandName === '뭐먹지'){
        await interaction.reply('아무거나 먹어라');
    }

	if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

});



client.login(token);