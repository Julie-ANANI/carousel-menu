import { Component, OnInit, Input, AfterViewInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { PageScrollConfig } from 'ngx-page-scroll';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { FilterService } from './services/filters.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Answer } from '../../../../models/answer';
import { Filter } from './models/filter';
import { Question } from '../../../../models/question';
import { Section } from '../../../../models/section';
import { Innovation } from '../../../../models/innovation';
import { environment } from '../../../../../environments/environment';
import { Template } from '../../../sidebar/interfaces/template';
import { Clearbit } from '../../../../models/clearbit';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subject } from 'rxjs/Subject';
import { FrontendService } from '../../../../services/frontend/frontend.service';
import { ShareService } from '../../../../services/share/share.service';
import { Share } from '../../../../models/share';
// import {PrintService} from '../../../../services/print/print.service';
// import * as FileSaver from "file-saver";

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit, AfterViewInit {

  @Input() project: Innovation;

  @Input() adminMode: boolean;

  @Input() sharable = false;

  private _adminSide: boolean;

  private _sidebarTemplateValue: Template = {};

  scrollOn = false;

  currentInnovationIndex = 0;

  private _menuButton = false;

  private _displayMenuWrapper = false;

  editMode = new Subject<boolean>(); // this is for the admin side.

  private _previewMode: boolean;

  private _disableButton: any;

  private _projectToBeFinished: boolean;

  private _endDate: Date;

  private _companies: Array<Clearbit>;

  private _campaignsStats: {
    nbPros: number,
    nbProsSent: number,
    nbProsOpened: number,
    nbProsClicked: number,
    nbValidatedResp: number
  };

  private _questions: Array<Question> = [];
  private _cleaned_questions: Array<Question> = [];
  private _answers: Array<Answer> = [];
  private _filteredAnswers: Array<Answer> = [];
  private _countries: Array<string> = [];
  private _showListProfessional = true;

  private _showDetails = true;

  private _innoid: string;

  public activeSection: string;
  public today: Number;
  public objectKeys = Object.keys;
  public mapInitialConfiguration: {[continent: string]: boolean};

  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: Answer;

  constructor(private translateService: TranslateService,
              private answerService: AnswerService,
              private translateNotificationsService: TranslateNotificationsService,
              private location: Location,
              private innovationService: InnovationService,
              private authService: AuthService,
              private shareService: ShareService,
              public filterService: FilterService,
              private frontendService: FrontendService) {
    this.filterService.reset();
  }

  ngOnInit() {
    this.isAdmin();

    this.today = Date.now();

    this._innoid = this.project._id;

    this.currentInnovationIndex = this.project.innovationCards.findIndex((items) => items.lang === this.lang);

    this.resetMap();

    this.loadAnswers();

    this.loadCampaign();

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

    this._previewMode = this.project.previewMode;

    this._disableButton = this.project.status;

    this.projectFinishDate();

  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollOn = window.scrollY !== 0;

    this._menuButton = (this.getCurrentScroll() > 150);

  }

  getCurrentScroll() {
    if (typeof window.scrollY !== 'undefined' && window.scrollY >= 0) {
      return window.scrollY;
    }
    return 0;
  };

  isAdmin() {
    this._adminSide = this.location.path().slice(0, 6) === '/admin';
    this.adminMode = this.authService.adminLevel > 2;
  }

  projectFinishDate() {
    const index = this.project.statusLogs.findIndex(action => action.action === 'FINISH');
    this._endDate = index === -1 ? null : this.project.statusLogs[index].date;
  }

  resetMap() {
    this.mapInitialConfiguration = {
      africa: true,
      americaNord: true,
      americaSud: true,
      asia: true,
      europe: true,
      oceania: true,
      russia: true
    };
  }

  loadAnswers() {
    this.answerService.getInnovationValidAnswers(this._innoid).first().subscribe((results) => {
      this._answers = results.answers.sort((a, b) => {
        return b.profileQuality - a.profileQuality;
      });

      this._filteredAnswers = this._answers;
      this.filterService.filtersUpdate.subscribe((_) => {
        this._filteredAnswers = this.filterService.filter(this._answers);
      });

      this._companies = results.answers.map((answer: any) => answer.company || {
        name: answer.professional.company
      }).filter(function(item: any, pos: any, self: any) {
        return self.findIndex((subitem: Clearbit) => subitem.name === item.name) === pos;
      });

      this._countries = results.answers.reduce((acc, answer) => {
        if (acc.indexOf(answer.country.flag) === -1) {
          acc.push(answer.country.flag);
        }
        return acc;
      }, []);

    }, (error) => {
      this.translateNotificationsService.error('ERROR.ERROR', error.message);
    });

  }

  loadCampaign() {
    this.innovationService.campaigns(this._innoid).first().subscribe((results) => {
      if (results && Array.isArray(results.result)) {
        this._campaignsStats = results.result.reduce(function(acc, campaign) {
          if (campaign.stats) {
            if (campaign.stats.campaign) {
              acc.nbPros += (campaign.stats.campaign.nbProfessionals || 0);
              acc.nbValidatedResp += (campaign.stats.campaign.nbValidatedResp || 0);
            }
            if (campaign.stats.mail) {
              acc.nbProsSent += (campaign.stats.mail.totalPros ||  0);
              if (campaign.stats.mail.statuses) {
                acc.nbProsOpened += (campaign.stats.mail.statuses.opened || 0);
                acc.nbProsClicked += (campaign.stats.mail.statuses.clicked ||  0);
              }
            }
          }
          return acc;
        }, {nbPros: 0, nbProsSent: 0, nbProsOpened: 0, nbProsClicked: 0, nbValidatedResp: 0});
      }
    }, (error) => {
      this.translateNotificationsService.error('ERROR.ERROR', error.message);
    });

  }

  ngAfterViewInit() {
    const wrapper = document.getElementById('answer-wrapper');

    if (wrapper) {
      const sections = Array.from(
        wrapper.querySelectorAll('section')
      );
      window.onscroll = () => {
        const scrollPosY = document.body.scrollTop;
        const section = sections.find((n) => scrollPosY <= n.getBoundingClientRect().bottom);
        this.activeSection = section ? section.id : '';
      };
    }

  }

  public filterByCountries(event: {countries: Array<string>, allChecked: boolean}): void {
    if (!event.allChecked) {
      this.filterService.addFilter(
        {
          status: 'COUNTRIES',
          value: event.countries,
          questionId: 'worldmap',
          questionTitle: {en: 'worldmap', fr: 'mappemonde'}
        }
      );
    } else {
      this.filterService.deleteFilter('worldmap');
    }
  }

  public filterPro(answer: Answer, event: Event) {
    event.preventDefault();
    const proFilter = this.filterService.filters['professionals'];
    this.filterService.addFilter({
      status: 'PROFESSIONALS',
      value: proFilter && Array.isArray(proFilter.value) ? [...proFilter.value, answer._id] : [answer._id],
      questionId: 'professionals',
      questionTitle: {en: 'Professionals', fr: 'Professionnels'}
    });
  }

  confirmModal(event: Event) {
    event.preventDefault();
    this._projectToBeFinished = true;
  }

  changeStatus(event: Event, status: 'DONE'): void {
    this._projectToBeFinished = false;

    this.innovationService.updateStatus(this._innoid, status).first().subscribe((results) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS');
      this._disableButton = results.status;
    }, (error) => {
      this.translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._projectToBeFinished = false;
  }

  toggleDetails(event: Event): void {
    event.preventDefault();
    const value = !this._showDetails;
    this._showDetails = value;
    this._showListProfessional = value;
  }

  toggleMode(event: Event): void {
    event.preventDefault();
   this._previewMode =  this.project.previewMode = event.target['checked'] === true;

    if (event.target['checked']) {
      this.innovationService.save(this._innoid, this.project).first().subscribe( (data) => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS_VISIBLE');
      });
    } else {
      this.innovationService.save(this._innoid, this.project).first().subscribe( (data) => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS_NOT_VISIBLE');
      });
    }

  }

  displayMenu(event: Event) {
    event.preventDefault();
    this._displayMenuWrapper = true;
  }

  hideMenu(event: Event) {
    event.preventDefault();
    this._displayMenuWrapper = false;
  }

  seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;

    this._sidebarTemplateValue = {
      animate_state: this._sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: this._adminSide ? 'COMMON.EDIT_INSIGHT' : 'Insight',
      size: '726px'
    };

  }

  closeSidebar(value: string) {
    this._sidebarTemplateValue.animate_state = value;
    this.editMode.next(false);
  }

  public keyupHandlerFunction(event: any, ob: string) {
    const objToSave = {};
    objToSave[ob] = {
      conclusion: event['content']
    };
    this.innovationService.updateMarketReport(this.project._id, objToSave).first().subscribe((data) => {
        this.project.marketReport = data;
      });
  }

  public deleteFilter(key: string, event: Event) {
    event.preventDefault();
    if (key === 'worldmap') {
      this.resetMap();
    }
    this.filterService.deleteFilter(key);
  }

  printSynthesis(event: Event): void {
    event.preventDefault();
   /* const html = document.getElementsByTagName('html')[0];
    const body = {html: html.outerHTML};
    this.printService.getPdf(body).subscribe((response) => {
      const file = new Blob([ response.blob() ], {type: 'application/pdf'})
      FileSaver.saveAs(file, 'test.pdf');
    });*/

   window.print();
    /*this.dataExtractor.updateData({
      answers: this.filteredAnswers,
      countries: this._countries,
      questions: JSON.parse(JSON.stringify(this._questions)),
      filter: null,
      lang: this.lang,
      marketReport: { ...this.project.marketReport} || {},
      strings: this._translationStrings()
    });*/
  }

