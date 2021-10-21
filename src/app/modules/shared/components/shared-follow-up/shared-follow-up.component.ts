import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../models/innovation';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import { AnswerService } from '../../../../services/answer/answer.service';
import { Answer } from '../../../../models/answer';
import {first} from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { ResponseService } from '../shared-market-report/services/response.service';
import { Tag } from '../../../../models/tag';
import { TagsFiltersService } from '../shared-market-report/services/tags-filter.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../services/error/error-front.service';
import { RolesFrontService } from '../../../../services/roles/roles-front.service';
import {MissionQuestion} from '../../../../models/mission';
import {Question} from '../../../../models/question';

/**
 * ADMIN: old version for the admin side
 * CLIENT: added on 1st oct, 2021 for the client side
 */
type template = 'ADMIN' | 'CLIENT' | '';

@Component({
  selector: 'app-shared-follow-up',
  templateUrl: './shared-follow-up.component.html',
  styleUrls: ['./shared-follow-up.component.scss']
})

export class SharedFollowUpComponent implements OnInit {

  set answers(value: Array<Answer>) {
    this._answers = value;
  }

  get startContactProcess(): boolean {
    return this._startContactProcess;
  }

  set startContactProcess(value: boolean) {
    this._startContactProcess = value;
  }

  @Input() template: template = '';

  // ex: ['projects', 'project', 'followUp']
  @Input() accessPath: Array<string> = [];

  @Input() set project(value: Innovation) {
    if (value && value._id) {
      this._project = value;
    }
  }

  private _project: Innovation = <Innovation>{};

  private _questions: Array<MissionQuestion | Question> = [];

  private _answers: Array<Answer> = [];

  private _startContactProcess = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _answerService: AnswerService,
              private _tagFiltersService: TagsFiltersService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit(): void {
    if (this._project && this._project._id) {
      this._project.followUpEmails = this._project.followUpEmails || {};
      this._questions = InnovationFrontService.questionsList(this._project);
      this.getAnswers();
    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath);
    }
  }

  public getAnswers() {
    if (isPlatformBrowser(this._platformId)) {
      this._answerService.getInnovationValidAnswers(this._project._id)
        .pipe(first())
        .subscribe((response) => {

          this._answers = response && response.answers && response.answers.map((answer: Answer) => {
            answer.followUp = answer.followUp || {};
            return answer;
          }) || [];

          /*
           * compute tag list globally
           */
          const tagsDict = response.answers.reduce(function (acc, answer) {
            answer.tags.forEach((tag) => {
              if (!acc[tag._id]) {
                acc[tag._id] = tag;
              }
            });
            return acc;
          }, {} as { [id: string]: Tag });

          this._tagFiltersService.tagsList = Object.keys(tagsDict).map((k) => tagsDict[k]);

          /*
           * compute tags lists for each questions of type textarea
           */
          this._questions.forEach((question) => {
            const tags = ResponseService.tagsList(response.answers, question);
            const identifier = (question.controlType === 'textarea') ? question.identifier : question.identifier + 'Comment';
            this._tagFiltersService.setAnswerTags(identifier, tags);
          });

        }, (err: HttpErrorResponse) => {
          this._answers = [];
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          console.error(err);
        });
    }
  }

  get project(): Innovation {
    return this._project;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get questions(): Array<any> {
    return this._questions;
  }

}
