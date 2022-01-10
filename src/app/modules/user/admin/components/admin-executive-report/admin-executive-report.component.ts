import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ExecutiveConclusion,
  ExecutiveObjective,
  ExecutiveProfessional,
  ExecutiveReport, ExecutiveSection,
  ExecutiveTargeting
} from '../../../../../models/executive-report';
import { Answer  } from '../../../../../models/answer';
import { Question } from '../../../../../models/question';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { AnswerService } from '../../../../../services/answer/answer.service';
import { TranslateNotificationsService } from '../../../../../services/translate-notifications/translate-notifications.service';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import {MissionQuestion} from '../../../../../models/mission';

@Component({
  selector: 'app-admin-executive-report',
  templateUrl: './admin-executive-report.component.html',
  styleUrls: ['./admin-executive-report.component.scss']
})

export class AdminExecutiveReportComponent implements OnInit, OnDestroy {

  @Input() isEditable = false;
  @Input() set executiveReport(value: ExecutiveReport) {
    this._executiveReport = value;
    this._setData();
  }

  @Output() executiveReportUpdate: EventEmitter<any> = new EventEmitter<any>();

  private _executiveReport: ExecutiveReport = <ExecutiveReport>{};
  private _objectiveConfig: ExecutiveObjective = <ExecutiveObjective>{};
  private _summary = '';
  private _targetingConfig: ExecutiveTargeting = <ExecutiveTargeting>{};
  private _professionalConfig: ExecutiveProfessional = <ExecutiveProfessional>{};
  private _conclusionConfig: ExecutiveConclusion = <ExecutiveConclusion>{};
  private _answers: Array<Answer> = [];
  private _topAnswers: Array<Answer> = [];
  private _questions: Array<Question | MissionQuestion> = [];
  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _showModal = false;
  private _isResetModal = false;
  private _activeIndex: number = null;
  private _anonymous = false;

  constructor (private _innovationFrontService: InnovationFrontService,
               private _answerService: AnswerService,
               private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit(): void {

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._anonymous = innovation._metadata && innovation._metadata.campaign ?
        !!innovation._metadata.campaign.anonymous_answers : false;
      this._getAnswers(innovation._id);
      this._questions = InnovationFrontService.questionsList(innovation);
    });

  }

  private _getAnswers(id: string) {
    if (id) {
      this._answerService.getInnovationValidAnswers(id).pipe(first()).subscribe((response) => {
        this._answers = response.answers.sort((a, b) => {
          return b.profileQuality - a.profileQuality;
        });
        this._topAnswers = this.answers.filter(ans => ans.profileQuality === 2);
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  private _setData() {

    // objective
    this._objectiveConfig = {
      sale: this._executiveReport.sale,
      client: this._executiveReport.client,
      objective: this._executiveReport.objective
    };

    // pitch
    this._summary = this._executiveReport.summary;

    // targeting
    this._targetingConfig = {
      abstract: this._executiveReport.targeting && this._executiveReport.targeting.abstract,
      countries: this._executiveReport.targeting && this._executiveReport.targeting.countries,
      countriesall: this._executiveReport.targeting && this._executiveReport.targeting.countriesall,
    };

    // professionals
    this._professionalConfig = {
      abstract: this._executiveReport.professionals && this._executiveReport.professionals.abstract,
      list: this._executiveReport.professionals && this._executiveReport.professionals.list,
    };

    // conclusion
    this._conclusionConfig = {
      conclusion: this._executiveReport.conclusion,
      operator: this._executiveReport.operator,
    };

    // setting the executive report sections.
    for (let i = 0; i <= 7; i++) {
      if (!this._executiveReport.sections[i]) {
        this._executiveReport.sections[i] = <ExecutiveSection>{};
      }
    }
  }

  public emitChanges(change: any) {
    this.executiveReportUpdate.emit(change);
  }

  public onSectionChange(value: ExecutiveSection, index: number) {
    this._executiveReport.sections[index] = value;
    const update: any = {};
    update[`section_${index}`] = value;
    this.emitChanges(update);
  }

  private _resetModalVariables() {
    this._isResetModal = false;
  }

  public resetModal(event: Event, index: number) {
    this._resetModalVariables();
    this._isResetModal = true;
    this._activeIndex = index;
    this._showModal = true;
  }

  private _resetSection() {
    this._executiveReport.sections[this._activeIndex] = <ExecutiveSection>{};
    const update: any = {};
    update[`section_${this._activeIndex}`] = {};
    this.emitChanges(update);
  }

  public onClickConfirm(event: Event) {
    event.preventDefault();

    if (this._isResetModal) {
      this._resetSection();
    }

    this._showModal = false;

  }

  get executiveReport(): ExecutiveReport {
    return this._executiveReport;
  }

  get objectiveConfig(): ExecutiveObjective {
    return this._objectiveConfig;
  }

  set objectiveConfig(value: ExecutiveObjective) {
    this._objectiveConfig = value;
    this._executiveReport.sale = this._objectiveConfig.sale;
    this._executiveReport.client = this._objectiveConfig.client;
    this._executiveReport.objective = this._objectiveConfig.objective;
    this.emitChanges({
      sale: this._executiveReport.sale,
      client: this._executiveReport.client,
      objective: this._executiveReport.objective
    });
  }

  get summary(): string {
    return this._summary;
  }

  set summary(value: string) {
    this._summary = value;
    this._executiveReport.summary = this._summary;
    this.emitChanges({summary: value});
  }

  get targetingConfig(): ExecutiveTargeting {
    return this._targetingConfig;
  }

  set targetingConfig(value: ExecutiveTargeting) {
    this._targetingConfig = value;
    this._executiveReport.targeting.abstract = this._targetingConfig.abstract;
    this._executiveReport.targeting.countries = this._targetingConfig.countries;
    this.emitChanges({targeting: value});
  }

  get professionalConfig(): ExecutiveProfessional {
    return this._professionalConfig;
  }

  set professionalConfig(value: ExecutiveProfessional) {
    this._professionalConfig = value;
    this._executiveReport.professionals.abstract = this._professionalConfig.abstract;
    this._executiveReport.professionals.list = this._professionalConfig.list;
    this.emitChanges({professionals: value});
  }

  get conclusionConfig(): ExecutiveConclusion {
    return this._conclusionConfig;
  }

  set conclusionConfig(value: ExecutiveConclusion) {
    this._conclusionConfig = value;
    this._executiveReport.conclusion = this._conclusionConfig.conclusion;
    this._executiveReport.operator = this._conclusionConfig.operator;
    this.emitChanges({conclusion: this._executiveReport.conclusion, operator: this._executiveReport.operator});
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get questions(): Array<Question | MissionQuestion> {
    return this._questions;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get isResetModal(): boolean {
    return this._isResetModal;
  }

  get anonymous(): boolean {
    return this._anonymous;
  }

  get topAnswers(): Array<Answer> {
    return this._topAnswers;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
