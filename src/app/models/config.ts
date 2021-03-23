export interface Config {
  fields: string;
  limit: string;
  offset: string;
  search: string;
  sort: string;
  status?: string;
  isPublic?: string;
  campaigns?: string;
  isDiscover?: string;
  operator?: string;
  fromCollection?: string;
  missionMember?: string;
  [property: string]: string;
}
