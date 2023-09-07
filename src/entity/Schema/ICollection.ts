export default interface ICollection<T> {
  _type: 'Collection'
  total: number
  count: number
  _embedded: {
    elements: T[]
  }
}
