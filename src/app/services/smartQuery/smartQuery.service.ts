import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SmartQueryService {

  private _config: any;
  private _route: string;
  private _data = new Subject<any>();

  constructor(private _http: Http) {
    this._config = {
      fields: '',
      limit: 10,
      offset: 0,
      search: {},
      sort: {
        created: -1
      }
    };
  }

  public setRoute(route: string) {
    this._route = route;
  }
  
  get data$ (): Observable<any> {
    return this._data.asObservable();
  }
  
  public getData() {
    this._http.get(this._route, {params: this._config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()))
      .subscribe(data => this._data.next(data));
  }

  public sortBy(key: string, order: number) {
    this._config.sort = {};
    if (order == 1 || order == -1) {
      this._config.sort[key] = order;
    }
    this.getData();
  }

  public search(key: string, value: any) {
    if (this._config.search[key] && value == "") {
      delete this._config.search[key]
    } else {
      if (value != "") {
        this._config.search[key] = value;
      }
    }
    this.getData();
  }

  public goToPage(number: number) {
    this._config.offset = this._config.limit * (number - 1);
    return this.getData();
  }

  public numPerPage(number: number) {
    this._config.limit = number;
    return this.getData();
  }
}
