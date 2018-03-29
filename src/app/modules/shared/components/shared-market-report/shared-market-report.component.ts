/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { PageScrollConfig } from 'ng2-page-scroll';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { Answer } from '../../../../models/answer';
import { Question } from '../../../../models/question';
import { Section } from '../../../../models/section';
import { Innovation } from '../../../../models/innovation';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit {

  @Input() public project: Innovation;
  @Input() public adminMode: boolean;

  private _questions: Array<Question> = [];
  private _answers: Array<Answer> = [];
  private _countries: Array<string> = [];
  private _infographics: any;
  private _showDetails = true;
  private _calculating = false;
  private _innoid: string;

  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: Answer;

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _answerService: AnswerService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._innoid = this.project._id;
    this.loadAnswers();
    if (this.project.preset && this.project.preset.sections) {
      this.project.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions);
      });
      // remove spaces in questions identifiers.
      this._questions = this._questions.map((q) => {
        q.identifier = q.identifier.replace(/\s/g, '');
        return q;
      });
    }
    this._modalAnswer = null;
    this._innovationService.getInnovationSythesis(this._innoid).subscribe(synthesis => {
      this._infographics = synthesis.infographics;
    }, error => this._notificationsService.error('ERROR.ERROR', error.message));
    PageScrollConfig.defaultDuration = 800;
  }

  private loadAnswers() {
    this._answerService
      .getInnovationValidAnswers(this._innoid)
      .first()
      .subscribe((results) => {
        this._answers = results.answers;
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

  public recalculateSynthesis(event: Event): void {
    event.preventDefault();
    this._calculating = true;
    this._innovationService.recalculateSynthesis(this._innoid)
      .first()
      .subscribe(synthesis => {
        this._calculating = false;
        this._infographics = synthesis.infographics;
      });
  }

  /**
   * Builds the data required to ask the API for a PDF
   * @returns {{projectId, innovationCardId}}
   */
  public dataBuilder(lang: string): any {
    return {
      projectId: this._innoid,
      title: this._infographics.title.slice(0, Math.min(20, this._infographics.title.length)) + '-synthesis(' + lang + ').pdf'
    }
  }

  public getModel (): any {
    const lang = this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
    return {
      lang: lang,
      jobType: 'synthesis',
      labels: 'EXPORT.INNOVATION.SYNTHESIS',
      pdfDataseedFunction: this.dataBuilder(lang)
    };
  }

  public toggleDetails(event: Event): void {
    event.preventDefault();
    this._showDetails = !this._showDetails;
  }

  public seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;
  }

  public canShow(): boolean {
    return !!this._infographics;
  }

  get answers(): Array<Answer> { return this._answers; }
  get countries(): Array<string> { return this._countries; }
  get questions(): Array<Question> { return this._questions; }
  set questions(value: Array<Question>) { this._questions = value; }
  get modalAnswer(): Answer { return this._modalAnswer; }
  set modalAnswer(modalAnswer: Answer) { this._modalAnswer = modalAnswer; }
  get innoid(): string { return this._innoid; }
  get infographics(): any { return this._infographics; }
  set calculating (value: boolean) { this._calculating = value; }
  get calculating (): boolean { return this._calculating; }
  set showDetails (value: boolean) { this._showDetails = value; }
  get showDetails (): boolean { return this._showDetails; }
  get lang(): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
