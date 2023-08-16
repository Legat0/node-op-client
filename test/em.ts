import {EntityManager} from "../src/EntityManager/EntityManager";
import dotenv from "dotenv";

dotenv.config();


export default new EntityManager({
  baseUrl: process.env.OP_BASE_URL,
  authType: process.env.OP_AUTH_TYPE === 'APIKEY' ? 'APIKEY' : 'OAUTH',
  apiKeyOptions: {
    getApiKey: () => { return process.env.OP_API_KEY || ''}
  },  
  oauthOptions: {
    clientId: process.env.OP_CLIENT_ID,
    clientSecret: process.env.OP_CLIENT_SECRET,
  }
});
