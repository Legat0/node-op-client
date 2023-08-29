import BaseEntityAny from '../Abstract/BaseEntityAny'
import type IAbstractBody from '../Abstract/IAbstractBody'

const hidden: string[] = [
  'datesInterval',
  'precedes',
  'follows',
  'relates',
  'duplicates',
  'duplicated',
  'blocks',
  'blocked',
  'partof',
  'includes',
  'requires',
  'required',
  'search',
  // The filter should be named subjectOrId but for some reason
  // it is only named subjectOr
  'subjectOrId',
  'subjectOr',
  'manualSort',
  'typeahead'
]

export interface QueryFilterBody extends IAbstractBody<string> {
  _type?: 'QueryFilter'
}

export default class QueryFilter extends BaseEntityAny<string> {
  static url = '/api/v3/queries/filters'

  body: QueryFilterBody

  get isHidden (): boolean {
    return hidden.includes(this.id)
  }

  get isVisible (): boolean {
    return !this.isHidden && this.id !== ''
  }
}
