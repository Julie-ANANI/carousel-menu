import { User } from './user.model';

export interface ClientProject {
  readonly _id?: string;
  readonly created?: string;
  readonly updated?: string;

  /**
   * if the client deleted the project we make the status of the mission Hidden
   * instead of deleting it. (back takes care of it.)
   */
  readonly status?: 'PUBLISHED' | 'HIDDEN';
  /**
   * commercial assigned to the client project.
   */
  commercial?: User;
  /**
   * same as the owner of the project that has created the project.
   */
  client?: User | string;
  /**
   * stores the link of different tests for the same project.
   */
  marketTests?: Array<string>;

  /**
   * name of the client project
   */
  name: string;

  /**
   * for code use the 'Page name' like 'NEW_PROJECT' when save any step dates.
   * like while creating the new project we are using the code 'NEW_PROJECT'.
   */
  roadmapDates: Array<{
    name: string;
    code: string;
    date: Date;
  }>;

}
