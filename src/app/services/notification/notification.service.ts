/**
 * Created by Abhishek SAINI & Wei WANG on 9th Dec 2021
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Innovation} from '../../models/innovation';
import {NotificationJob, NotificationTrigger} from '../../models/notification';
import {Observable} from 'rxjs';
import {Response} from '../../models/response';
import {UmiusConfigInterface} from '@umius/umi-common-component';

@Injectable({providedIn: 'root'})
export class NotificationService {

  constructor(private _httpClient: HttpClient) {}

  public getAllJobs(config?: UmiusConfigInterface): Observable<Response> {
    return this._httpClient.get<Response>('/notification/job/all', {params: config});
  }

  public registerJob(innovation: Innovation, trigger: NotificationTrigger):
    Observable<{message: string, job: NotificationJob}> {
    return this._httpClient.post<{message: string, job: NotificationJob}>('/notification/job', {innovation, trigger});
  }

}