/*  private _translationStrings(): any {
    /!*
  {{ 'COMMON.UMI_WORD' | translate }}
  {{ 'MARKET_REPORT.SYNTHESIS_FRAME' | translate }}
  {{ 'MARKET_REPORT.PIE_CHART' | translate }}
  {{ 'MARKET_REPORT.ANSWERS' | translate }}
  {{ 'MARKET_REPORT.PEOPLE_VOTED' | translate }}
  {{ 'MARKET_REPORT.NO_GRADE' | translate }}
  {{ 'MARKET_REPORT.GRADE' | translate }}
   *!/
    /!*return  {
      "UMI_WORD": this.translateService.instant('COMMON.UMI_WORD' ),
      "SYNTHESIS_FRAME": this.translateService.instant('MARKET_REPORT.SYNTHESIS_FRAME' ),
      "PIE_CHART": this.translateService.instant('MARKET_REPORT.PIE_CHART' ),
      "ANSWERS": this.translateService.instant('MARKET_REPORT.ANSWERS' ),
      "PEOPLE_VOTED": this.translateService.instant('MARKET_REPORT.PEOPLE_VOTED' ),
      "NO_GRADE": this.translateService.instant('MARKET_REPORT.NO_GRADE' ),
      "GRADE": this.translateService.instant('MARKET_REPORT.GRADE' )
    };*!/
  }*/

  /***
   * This function is called when the user clicks on the share synthesis button. We call the
   * share service to get the objectId and share key for this innovation, so that he can share
   * this innovation with other. Then we call the "openMailTo()".
   * @param {Event} event
   */
  shareSynthesis(event: Event) {
    event.preventDefault();

    this.shareService.shareSynthesis(this.project._id).first().subscribe((response: Share) => {
      this.openMailTo(response.objectId, response.shareKey);
    }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }

  /***
   * This function generates the message and open the mailto for the client to share the
   * innovation.
   * @param {string} projectID
   * @param {string} shareKey
   */
  private openMailTo(projectID: string, shareKey: string) {
    let message = '';
    let subject = '';
    const url = this.getInnovationUrl() + '/share/synthesis/' + projectID + '/' + shareKey;

    if (this.lang === 'en') {

      subject = 'Results - ' + this.project.innovationCards[this.currentInnovationIndex].title;

      message = encodeURI('Hello,' + '\r\n' + '\r\n' + 'I invite you to discover the results of the market test carried out by ' + this.getCompanyName() + ' for the innovation ' +
        this.project.innovationCards[this.currentInnovationIndex].title + '\r\n' + '\r\n' + 'Go on this link: ' + url +  '\r\n' + '\r\n' + 'You can view the results by filtering by domain, ' +
        'geographical location, person etc. ' + '\r\n' + '\r\n' + 'Cordially, ' + '\r\n' + '\r\n' + this.getOwnerName());

    }

    if (this.lang === 'fr') {

      subject = 'Résultats - ' + this.project.innovationCards[this.currentInnovationIndex].title;

      message = encodeURI('Bonjour,' + '\r\n' + '\r\n' + 'Je vous invite à découvrir les résultats du test marché réalisé par ' + this.getCompanyName() + ' pour l\'innovation ' +
      this.project.innovationCards[this.currentInnovationIndex].title + '\r\n' + '\r\n' + 'Allez sur ce lien: ' + url +  '\r\n' + '\r\n' + 'Vous pouvez afficher les résultats en filtrant par domaine, ' +
        'emplacement géographique, personne etc. ' + '\r\n' + '\r\n' + 'Cordialement, ' + '\r\n' + '\r\n' + this.getOwnerName());
    }

    window.location.href = 'mailto:' + '?subject=' + subject  + '&body=' + message;

  }

  /***
   * This function is getting the image source according to the current lang of the user.
   * @returns {string}
   */
  getSrc(): string {
    let src = '';
    const defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1535383716/app/default-images/image-not-available.png';

    if (this.project.innovationCards[this.currentInnovationIndex].principalMedia && this.project.innovationCards[this.currentInnovationIndex].principalMedia.type === 'PHOTO') {
      src = this.project.innovationCards[this.currentInnovationIndex].principalMedia.url;
    } else {
      const index = this.project.innovationCards[this.currentInnovationIndex].media.findIndex((media) => media.type === 'PHOTO');
      src = index === -1 ? defaultSrc : this.project.innovationCards[this.currentInnovationIndex].media[index].url;
    }

    if (src === '' || undefined) {
      src = defaultSrc;
    }

    return src;

  }

  percentageCalculation(value1: number, value2: number) {
    return this.frontendService.analyticPercentage(value1, value2);
  }

  formatCompanyName(name: string) {
    if (name) {
      return `${name[0].toUpperCase()}${name.slice(1)}`;
    }
    return '--';
  }

  getDomainName(): string {
    return environment.domain;
  }

  getIntroSrc(): string {
    let src = '';

    if (this.lang === 'en') {
      src = 'https://res.cloudinary.com/umi/image/upload/v1537445724/app/default-images/Intro-UMI-en.png';
    }

    if (this.lang === 'fr') {
      src = 'https://res.cloudinary.com/umi/image/upload/v1537445724/app/default-images/Intro-UMI-fr.png';
    }

    return src;

  }

  get campaignStats() {
    return this._campaignsStats;
  }

  get companies() {
    return this._companies;
  }

  get logoName(): string {
    return environment.logoSynthURL;
  }

  get projectStatus(): string {
    return this.project.status;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get filters(): {[questionId: string]: Filter} {
    return this.filterService.filters;
  }

  get filteredAnswers(): Array<Answer> {
    return this._filteredAnswers;
  }

  get countries(): Array<string> {
    return this._countries;
  }

  get continentTarget(): any {
    return this.project.settings ? this.project.settings.geography.continentTarget : {};
  }

  get cleaned_questions(): Array<Question> {
    return this._cleaned_questions;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  get modalAnswer(): Answer {
    return this._modalAnswer;
  }

  set modalAnswer(modalAnswer: Answer) {
    this._modalAnswer = modalAnswer;
  }

  get innoid(): string {
    return this._innoid;
  }

  get showDetails(): boolean {
    return this._showDetails;
  }

  get lang(): string {
    return this.translateService.currentLang || this.translateService.getBrowserLang() || 'en';
  }

  getLogo(): string {
    return environment.logoURL;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  get sidebarTemplateValue(): Template {
    return this._sidebarTemplateValue;
  }

  get menuButton(): boolean {
    return this._menuButton;
  }

  get displayMenuWrapper(): boolean {
    return this._displayMenuWrapper;
  }

  get previewMode(): boolean {
    return this._previewMode;
  }

  get disableButton(): any {
    return this._disableButton;
  }

  get projectToBeFinished(): boolean {
    return this._projectToBeFinished;
  }

  get endDate(): Date {
    return this._endDate;
  }

  getCompanyName(): string {
    return environment.companyName;
  }

  getInnovationUrl(): string {
    return environment.innovationUrl;
  }

  getOwnerName(): string {
    return this.project.owner.name || '';
  }


}
