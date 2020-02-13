import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ExecutiveReport} from '../../../../models/executive-report';
// import { Innovation } from '../../../../models/innovation';
// import { Answer } from '../../../../models/answer';
// import { AnswerService } from '../../../../services/answer/answer.service';
// import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-shared-executive-report',
  templateUrl: './shared-executive-report.component.html',
  styleUrls: ['./shared-executive-report.component.scss']
})

export class SharedExecutiveReportComponent {

  @Input() set executiveReport(value: ExecutiveReport) {
    this._executiveReport = value;
  }

  @Output() executiveReportChange: EventEmitter<ExecutiveReport> = new EventEmitter<ExecutiveReport>();

  private _executiveReport: ExecutiveReport = <ExecutiveReport>{};

  /*@Input() set project(value: Innovation) {
    this._innovation = value;
    this._anonymousAnswers = !!this._innovation._metadata.campaign.anonymous_answers;
    this._getAnswers();
  }*/

  /*private _innovation: Innovation = {};

  private _firstPageSections = [0, 1, 2, 3];

  private _secondPageSections = [4, 5, 6, 7];

  private _answers: Array<Answer> = [];

  private _anonymousAnswers = false;*/

  constructor (/*private _answerService: AnswerService,
               private _translateNotificationsService: TranslateNotificationsService*/) { }

  /*private _getAnswers() {
    if (this._innovation) {
      this._answerService.getInnovationValidAnswers(this._innovation._id).subscribe((response) => {
        this._answers = response.answers.sort((a, b) => {
          return b.profileQuality - a.profileQuality;
        });

        if( this._anonymousAnswers ) {
          this._answers = <Array<Answer>>this._answers.map( answer => {
            const _answer = {};
            Object.keys(answer).forEach(key => {
              switch(key) {
                case('company'):
                  _answer[key] = {
                    'name': ''
                  };
                  break;
                case('professional'):
                    if (answer[key]['company']) {
                      _answer[key] = {
                        'company': ''
                      };
                    }
                  break;
                default:
                  _answer[key] = answer[key];
              }
            });
            return _answer;
          });
        }

      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR_EN');
      });
    }
  }*/

  /*get innovation(): Innovation {
    return this._innovation;
  }*/

  /*get firstPageSections(): number[] {
    return this._firstPageSections;
  }*/

  /*get secondPageSections(): number[] {
    return this._secondPageSections;
  }*/

  /*get answers(): Array<Answer> {
    return this._answers;
  }*/

  get executiveReport(): ExecutiveReport {
    return this._executiveReport;
  }

}
