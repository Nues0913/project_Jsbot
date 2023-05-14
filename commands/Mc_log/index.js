import { SlashCommandBuilder } from 'discord.js';
import { start, stop } from "./mc.js"


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
			));

async function execute(interaction) {
	const action = interaction.options.getString('option');

	if (action === 'start') {
		await start();
		await interaction.reply('start!');
		
	} else if (action === 'stop'){
		await stop();
		await interaction.reply('stop!');
	}
}

export { data, execute };