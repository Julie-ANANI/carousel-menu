import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import {AnswerService} from '../../../../../../services/answer/answer.service';

@Component({
  selector: 'app-admin-email-queue',
  templateUrl: 'admin-answers-gmail.component.html',
})
export class AdminAnswersGmailComponent implements OnInit {

  public importAnswers(file: File, event: Event) {
    event.preventDefault();
    this._answerService.importFromGmail(file)
      .subscribe((res: any) => {
        const total = (res.regSuccess || []).length + (res.regErrors || []).length;
        this._notificationsService.success('ERROR.SUCCESS', `${(res.regSuccess|| []).length}/${total} answers has been created`);

      }, (err: any) => {
        this._notificationsService.error('ERROR.ERROR', err.message);
      });
  }

  public autorizedActions(level: number): boolean {
    /*const adminLevel = this._authService.adminLevel;
    return adminLevel > level;*/
    return true;
  }

  /*user _queueList: {mailqueues: Array<EmailQueueModel>, _metadata: any} = {
    mailqueues: [],
    _metadata: {}
  };*/

  /*user _config = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };*/

  constructor(private _answerService: AnswerService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {

  }


}
