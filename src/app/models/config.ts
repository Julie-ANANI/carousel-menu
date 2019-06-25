export interface Config {
  fields: string;
  limit: string;
  offset: string;
  search: string;
  sort: string;
  status?: string;
  isPublic?: string;
  [property: string]: string;
}
