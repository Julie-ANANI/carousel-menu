import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../../models/innovation';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import {Answer} from '../../../../../../models/answer';
import {isPlatformBrowser} from '@angular/common';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {AnswerService} from '../../../../../../services/answer/answer.service';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';

@Component({
  templateUrl: 'admin-project-follow-up.component.html',
})

export class AdminProjectFollowUpComponent implements OnInit {

  get isNewFollowUp(): boolean {
    return this._isNewFollowUp;
  }

  get validAnswers(): Array<Answer> {
    return this._validAnswers;
  }

  private _innovation: Innovation = <Innovation>{};

  private _accessPath: Array<string> = ['projects', 'project', 'followUp'];

  private _validAnswers: Array<Answer> = [];

  private _isNewFollowUp = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _rolesFrontService: RolesFrontService) { }

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.parent.data['innovation']
      && typeof this._activatedRoute.snapshot.parent.data['innovation'] !== undefined) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'] ;
      this._isNewFollowUp = !!(this._innovation && this._innovation.followUpEmails && this._innovation.followUpEmails.status);
      this._getValidAnswers();
    }
  }

  private _getValidAnswers() {
    if (isPlatformBrowser(this._platformId) && this._innovation._id && !this._isNewFollowUp) {
      this._answerService.getInnovationValidAnswers(this._innovation._id).pipe(first()).subscribe((response) => {
        this._validAnswers = response && response.answers || [];
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._validAnswers = [];
        console.error(err);
      });
    }
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

}
