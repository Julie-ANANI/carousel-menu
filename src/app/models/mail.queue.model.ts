/**
 * Created by juandavidcruzgomez on 04/12/2017.
 */

export interface EmailQueueModel {

  readonly _id: string;
  readonly status: string;
  readonly service: string;
  readonly creationDate: number;
  readonly startDate: number;
  readonly endDate: number;
  readonly priority: number;
  readonly payload: any;

}
