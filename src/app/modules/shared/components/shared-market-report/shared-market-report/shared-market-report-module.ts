/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../../../services/auth/auth.service';
import { InnovationService } from './../../../../../services/innovation/innovation.service';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit {

  private _infographics: any;
  private _editionMode = true;
  private _showDetails = true;
  private _calculating = false;
  private _innoid = '599c0029719e572041aafe0d';
  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: any;

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _route: ActivatedRoute,
              private _authService: AuthService,
              private _notificationsService: NotificationsService,
              private _pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private _document: any
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this._innoid = params['innovationId'] || this._innoid;
      this._modalAnswer = null;
      this._innovationService.getInnovationSythesis(this._innoid).subscribe(synthesis => {
        this._infographics = synthesis.infographics;
      }, error => this._notificationsService.error('Error', error.message));
    });
    PageScrollConfig.defaultDuration = 800;
  }

  ngAfterViewInit() {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this._document, '#title');
    setTimeout(_=>this._pageScrollService.start(pageScrollInstance), 2000);
  }

  public recalculateSynthesis(): any {
    this._calculating = true;
    this._innovationService.recalculateSynthesis(this._innoid).subscribe(synthesis => {
      this._calculating = false;
      this._infographics = synthesis.infographics;
    });
  }

  /**
   * Builds the data required to ask the API for a PDF
   * @returns {{projectId, innovationCardId}}
   */
  public dataBuilder(lang): any {
    return {
      projectId: this._innoid,
      title: this._infographics.title.slice(0, Math.min(20, this._infographics.title.length)) + "-synthesis(" + lang +").pdf"
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

  public toggleEditionMode(): any {
    this._editionMode = !this._editionMode;
  }

  public toggleDetails(): any {
    this._showDetails = !this._showDetails;
  }

  public seeAnswer(answer: any) {
    this._modalAnswer = answer;
  }

  public canShow(): boolean {
    return !!this._infographics;
  }

  get modalAnswer(): any {
    return this._modalAnswer;
  }

  set modalAnswer(modalAnswer: any) {
    this._modalAnswer = modalAnswer;
  }

  get innoid(): string {
    return this._innoid;
  }

  get infographics(): any {
    return this._infographics;
  }

  set calculating (value: boolean) {
    this._calculating = value;
  }

  get calculating (): boolean {
    return this._calculating;
  }

  set showDetails (value: boolean) {
    this.showDetails = value;
  }

  get showDetails (): boolean {
    return this._showDetails;
  }

  set editionMode (value: boolean) {
    this._editionMode = value;
  }

  get editionMode (): boolean {
    return this._editionMode;
  }

  get authService (): AuthService {
    return this._authService;
  }
};
