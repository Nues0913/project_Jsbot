import dotenv from 'dotenv';
import { Client } from 'exaroton';

dotenv.config();
const EXAROTON_TOKEN = process.env.EXAROTON_TOKEN;
const client = new Client(EXAROTON_TOKEN);
const server = client.server("7CRThZgPBJnB3C4K");


const start = async () => {try {
	await server.start();
} catch (e) {
	console.error(e.message);
}};


const stop = async() => {try{
	await server.stop();
} catch (e) {
	console.error(e.message);
}};


const connectToMinecraftChat = async(interaction) => {
	if (server.isOn) {
		await interaction.reply('Chat bridge can not be started twice.');
		return;
	}
	server.subscribe('console');
	server.on("console:line", async (data) => {
		console.log(data.line)
		await interaction.channel.send(data.line);
	});
}

const disconnectToMinecraftChat = async() => {
	server.unsubscribe('console');
	server.removeAllListeners()
	server.off("console:line", async (data) => {
		console.log(data.line)
		await interaction.channel.send(data.line);
	});
}

const mcSpeaker = async (content, ctx) => { try {
		await server.executeCommand("say " + content);
	} catch (error) {
		await ctx.channel.send(error.message);
	}
}

export {start, stop, connectToMinecraftChat, disconnectToMinecraftChat, mcSpeaker };
// server.subscribe("console");
// server.on("console:line", (data) =>
//	 console.log(data.line)
// );