export interface Query {
  collection: string;
  key?: string;
  search?: string;
  fields?: string;
  limit?: string;
  offset?: string;
  sort?: string;
}
