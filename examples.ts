/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from 'dotenv'

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
  CollectionStat
} from './src'
import _ from 'lodash'

dotenv.config()

const Config = {
  PROJECT_ID: 9,
  WP_ID: 2421,
  WP_EXTERNAL_ID: 'МТ-429',
  PROJECT_FIELD_EXTERNAL_ID:
    process.env.REACT_APP__OP_PROJECT_FIELD_EXTERNAL_ID ?? 'customField1',
  PROJECT_FIELD_FIELD_MAP:
    process.env.REACT_APP__OP_PROJECT_FIELD_FIELD_MAP ?? '',
  WP_FIELD_EXTERNAL_ID: process.env.REACT_APP__OP_WP_FIELD_EXTERNAL_ID ?? '',
  WP_FIELD_SORT_INDEX: process.env.REACT_APP__OP_WP_FIELD_SORT_INDEX ?? ''
} as const

class ProjectExt extends Project {
  /** Внешний ИД из Метеора  */
  @Field(Config.PROJECT_FIELD_EXTERNAL_ID, String)
    externalId: string

  @JsonField(Config.PROJECT_FIELD_FIELD_MAP)
    fieldMap: Record<string, string>
}

interface Mark {
  id: string
  name: string
  color: string
}
class WPExt extends WP {
  /** Внешний ИД из Метеора  */
  @Field(Config.WP_FIELD_EXTERNAL_ID, String)
    externalId: string

  @LinkArray('marks', CustomOption)
  public linkMarks: Array<LinkEntity<CustomOption>>

  @Field('stage_date_finish', String)
  public stage_date_finish?: string

  @Field('task_date_finish_id', String)
  public task_date_finish?: string

  @Link('contact_id', CustomOption)
  public linkContact: LinkEntity<CustomOption>

  @Field(Config.WP_FIELD_SORT_INDEX, Number)
  public doska_number?: number

  get marks (): Mark[] {
    return this.linkMarks
      .map((x) => x.parseSelf<Mark>())
      .filter((x): x is Mark => (x != null))
  }

  get contact (): object | undefined {
    return this.linkContact.parseSelf()
  }
}

/** Настройка авторизации */
EntityManager.instance.useConfig({
  baseUrl: process.env.OP_BASE_URL,
  authType: (process.env.OP_AUTH_TYPE as AuthTypeEnum) ?? AuthTypeEnum.APIKEY,
  apiKeyOptions: {
    getApiKey: () => {
      return process.env.OP_API_KEY ?? ''
    }
  },
  oauthOptions: {
    clientId: process.env.OP_CLIENT_ID,
    clientSecret: process.env.OP_CLIENT_SECRET
  },
  threads: 1
})

/** Проект */
async function testProject (): Promise<void> {
  const p = await ProjectExt.findOrFail(Config.PROJECT_ID)
  console.log(p.fieldMap)
}

/** Получение доп полей задачи */
async function testWP (): Promise<void> {
  const p = await ProjectExt.findOrFail(Config.PROJECT_ID)

  const wp = await WPExt.findOrFail(Config.WP_ID)
  wp.useMapField(p.fieldMap)

  console.log(p.fieldMap)

  console.table(wp.linkMarks.map((x) => x.id))
  console.table(wp.marks)
  console.table(wp.contact)
  console.log(wp.stage_date_finish, wp.task_date_finish)
}

