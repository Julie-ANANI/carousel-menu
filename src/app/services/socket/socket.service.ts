import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {Innovation} from '../../models/innovation';
import {Mission} from '../../models/mission';
import {ExecutiveReport} from '../../models/executive-report';
import {Answer} from '../../models/answer';
import {AbstractSocketService} from './abstract.socket.service';

@Injectable({
  providedIn: 'root'
})

export class SocketService extends AbstractSocketService {

  constructor() {
    super();
  }

  listenToSocket(): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on('hello', (data: any) => {
        subscriber.next(data);
      });
    });
  }

  getProjectUpdates(projectId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`innovationUpdate_${projectId}`,
        (data: {userName: string, userId: string, data: { [P in keyof Innovation]?: Innovation[P]; }}) => {
        subscriber.next(data);
      });
    });
  }

  getProjectFieldUpdates(projectId: string, field: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`innovationUpdate_${projectId}/${field}`,
        (data: {userName: string, userId: string, data: { [P in keyof Innovation]?: Innovation[P]; }}) => {
        subscriber.next(data);
      });
    });
  }

  getMissionUpdates(missionId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`missionUpdate_${missionId}`,
        (data: {userName: string, userId: string, data: { [P in keyof Mission]?: Mission[P]; }}) => {
        subscriber.next(data);
      });
    });
  }

  getReportUpdates(executiveReportId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`erUpdate_${executiveReportId}`,
        (data: {userName: string, userId: string, data: { [P in keyof ExecutiveReport]?: ExecutiveReport[P]; }}) => {
        subscriber.next(data);
      });
    });
  }

  getNewReport(innovationId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`erCreation_${innovationId}`,
        (data: {userName: string, userId: string, data: ExecutiveReport}) => {
        subscriber.next(data);
      });
    });
  }

  getNewCampaign(innovationId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`campaignCreation_${innovationId}`,
        (data: {userName: string, userId: string, data: ExecutiveReport}) => {
        subscriber.next(data);
      });
    });
  }

  getAnswersUpdates(innovationId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`answerUpdate_${innovationId}`,
        (data: {userName: string, userId: string, data: Answer}) => {
        subscriber.next(data);
      });
    });
  }
}
