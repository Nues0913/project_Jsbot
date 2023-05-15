import { Events, SlashCommandBuilder } from 'discord.js';
import { start, stop, connectToMinecraftChat, disconnectToMinecraftChat, mcSpeaker } from "./mc.js"


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

let connected = false


async function execute(interaction) {
	const action = interaction.options.getString('option');
	let listener_index = -1

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
				await mcSpeaker(ctx.content, ctx)
			});
			listener_index = interaction.client.listeners(Events.MessageCreate).length-1
			await connectToMinecraftChat(interaction);
			connected = true;
		} else {
			await interaction.reply('It has already connected!')
		}
		
	} else if (action === 'disconnectToMinecraftChat'){
		if (connected !== false){
			interaction.client.off(Events.MessageCreate, interaction.client.listeners(Events.MessageCreate).at(listener_index));
			await disconnectToMinecraftChat();
			await interaction.reply('disconnect!');
			connected = false;
		} else {
			await interaction.reply('No connect available!')
		}
	}
	
}

export { data, execute };