import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import {AnswerService} from '../../../../../../services/answer/answer.service';
import { ErrorFrontService } from "../../../../../../services/error/error-front.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-admin-email-queue',
  templateUrl: 'admin-answers-gmail.component.html',
})
export class AdminAnswersGmailComponent implements OnInit {

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
              private _translateNotificationsService: TranslateNotificationsService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {

  }

  public importAnswers(file: File, event: Event) {
    event.preventDefault();
    this._answerService.importFromGmail(file)
      .subscribe((res: any) => {
        const total = (res.regSuccess || []).length + (res.regErrors || []).length;
        this._notificationsService.success('ERROR.SUCCESS', `${(res.regSuccess|| []).length}/${total} answers has been created`);
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      });
  }

  public autorizedActions(level: number): boolean {
    /*const adminLevel = this._authService.adminLevel;
    return adminLevel > level;*/
    return true;
  }


}
