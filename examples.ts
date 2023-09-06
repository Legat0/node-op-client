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
  CollectionStat,
  View,
  ViewsTypeEnum,
  Group,
  Principal
} from './src'
import _ from 'lodash'

dotenv.config()

const Config = {
  PROJECT_ID: 9,
  WP_ID: 2421,
  WP_EXTERNAL_ID: 'МТ-429',
  QUERY_ID: 70,
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

  get linkMarksGetter (): Array<LinkEntity<CustomOption>> {
    return this.getLinkArray('marks', CustomOption) ?? []
  }

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
      .filter((x): x is Mark => x != null)
  }

  get marksGetter (): Mark[] {
    return (
      this.linkMarksGetter
        ?.map((x) => x.parseSelf<Mark>())
        .filter((x): x is Mark => x != null) ?? []
    )
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
  console.table(wp.linkMarks, ['id'])
  console.table(wp.marks)
  console.table(wp.marksGetter)
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
  // 1. Получение проекта и мапинга полей
  const p = await ProjectExt.findOrFail(9)

  // const list = await QueryFilterInstanceSchema.getAll();
  const q = new Query()
  q.name = 'default'
  q.project = p

  const queryForm = await q.form() // OR  Query.form(q)

  console.table(
    queryForm.visibleFilterSchemas.map((x) => {
      return {
        id: x.allowedFilterValue.id,
        title: x.allowedFilterValue.self.title,
        operators: x.availableOperators.map((x) => x.id).join('|')
      }
    })
  )
  // Схема для поля Заказчик + оператор "="
  let schema = queryForm.visibleFilterSchemas.find((x) => x.id === p.fieldMap.contact_id)
  schema = schema?.resultingSchema('=')
  if (schema != null) {
    console.log({
      id: schema.id,
      title: schema.allowedFilterValue.self.title,
      values: schema.values?.type,
      allowedValues: schema.allowedValues?.length
    })
  }

  // Схема для поля author + оператор "="
  schema = queryForm.visibleFilterSchemas
    .find((x) => x.id === 'author')
    ?.resultingSchema('=')
  if (schema != null) {
    console.log({
      id: schema.id,
      title: schema.allowedFilterValue.self.title,
      values: schema.values?.type,
      allowedValues: schema.allowedValues?.length
    })
  }

  // Схема для поля attachmentContent + оператор "!~"
  schema = queryForm.visibleFilterSchemas
    .find((x) => x.id === 'attachmentContent')
    ?.resultingSchema('!~')
  if (schema != null) {
    console.log({
      id: schema.id,
      title: schema.allowedFilterValue.self.title,
      values: schema.values?.type,
      allowedValues: schema.allowedValues?.length
    })
  }

  // Список доступных значений для поля boards
  schema = queryForm.visibleFilterSchemas
    .find((x) => x.id === p.fieldMap.boards)
    ?.resultingSchema('=')
  console.table(schema?.allowedValues?.map(x => {
    return { id: x.id, value: x.value, title: x._links.self.title }
  }))

  // Схема для поля backlogsWorkPackageType + оператор "="
  schema = queryForm.visibleFilterSchemas
    .find((x) => x.id === 'backlogsWorkPackageType')
    ?.resultingSchema('=')
  if (schema != null) {
    console.log({
      id: schema.id,
      title: schema.allowedFilterValue.self.title,
      values: schema.values?.type,
      allowedValues: schema.allowedValues?.length
    })
    console.table(schema?.allowedValues?.map(x => {
      return { id: x.id, name: x.name, title: x._links.self.title }
    }))
  }
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

  console.table(
    list.map((x) => {
      return { id: x.id }
    })
  )
  console.table(stat)
  const list2 = await WPExt.request().addFilter('project', '=', Config.PROJECT_ID).addFilter('status', 'o').getMany({ pageSize: 20, offset: 1 }, stat)

  console.table(
    list2.map((x) => {
      return { id: x.id }
    })
  )
  console.table(stat)
  // console.table(_.pick(list, ['id']));

  console.time('getAll')
  const allWP = await WPExt.request()
    .addFilter('project', '=', [Config.PROJECT_ID])
    .select(['*'])
    .getAll({ pageSize: 100, threads: 10 })
  console.timeEnd('getAll')
  console.table({ total: allWP.length })
}

async function testSearchWP (): Promise<void> {
  const search: string = 'test1'
  const list = await WPExt.request().addFilter('search', '**', [search])
    .sortBy('updatedAt', 'desc')
    .offset(1)
    .pageSize(10)
    .getMany()

  console.table(list.map(wp => {
    return {
      id: wp.id,
      subject: wp.subject,
      externalId: wp.externalId,
      status: wp.status.self.title
    }
  }))
}

