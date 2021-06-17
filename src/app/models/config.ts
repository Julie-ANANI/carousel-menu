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
  fromCollection?: {
    model: string;
    [property: string]: string;
  };
  missionMember?: string;
  country?: string;
  [property: string]: any;
}
