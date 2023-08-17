import dotenv from 'dotenv'
import { AuthTypeEnum, EntityManager, Field, Project, Status, WP } from "./src";
import _ from 'lodash'

dotenv.config()


class ProjectExt extends Project {
  @Field(process.env.OP_PROJECT_EXTERNAL_ID_FIELD, String)
  externalId: string
}



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


(async function main() { 
  //  (await WP.findOrFail(1)).author

    const list = await ProjectExt.getAll();
    console.table(list.map(x => { 
      return {id: x.id, name: x.name, externalId: x.externalId}
     }));
    
     const statusList = await Status.getAll();
     console.table(statusList.map(x => { 
      return {id: x.id, name: x.name, externalId: x.externalId}
     }));

    // const map = new Map([['id', 'asc']])
  
     const wpList = await WP.request()
     .addFilter('project', '=', 2)
     .addFilter('status', '=', [ 1 ])
     .sortBy('id', 'desc')
     .pageSize(10)
     .offset(1)
     .getMany()

     console.table(wpList.map(x => { 
      return {id: x.id, name: x.subject, assignee: x.assignee.id, author: x.author.id, status: x.status.id}
     }));
 
})()

