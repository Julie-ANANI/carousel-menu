/**
 * Created by Abhishek SAINI & Wei WANG on 9th Dec 2021
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Innovation} from '../../models/innovation';
import {NotificationTrigger} from '../../models/notification';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class NotificationService {

  constructor(private _httpClient: HttpClient) {}

  public registerJob(innovation: Innovation, trigger: NotificationTrigger): Observable<{ message: string }> {
    return this._httpClient.post<{ message: string }>('/notification/job', {innovation, trigger});
  }

}
