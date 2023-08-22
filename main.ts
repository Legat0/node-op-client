import dotenv from "dotenv";

import {
  AuthTypeEnum,
  EntityManager,
  Field,
  Project,
  Status,
  WP,
  EntityCollectionElement,
  JsonField,
  Link,
  CustomOption,
  LinkEntity,
  LinkArray,
} from "./src";
import * as _ from "lodash";

dotenv.config();

class ProjectExt extends Project {
  /**   */
  @Field(process.env.REACT_APP__OP_PROJECT_EXTERNAL_ID_FIELD || "", String)
  externalId: string;

  @JsonField(process.env.REACT_APP__OP_PROJECT_FIELD_MAP_FIELD || "")
  fieldMap: Record<string, string>;
}

interface Mark {
  id: string;
  name: string;
  color: string;
}
class WPExt extends WP {
  /** Внешний ИД из Метеора  */
  @Field(process.env.REACT_APP__OP_WP_EXTERNAL_ID_FIELD || "", String)
  externalId: string;

  @LinkArray("marks", CustomOption)
  public linkMarks: LinkEntity<CustomOption>[];

  @Field("stage_date_finish", String)
  public stage_date_finish?: string;

  @Field("task_date_finish_id", String)
  public task_date_finish?: string;

  @Link("contact_id", CustomOption)
  public linkContact: LinkEntity<CustomOption>;

  @Field("doska_number", Number)
  public doska_number?: Number;

  get marks(): Mark[] {
    return this.linkMarks.map((x) => x.parseSelf<Mark>()).filter((x): x is Mark => !!x);
  }

  get contact(): object | undefined  {
    return this.linkContact.parseSelf();
  }
}

EntityManager.instance.useConfig({
  baseUrl: process.env.OP_BASE_URL,
  authType: AuthTypeEnum[process.env.OP_AUTH_TYPE || ""],
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
  const p = await ProjectExt.findOrFail(9);

  const wp = await WPExt.findOrFail(2421);
  wp.useMapField(p.fieldMap);

  
  console.log(p.fieldMap);
  
  console.table(wp.linkMarks.map( x => x.id));
  console.table(wp.marks);
  console.table(wp.contact);
  console.log(wp.stage_date_finish, wp.task_date_finish);
  // const list = await ProjectExt.getAll();
  // console.table(list.map(x => {
  //   return {id: x.id, name: x.name, externalId: x.externalId, map: x.fieldMap}
  //  }));

  //  const statusList = await Status.getAll();
  //  console.table(statusList.map(x => {
  //   return {id: x.id, name: x.name, externalId: x.externalId}
  //  }));

  // const map = new Map([['id', 'asc']])

  const wpList = await WP.request(undefined, p.fieldMap)
    .useMapField(p.fieldMap)
    .addFilter("project", "=", 9)
    // .addFilter("status", "=", [1])
    .addFilter("external_id", "=", ["МТ-429"])
    .sortBy("id", "desc")
    .pageSize(10)
    .offset(1)
    .getMany();

  // const wpList = await WP.getMany()

  console.table(
    wpList.map((x) => {
      return { id: x.id, subject: x.subject, assignee: x.assignee };
    })
  );
})();
