/**
 * for the advanceSearch pass the object like this
 * ex: mission: [{key: 'Type', value: 'User'}, {key: 'Objective.principal.en', value: 'Detecting need'}]
 * mission - is the collection name
 */
export interface Config {
  fields: string;
  limit: string;
  offset: string;
  search: string;
  sort: string;
  status?: string; // to remove
  isPublic?: string; // to remove
  campaigns?: string; // to remove
  isDiscover?: string; // to remove
  operator?: string; // to remove
  fromCollection?: string; // to remove
  missionMember?: string; // to remove
  advanceSearch?: string;
  [property: string]: any; // to remove
}
