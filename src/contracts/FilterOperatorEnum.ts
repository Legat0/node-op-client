/** see https://www.openproject.org/docs/api/filters/ */

export enum FilterOperatorEnum {
  /** are equal to one of the given value(s) */
  IN = '=',

  ALL_VALUES = '&=',

}

export type FilterOperatorType =
'=' // are equal to one of the given value(s)
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
| 'w' // aare in this week | nothing, values is empty
| 't' // are today | nothing, values is empty
| '~' // are containing the given words (SQL LIKE) in that order | At least one string value
| '!~' // are not containing the given words (SQL LIKE) in that order | At least one string value
// Special operators for work packages
| 'o' // the status of the work package is open
| 'c' // the status of the work package is closed
| 'ow' // he work packages have a manual sort order
