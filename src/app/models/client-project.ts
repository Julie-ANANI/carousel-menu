export interface ClientProject {
  name: string;
  commercial: string;
  client: string;
  marketTests: Array<string>;
  roadmapDates: Array<{
    name: string;
    code: string;
    date: Date;
  }>
}
