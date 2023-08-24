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
  User,
  QueryFilterInstanceSchema,
  Query,
} from "./src";
import _ from "lodash";

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
    return this.linkMarks
      .map((x) => x.parseSelf<Mark>())
      .filter((x): x is Mark => !!x);
  }

  get contact(): object | undefined {
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

async function testProject() {
  const p = await ProjectExt.findOrFail(9);
  console.log(p.fieldMap);
}

async function testWP() {
  const p = await ProjectExt.findOrFail(9);

  const wp = await WPExt.findOrFail(2421);
  wp.useMapField(p.fieldMap);

  console.log(p.fieldMap);

  console.table(wp.linkMarks.map((x) => x.id));
  console.table(wp.marks);
  console.table(wp.contact);
  console.log(wp.stage_date_finish, wp.task_date_finish);
}

async function testWPFilters() {
  const p = await ProjectExt.findOrFail(9);
  const wpList = await WP.request(undefined, p.fieldMap)
    .useMapField(p.fieldMap)
    .addFilter("project", "=", 9)
    // .addFilter("status", "=", [1])
    .addFilter("external_id", "=", ["МТ-429"])
    .sortBy("id", "desc")
    .pageSize(10)
    .offset(1)
    .getMany();

  console.table(
    wpList.map((x) => {
      return { id: x.id, subject: x.subject, assignee: x.assignee };
    })
  );
}

async function testQueryForm() {
  const p = await ProjectExt.findOrFail(9);
  // const list = await QueryFilterInstanceSchema.getAll();
  const q = new Query();
  q.name = "default";
  q.project = p;
  const form = await Query.form(q);

  const filterFields =
    form.body._embedded.schema._embedded.filtersSchemas._embedded.elements.map(
      (x) => {
        const queryFilter = x.filter._embedded?.allowedValues?.[0];
        return { id: queryFilter?.id, title: queryFilter?._links.self.title };
      }
    );

  console.table(
    form.visibleFilterSchemas.map((x) => {
      return {
        id: x.allowedFilterValue.id,
        title: x.allowedFilterValue.self.title,
        operators: x.availableOperators.map((x) => x.id).join("|"),
      };
    })
  );
  let schema = form.visibleFilterSchemas.find((x) => x.id === "customField15");
  schema = schema?.resultingSchema("=");
  console.log({
    id: schema?.id,
    values: schema?.values?.type,
    allowedValues: schema?.allowedValues?.length,
  });
  schema = form.visibleFilterSchemas
    .find((x) => x.id === "author")
    ?.resultingSchema("=");
  console.log({
    id: schema?.id,
    values: schema?.values?.type,
    allowedValues: schema?.allowedValues?.length,
  });
  // _.pick(x, "allowedFilterValue.id", "allowedFilterValue.self.title")));
}

(async function main() {
  await testQueryForm();
})();
