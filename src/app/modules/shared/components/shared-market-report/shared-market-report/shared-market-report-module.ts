/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../services/auth/auth.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { PageScrollConfig } from 'ng2-page-scroll';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../models/answer';
import { Question } from '../../../../../models/question';
import { Section } from '../../../../../models/section';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit {

  @Input() public project: any;
  @Input() public adminMode: boolean;

  private _questions: Array<Question> = [];
  private _infographics: any;
  private _showDetails = true;
  private _calculating = false;
  // TODO: what is this id ? -> we shouldn't allow hard coded IDs.
  private _innoid = '599c0029719e572041aafe0d';
  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: Answer;

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _route: ActivatedRoute,
              private _authService: AuthService,
              private _notificationsService: TranslateNotificationsService
  ) { }

  ngOnInit() {
    this._innoid = this.project._id;
    if (this.project.preset && this.project.preset.sections) {
      this.project.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions);
      });
    }

    this._modalAnswer = null;
    this._innovationService.getInnovationSythesis(this._innoid).subscribe(synthesis => {
      this._infographics = synthesis.infographics;
    }, error => this._notificationsService.error('ERROR.ERROR', error.message));
    PageScrollConfig.defaultDuration = 800;
  }

  public recalculateSynthesis(): any {
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

  public toggleDetails(): void {
    this._showDetails = !this._showDetails;
  }

  public seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;
  }

  public canShow(): boolean {
    return !!this._infographics;

  }
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
  get authService (): AuthService { return this._authService; }
}
