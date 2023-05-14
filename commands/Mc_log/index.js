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
	const mcListener = async(ctx) => {
		console.log(ctx.content);
		if (ctx.member.user.bot === true) return;
		if (ctx.channel !== interaction.channel) return;
		await mcSpeaker(ctx.content, ctx);
	  };
	const action = interaction.options.getString('option');
	
	if (action === 'start') {
		await start();
		await interaction.reply('start!');

	} else if (action === 'stop'){
		await stop();
		await interaction.reply('stop!');

	} else if (action === 'connectToMinecraftChat'){
		if (connected !== true) {
			connected = true;

			await interaction.reply('connect!');
			interaction.client.on(Events.MessageCreate, mcListener)
			await connectToMinecraftChat(interaction);
		} else {
			await interaction.reply('It has already connected!')
		}
	// TODO: Disconnect未能斷開DC端傳送訊息至 Mc console
	} else if (action === 'disconnectToMinecraftChat'){
		
		if (connected !== false){
			connected = false;
			interaction.client.off(Events.MessageCreate, mcListener)
			await disconnectToMinecraftChat();
			await interaction.reply('disconnect!');
		} else {
			await interaction.reply('No connect available!')
		}
	}
	
}

export { data, execute };