import { EntityManager, AuthTypeEnum } from "../src/EntityManager/EntityManager";
import dotenv from "dotenv";

dotenv.config();

EntityManager.instance.useConfig({
  baseUrl: process.env.OP_BASE_URL,
  authType: AuthTypeEnum[process.env.OP_AUTH_TYPE||''],
  apiKeyOptions: {
    getApiKey: () => {
      return process.env.OP_API_KEY || "";
    },
  },
  oauthOptions: {
    clientId: process.env.OP_CLIENT_ID,
    clientSecret: process.env.OP_CLIENT_SECRET,
  },
});

export default EntityManager.instance;