/** Фильтрация задач */
async function testWPFilters (): Promise<void> {
  const p = await ProjectExt.findOrFail(9)
  console.table(p.fieldMap)
  /** 1. Поиск задачи по полю (external_id) */
  let wp: WPExt | null
  /** 1.1 Через request + useMapField + addFilter */
  wp = await WPExt.request()
    .useMapField(p.fieldMap)
    .addFilter('external_id', '=', [Config.WP_EXTERNAL_ID])
    .first()
  console.table(_.pick(wp, 'id', 'externalId'))
  /** 1.2 Через findBy */
  wp = await WPExt.findBy(Config.WP_FIELD_EXTERNAL_ID, Config.WP_EXTERNAL_ID)
  console.table(_.pick(wp, 'id', 'externalId'))

  /** 2. Фильтр по id + доп. фильтры */
  wp = await WPExt.request()
    .addFilters([{ status: { operator: 'o' } }])
    .addFilter('id', '=', Config.WP_ID)
    .first()
  console.table(_.pick(wp, 'id', 'externalId'))

  /** 3. Все открыте задачи из Проекта + сортировка по доп полю "doska_number" + pageSize */
  let wpList = await WPExt.request(undefined, p.fieldMap)
    .useMapField(p.fieldMap)
    .addFilter('project', '=', Config.PROJECT_ID)
    .addFilter('status', 'o')
    .sortBy(Config.WP_FIELD_SORT_INDEX, 'desc') // OR .sortBy('doska_number', "desc")
    .pageSize(10)
    .offset(1)
    .getMany()

  console.table(
    wpList.map((x) => {
      return {
        id: x.id,
        externalId: x.externalId,
        project: x.project.id,
        doska_number: x.doska_number,
        subject: x.subject,
        assignee: x.assignee?.self.title,
        status: x.status.self.title
      }
    })
  )

  /** 4. Задачи проекта + фильтры */
  wpList = await p
    .workPackages(WPExt)
    .addFilter('status', 'o')
    .sortBy(Config.WP_FIELD_SORT_INDEX, 'desc')
    .pageSize(10)
    .getMany()

  console.table(
    wpList.map((x) => {
      return {
        id: x.id,
        externalId: x.externalId,
        project: x.project.id,
        doska_number: x.doska_number,
        subject: x.subject,
        status: x.status.self.title
      }
    })
  )
}

/** Форма фильтра */
async function testQueryForm (): Promise<void> {
  const p = await ProjectExt.findOrFail(9)
  // const list = await QueryFilterInstanceSchema.getAll();
  const q = new Query()
  q.name = 'default'
  q.project = p

  const form = await Query.form(q)

  console.table(
    form.visibleFilterSchemas.map((x) => {
      return {
        id: x.allowedFilterValue.id,
        title: x.allowedFilterValue.self.title,
        operators: x.availableOperators.map((x) => x.id).join('|')
      }
    })
  )

  let schema = form.visibleFilterSchemas.find((x) => x.id === 'customField15')
  schema = schema?.resultingSchema('=')
  console.log({
    id: schema?.id,
    values: schema?.values?.type,
    allowedValues: schema?.allowedValues?.length
  })

  schema = form.visibleFilterSchemas
    .find((x) => x.id === 'author')
    ?.resultingSchema('=')
  console.log({
    id: schema?.id,
    values: schema?.values?.type,
    allowedValues: schema?.allowedValues?.length
  })
  // _.pick(x, "allowedFilterValue.id", "allowedFilterValue.self.title")));
}

async function testUpdateWP (): Promise<void> {
  const wp = await WPExt.findOrFail(Config.WP_ID)
  wp.status = new Status(1)
  console.table({
    id: wp.id,
    status: wp.status.id,
    dirty: wp.$dirty.join('|')
  })
}

async function testGetWP (): Promise<void> {
  const p = await ProjectExt.findOrFail(9)
  const wp = await WPExt.findOrFail(Config.WP_ID)
  wp.useMapField(p.fieldMap)

  console.table({
    id: wp.id,
    externalId: wp.externalId,
    stage_date_finish: wp.stage_date_finish,
    linkContact: wp.linkContact.self.title,
    marks: wp.marks.map((x) => x.name).join('|')
  })
}

async function testGetAll (): Promise<void> {
  const stat = new CollectionStat()
  const list = await WPExt.getMany({ pageSize: 20, offset: 1 }, stat)

  console.table(list.map(x => {
    return { id: x.id }
  }))
  // console.table(_.pick(list, ['id']));
  console.table(stat)
  console.time('getAll')
  const allWP = await WPExt.request().addFilter('project', '=', [Config.PROJECT_ID]).select(['*']).getAll({ pageSize: 100, threads: 10 })
  console.timeEnd('getAll')
  console.table({ total: allWP.length })
}

async function main (): Promise<void> {
  await testGetAll()
}

main().catch(console.error)
