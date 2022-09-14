import { createClient } from 'redis';
const Client = createClient();
Client.on('error', (err) => console.log('Redis Client Error', err));
Client.connect();

export default Client;
