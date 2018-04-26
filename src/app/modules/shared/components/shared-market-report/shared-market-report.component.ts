/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { PageScrollConfig } from 'ng2-page-scroll';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { Answer } from '../../../../models/answer';
import { Question } from '../../../../models/question';
import { Section } from '../../../../models/section';
import { Innovation } from '../../../../models/innovation';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit {

  @Input() public project: Innovation;
  @Input() public adminMode: boolean;

  private _questions: Array<Question> = [];
  private _cleaned_questions: Array<Question> = [];
  private _answers: Array<Answer> = [];
  private _countries: Array<string> = [];
  private _showListProfessional = false;
  private _showDetails = false;
  private _calculating = false;
  private _innoid: string;
  public today: Number;

  private _infographics: any; // TODO remove infographics once conclusions have been migrated to Innovation

  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: Answer;

  constructor(private _translateService: TranslateService,
              private _answerService: AnswerService,
              private _innovationService: InnovationService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this.today = Date.now();
    this._innoid = this.project._id;

    this._innovationService.getInnovationSythesis(this._innoid).subscribe(synthesis => {
      this._infographics = synthesis.infographics;
      }, error => this._notificationsService.error('ERROR.ERROR', error.message));

    this.loadAnswers();
    if (this.project.preset && this.project.preset.sections) {
      this.project.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions);
      });
      // remove spaces in questions identifiers.
      this._cleaned_questions = this._questions.map((q) => {
        const ret = JSON.parse(JSON.stringify(q));
        // Please don't touch the parse(stringify()), this dereference q to avoid changing _questions list
        // If changed, the answer modal won't have the good questions identifiers because _questions will be modified
        ret.identifier = ret.identifier.replace(/\s/g, '');
        return ret;
      });
    }
    this._modalAnswer = null;
    PageScrollConfig.defaultDuration = 800;
  }

  private loadAnswers() {
    this._answerService
      .getInnovationValidAnswers(this._innoid)
      .first()
      .subscribe((results) => {

        this._answers = results.answers
          .sort((a, b) => {
            return b.profileQuality - a.profileQuality;
          });

        this._countries = results.answers
          .reduce((acc, answer) => {
            if (acc.indexOf(answer.country.flag) === -1) {
              acc.push(answer.country.flag);
            }
            return acc;
          }, []);

      }, (error) => {
        this._notificationsService.error('ERROR.ERROR', error.message);
      });
  }

  /**
   * Builds the data required to ask the API for a PDF
   * @returns {{projectId, innovationCardId}}
   */
  public dataBuilder(lang: string): any {
    return {
      projectId: this._innoid,
      title: this.project.name.slice(0, Math.min(20, this.project.name.length)) + '-synthesis(' + lang + ').pdf'
    }
  }

  /*
  public getModel (): any {
    const lang = this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
    return {
      lang: lang,
      jobType: 'synthesis',
      labels: 'EXPORT.INNOVATION.SYNTHESIS',
      pdfDataseedFunction: this.dataBuilder(lang)
    };
  }
  */

  public toggleDetails(event: Event): void {
    event.preventDefault();
    const value = !this._showDetails;
    this._showDetails = value;
    this._showListProfessional = value;
  }

  public seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;
  }

  // TODO: remove once conclusions have been copied
  public getInfo(question: Question) {
    if (this._infographics) {
      return this._infographics.questions.find((infoQ: any) => infoQ.id === question.identifier);
    } else {
      return null;
    }
  }

  public get logoName(): string {
    return `logo-${ environment.domain || 'umi.us'}.png`;
  }

  get answers(): Array<Answer> { return this._answers; }
  get countries(): Array<string> { return this._countries; }
  get cleaned_questions(): Array<Question> { return this._cleaned_questions; }
  get questions(): Array<Question> { return this._questions; }
  get modalAnswer(): Answer { return this._modalAnswer; }
  set modalAnswer(modalAnswer: Answer) { this._modalAnswer = modalAnswer; }
  get showListProfessional(): boolean { return this._showListProfessional; }
  set showListProfessional(val: boolean) { this._showListProfessional = val; }
  get innoid(): string { return this._innoid; }
  set calculating (value: boolean) { this._calculating = value; }
  get calculating (): boolean { return this._calculating; }
  get showDetails (): boolean { return this._showDetails; }
  get infographics () { return this._infographics; }
  get lang(): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
