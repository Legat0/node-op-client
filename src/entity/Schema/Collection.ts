
export default interface Collection<T> {
  _type: "Collection";
  total: number;
  count: number;
  _embedded: {
    elements: T[];
  };
}

