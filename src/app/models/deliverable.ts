import { JobType } from './job';

export interface Deliverable {
  owner: string;
  innovationId: string;
  jobType: JobType;
  resourceUrl: string;
}
