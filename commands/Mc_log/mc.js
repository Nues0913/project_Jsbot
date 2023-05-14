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
	console.error(e.message)
}};


export {start, stop};
// server.subscribe("console");
// server.on("console:line", (data) =>
//	 console.log(data.line)
// );