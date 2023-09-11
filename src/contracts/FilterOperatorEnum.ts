/** see https://www.openproject.org/docs/api/filters/ */

export enum FilterOperatorEnum {
  /** are equal to one of the given value(s) */
  in = '=',
  equal = '=',
  /** are containing all of the given value(s) */
  contains_all = '&=',
  /**  are not equal one of the given value(s) */
  not_in = '!',
  not_equal = '!',
  /**   are greater or equal than the given value | One numerical value */
  gte = '>=',
  /**   are lesser or equal than the given value | One numerical value */
  lte = '&lt;=',
  /**   are the given number of days in the past | 1 integer (days) */
  days_past = 't-',
  /**  are the given number of days in the future | 1 integer (days) */
  days_future = 't+',
  /** are less than the given number of days in the future | 1 integer (days) */
  lt_days_future = '<t+',
  /** are more than the given number of days in the future | 1 integer (days) */
  gt_days_future = '>t+',
  /**  are less than the given number of days in the past | 1 integer (days) */
  lt_days_past = '<t-',
  /** are more than the given number of days in the past | 1 integer (days) */
  gt_days_past = '>t-',
  /** are not NULL | nothing, values is empty */
  is_not_null = '*',
  /** are NULL | nothing, values is empty */
  is_null = '!*',
  /** searches the given string in all string-based attributes | One string value */
  search = '**',

  /** equal the given date | One ISO8601 date/datetime */
  date_equal = '=d',
  /**  are between the two given dates. | 2 ISO8601 date/datetimes */
  date_between = '<>d',
  /** are in this week | nothing, values is empty */
  this_week = 'w',
  /** are today | nothing, values is empty */
  today = 't',
  /** are containing the given words (SQL LIKE) in that order | At least one string value */
  like = '~',
  /** are not containing the given words (SQL LIKE) in that order | At least one string value */
  not_like = '~',

  // Special operators for work packages
  /** the status of the work package is open */
  wp_open = 'o',
  /** the status of the work package is closed */
  wp_closed = 'c',
  /** the work packages have a manual sort order */
  wp_manual_sort = 'ow',
}

export type FilterOperatorType = FilterOperatorEnum
| '=' // are equal to one of the given value(s)
| '&=' // are containing all of the given value(s)
| '!' // are not equal one of the given value(s)
| '>=' // are greater or equal than the given value | One numerical value
| '&lt;=' // are lesser or equal than the given value | One numerical value
| 't-' // are the given number of days in the past | 1 integer (days)
| 't+' // are the given number of days in the future | 1 integer (days)
| '<t+' // are less than the given number of days in the future | 1 integer (days)
| '>t+' // are more than the given number of days in the future | 1 integer (days)
| '>t-' // are less than the given number of days in the past | 1 integer (days)
| '<t-' // are more than the given number of days in the past | 1 integer (days)
| '*' // are not NULL | nothing, values is empty
| '!*' // are NULL | nothing, values is empty
| '**' // searches the given string in all string-based attributes | One string value
| '=d' // sare on the given date | One ISO8601 date/datetime
| '<>d' // are between the two given dates. | 2 ISO8601 date/datetimes
| 'w' // are in this week | nothing, values is empty
| 't' // are today | nothing, values is empty
| '~' // are containing the given words (SQL LIKE) in that order | At least one string value
| '!~' // are not containing the given words (SQL LIKE) in that order | At least one string value
// Special operators for work packages
| 'o' // the status of the work package is open
| 'c' // the status of the work package is closed
| 'ow' // the work packages have a manual sort order