async function testGetQueries (): Promise<void> {
  // 1. Получение списка с фильтрацией по ID
  const queries = await Query.request().addFilter('id', '=', [Config.QUERY_ID]).getAll()
  console.table(queries.map(x => _.pick(x, ['id', 'name'])))
  // 2. Получение по ID + params
  const query = await Query.findOrFail(Config.QUERY_ID, { pageSize: 1 })
  console.log(_.pickBy(query, (v) => !_.isArray(v) && !_.isObject(v)))
  // 2.1 columns
  console.table(query.columns.map(x => _.pick(x, ['id', 'name'])))
  // 2.2 sortBy
  console.table(query.sortBy.map(x => {
    return {
      id: x.id,
      name: x.name,
      column: x.column.id,
      direction: x.direction
    }
  }))
  // 2.3 elements
  console.log(_.pick(query.results, ['total', 'count', 'pageSize', 'offset']))
  console.table(query.results.elements(WPExt).map(x => _.pick(x, ['id', 'subject', 'externalId'])))
  // 2.3.1 get pages elements with use refresh(params)
  await query.refresh({ offset: 2 })
  console.table(query.results.elements(WPExt).map(x => _.pick(x, ['id', 'subject', 'externalId'])))
  // 2.3.2 get pages elements with use getResultPage
  await query.loadResultPage(2)
  console.table(query.results.elements(WPExt).map(x => _.pick(x, ['id', 'subject', 'externalId'])))
  // 3. Получение по ID + custom filters
  const queryWithFilter = await Query.findOrFail(Config.QUERY_ID, { pageSize: 200, filters: [{ status: { operator: 'o' } }] })
  console.log(_.pick(queryWithFilter.results, ['total', 'count', 'pageSize', 'offset']))
  // 4. Загрузка всех задач в несколько потоков loadAllResults
  await queryWithFilter.loadAllResults({ threads: 6 })
  console.log({ elementsCount: queryWithFilter.results.body._embedded.elements.length, count: queryWithFilter.results.count })
}

async function testViews (): Promise<void> {
  // 1. Все views-WorkPackagesTable
  const allViews = await View.workPackagesTable().pageSize(20).getMany()
  console.table(allViews.map(x => {
    return {
      id: x.id,
      name: x.name,
      public: x.public,
      starred: x.starred,
      query: x.query.id,
      project: x.project?.id
    }
  }))

  // 2. Глобальные views-WorkPackagesTable
  const globalViews = await View.workPackagesTable().whereProjectNull().getAll()
  console.table(globalViews.map(x => {
    return {
      id: x.id,
      name: x.name,
      public: x.public,
      starred: x.starred,
      query: x.query.id
    }
  }))

  // 3. Локальные (в рамках проекта) views-WorkPackagesTable
  const programViews = await View.workPackagesTable().whereProject(Config.PROJECT_ID).pageSize(20).getMany()
  console.table(programViews.map(x => {
    return {
      id: x.id,
      name: x.name,
      public: x.public,
      starred: x.starred,
      query: x.query.id,
      project: x.project?.id
    }
  }))

  // 3. create view
  const query = new Query()
  query.name = 'expample-test'
  await query.save()
  const newView = new View()
  newView.type = ViewsTypeEnum.WorkPackagesTable
  newView.query = query
  await newView.create()
  console.table({ id: newView.id, name: newView.name, query: newView.query.id })
  await query.delete()
}

async function testQueryCRUD (): Promise<void> {
  // 1. create
  let query = new Query()
  query.name = 'example-query-create-test:' + JSON.stringify(new Date())
  query.public = false
  query.project = new Project(Config.PROJECT_ID)
  await query.save()
  // await query.create() // Or
  console.log(query.id)
  // 2. update
  query.name = 'example-query-update-test:' + JSON.stringify(new Date())
  await query.save()
  // await query.patch() // Or
  // 3. get
  query = await Query.findOrFail(query.id)
  console.log({ id: query.id, name: query.name, project: query.project?.id })
  // 4. delete
  await query.delete()
}

async function testGroup (): Promise<void> {
  // 1. get
  const groups = await Group.getAll()
  console.table(groups.map(g => _.pick(g, ['id', 'name'])))
}

async function testPrincipals (): Promise<void> {
  // 1. getAll
  let principals = await Principal.getAll({ pageSize: -1, select: ['*', 'elements/id', 'elements/name', 'elements/_type'] })
  console.table(principals.map(x => _.pick(x, ['id', 'name', 'type'])))
  // 2. get with filters by any_name_attribute
  const search = 'Разработчик'
  principals = await Principal.request().addFilter('any_name_attribute', '~', search).select(['id', 'name', '_type']).getMany({ pageSize: 20 })
  console.table(principals.map(x => _.pick(x, ['id', 'name', 'type'])))
}

async function main (): Promise<void> {
  await testPrincipals()
}

main().catch(console.error)
