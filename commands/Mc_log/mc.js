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
	server.subscribe('console');
	server.on("console:line", async (data) => {
    if (data.line.includes(' [Not Secure] ')){
		// Let it don't repeat the msg sent
		if (!data.line.includes('[Server] <')){
			const msg = data.line;
			await interaction.channel.send(msg.slice(0,11) + msg.slice(msg.indexOf(' [Not Secure] ')+14,))
		}
    }
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

const mcSpeaker = async (content, ctx, interaction) => { try {
		let talker = interaction.user.username
		await server.executeCommand("say " + `<${talker}> ${content}`);
	} catch (error) {
		console.log(error.message)
	}
}

export {start, stop, connectToMinecraftChat, disconnectToMinecraftChat, mcSpeaker };
// server.subscribe("console");
// server.on("console:line", (data) =>
//	 console.log(data.line)
// );