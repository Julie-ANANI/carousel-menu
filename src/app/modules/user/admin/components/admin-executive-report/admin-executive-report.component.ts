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
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ResponseService } from '../../../../shared/components/shared-market-report/services/response.service';
import { ErrorFrontService } from '../../../../../services/error/error-front';

@Component({
  selector: 'admin-executive-report',
  templateUrl: './admin-executive-report.component.html',
  styleUrls: ['./admin-executive-report.component.scss']
})

export class AdminExecutiveReportComponent implements OnInit, OnDestroy {

  @Input() set executiveReport(value: ExecutiveReport) {
    this._executiveReport = value;
    this._setData();
  }

  @Output() executiveReportChange: EventEmitter<ExecutiveReport> = new EventEmitter<ExecutiveReport>();

  private _executiveReport: ExecutiveReport = <ExecutiveReport>{};

  private _objectiveConfig: ExecutiveObjective = <ExecutiveObjective>{};

  private _summary = '';

  private _targetingConfig: ExecutiveTargeting = <ExecutiveTargeting>{};

  private _professionalConfig: ExecutiveProfessional = <ExecutiveProfessional>{};

  private _conclusionConfig: ExecutiveConclusion = <ExecutiveConclusion>{};

  private _answers: Array<Answer> = [];

  private _questions: Array<Question> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor (private _innovationFrontService: InnovationFrontService,
               private _answerService: AnswerService,
               private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit(): void {

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._getAnswers(innovation._id);
      this._questions = ResponseService.presets(innovation);
    });

  }

  private _getAnswers(id: string) {
    if (id) {
      this._answerService.getInnovationValidAnswers(id).pipe(first()).subscribe((response) => {
        this._answers = response.answers.sort((a, b) => {
          return b.profileQuality - a.profileQuality;
        });
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      })
    }
  }

  private _setData() {

    this._objectiveConfig = {
      sale: this._executiveReport.sale,
      client: this._executiveReport.client,
      objective: this._executiveReport.objective
    };

    this._summary = this._executiveReport.summary;

    this._targetingConfig = {
      abstract: this._executiveReport.targeting && this._executiveReport.targeting.abstract,
      countries: this._executiveReport.targeting && this._executiveReport.targeting.countries,
    };

    this._professionalConfig = {
      abstract: this._executiveReport.professionals && this._executiveReport.professionals.abstract,
      list: this._executiveReport.professionals && this._executiveReport.professionals.list,
    };

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

  public emitChanges() {
    this.executiveReportChange.emit(this._executiveReport);
  }

  public onSectionChange(value: ExecutiveSection, index: number) {
    this._executiveReport.sections[index] = value;
    this.emitChanges();
  }

  public resetSection(event: Event, index: number) {
    this._executiveReport.sections[index] = <ExecutiveSection>{};
    this.emitChanges();
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
    this.emitChanges();
  }

  get summary(): string {
    return this._summary;
  }

  set summary(value: string) {
    this._summary = value;
    this._executiveReport.summary = this._summary;
    this.emitChanges();
  }

  get targetingConfig(): ExecutiveTargeting {
    return this._targetingConfig;
  }

  set targetingConfig(value: ExecutiveTargeting) {
    this._targetingConfig = value;
    this._executiveReport.targeting.abstract = this._targetingConfig.abstract;
    this._executiveReport.targeting.countries = this._targetingConfig.countries;
    this.emitChanges();
  }

  get professionalConfig(): ExecutiveProfessional {
    return this._professionalConfig;
  }

  set professionalConfig(value: ExecutiveProfessional) {
    this._professionalConfig = value;
    this._executiveReport.professionals.abstract = this._professionalConfig.abstract;
    this._executiveReport.professionals.list = this._professionalConfig.list;
    this.emitChanges();
  }

  get conclusionConfig(): ExecutiveConclusion {
    return this._conclusionConfig;
  }

  set conclusionConfig(value: ExecutiveConclusion) {
    this._conclusionConfig = value;
    this._executiveReport.conclusion = this._conclusionConfig.conclusion;
    this._executiveReport.operator = this._conclusionConfig.operator;
    this.emitChanges();
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
