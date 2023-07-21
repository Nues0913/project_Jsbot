import { Events, SlashCommandBuilder } from 'discord.js';
import { start, stop, connectToMinecraftChat, disconnectToMinecraftChat, mcSpeaker } from "./mc.js"
import fs from 'node:fs';
let jsData = fs.readFileSync('commands/Mc_log/channel.json','utf-8');
let channelData = JSON.parse(jsData);
let connected = false;

const channelId = channelData.channel;
	const data = new SlashCommandBuilder()
	.setName('mc_server')
	.setDescription('server controler')
	.addStringOption(option =>
		option.setName('option')
			.setDescription('The action')
			.setRequired(true)
			.addChoices(
				{ name: 'start', value: 'start' },
				{ name: 'stop', value: 'stop' },
				{ name: 'connectToMinecraftChat', value: 'connectToMinecraftChat' },
				{ name: 'disconnectToMinecraftChat', value: 'disconnectToMinecraftChat' },
			));


let obj_listener = {}

async function execute(interaction) {
	const action = interaction.options.getString('option');

	if (action === 'start') {
		await start(); 
		await interaction.reply('start!');

	} else if (action === 'stop'){
		await stop();
		await interaction.reply('stop!');

	} else if (action === 'connectToMinecraftChat'){
		if (connected !== true) {
			await interaction.reply('connect!');
			interaction.client.on(Events.MessageCreate, async(ctx) => {
				if (ctx.member.user.bot === true) return;
				if (ctx.channel !== interaction.channel) return;
				await mcSpeaker(ctx.content, ctx, interaction.channel);
			});
			obj_listener['mcListener'] = interaction.client.listeners(Events.MessageCreate).at(-1);
			await connectToMinecraftChat(interaction.channel);
			channelData['channel'] = interaction.channel.id;
			jsData = JSON.stringify(channelData);
			fs.writeFileSync('commands/Mc_log/channel.json', jsData, 'utf-8');
			connected = true;
			
		} else {
			await interaction.reply('It has already connected!');
		}
		
	} else if (action === 'disconnectToMinecraftChat'){
		if (connected !== false){
			// interaction.client.off(Events.MessageCreate, obj_listener['mcListener']);
			interaction.client.removeAllListeners(Events.MessageCreate);
			await disconnectToMinecraftChat();
			await interaction.reply('disconnect!');
			delete channelData['channel'];
			jsData = JSON.stringify(channelData);
			fs.writeFileSync('commands/Mc_log/channel.json', jsData, 'utf-8');
			connected = false;
			
		} else {
			await interaction.reply('No connect available!');
		}
	}
	
}

/** 
 *MC channel preloader
 */
const channelPreloader = async (client) =>{
	if (Object.keys(channelData).length !== 0){
		
		connected = true;
		const channel = await client.channels.fetch(channelId);
		client.on(Events.MessageCreate, async(ctx) => {
				if (ctx.member.user.bot === true) return;
				if (ctx.channel !== channel) return;
				await mcSpeaker(ctx.content, ctx, channel);
			});
		await connectToMinecraftChat(channel);
	}
}






export { data, execute, channelPreloader };