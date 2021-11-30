import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Innovation} from '../../../../../../../models/innovation';
import {first, takeUntil} from 'rxjs/operators';
import {InnovationFrontService} from '../../../../../../../services/innovation/innovation-front.service';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {isPlatformBrowser} from '@angular/common';
import {AnswerService} from '../../../../../../../services/answer/answer.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Answer} from '../../../../../../../models/answer';

@Component({
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit, OnDestroy {

  get validAnswers(): Array<Answer> {
    return this._validAnswers;
  }

  private _innovation: Innovation = <Innovation>{};

  private _subscribe: Subject<any> = new Subject<any>();

  private _showFollowUp = false;

  private _isFetching = true;

  private _validAnswers: Array<Answer> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _innovationFrontService: InnovationFrontService,
              private _answerService: AnswerService,
              private _translateService: TranslateService,
              private _router: Router) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._subscribe)).subscribe((innovation) => {
      if (innovation._id && innovation.followUpEmails && (!innovation.followUpEmails.status
        || innovation.followUpEmails.status === 'INACTIVE')) {
        this._router.navigate(['/user/projects/' + innovation._id + '/settings']);
      } else if (innovation._id && innovation.followUpEmails && innovation.followUpEmails.status === 'ACTIVE') {
        this._innovation = innovation || <Innovation>{};
        this._getValidAnswers();
      }
    });
  }

  private _getValidAnswers() {
    if (isPlatformBrowser(this._platformId) && this._innovation._id && !this._showFollowUp) {
      this._answerService.getInnovationValidAnswers(this._innovation._id).pipe(first()).subscribe((response) => {
        this._showFollowUp = !!(response && response.answers && response.answers.length);
        this._validAnswers = response && response.answers || [];
        this._isFetching = false;
      }, (err: HttpErrorResponse) => {
        this._isFetching = false;
        console.error(err);
      });
    }
  }

  public message(): string {
    return this._translateService.currentLang === 'fr'
      ? 'Dès la première réponse collectée, vous pourrez être présenté.e aux professionnels afin d’approfondir les échanges.'
      : 'Once the first response is collected, you can be introduced to the professionals in order to continue and ' +
      'deepen the discussion.';
  }

  get isFetching(): boolean {
    return this._isFetching;
  }
  get showFollowUp(): boolean {
    return this._showFollowUp;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  ngOnDestroy(): void {
    this._subscribe.next();
    this._subscribe.complete();
  }

}
