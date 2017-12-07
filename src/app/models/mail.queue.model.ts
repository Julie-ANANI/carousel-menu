/**
 * Created by juandavidcruzgomez on 04/12/2017.
 */
import { Model } from './model';

export class EmailQueueModel extends Model {

  private _id: string;
  private _status: string;
  private _service: string;
  private _creationDate: number;
  private _startDate: number;
  private _endDate: number;
  private _priority: number;
  private _payload: any;

  constructor(queue?: any) {
    super(queue);
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get service(): string {
    return this._service;
  }

  set service(value: string) {
    this._service = value;
  }

  get creationDate(): number {
    return this._creationDate;
  }

  set creationDate(value: number) {
    this._creationDate = value;
  }

  get startDate(): number {
    return this._startDate;
  }

  set startDate(value: number) {
    this._startDate = value;
  }

  get endDate(): number {
    return this._endDate;
  }

  set endDate(value: number) {
    this._endDate = value;
  }

  get priority(): number {
    return this._priority;
  }

  set priority(value: number) {
    this._priority = value;
  }

  get payload(): any {
    return this._payload;
  }

  set payload(value: any) {
    this._payload = value;
  }
}
