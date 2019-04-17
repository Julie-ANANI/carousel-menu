import { Component, OnInit, Inject, Input, AfterViewInit, HostListener, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PageScrollConfig } from 'ngx-page-scroll';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { FilterService } from './services/filters.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Answer } from '../../../../models/answer';
import { Campaign } from '../../../../models/campaign';
import { Filter } from './models/filter';
import { Question } from '../../../../models/question';
import { Innovation } from '../../../../models/innovation';
import { environment } from '../../../../../environments/environment';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';
import { Clearbit } from '../../../../models/clearbit';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShareService } from '../../../../services/share/share.service';
import { Share } from '../../../../models/share';
import { Executive, executiveTemplate } from './models/template';
import { ResponseService } from './services/response.service';
import { InnovationCommonService } from '../../../../services/innovation/innovation-common.service';
import { SharedWorldmapService } from '../shared-worldmap/shared-worldmap.service';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  @Input() set modeAdmin(value: boolean) {
    this._adminMode = value;
  }

  @Input() set sideAdmin(value: boolean) {
    this._adminSide = value;
  }

  @Input() sharable = false;

  @Input() wordpress = false; // this is temporary for the site.

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _innovation: Innovation = {};

  private _adminSide = false;

  private _isOwner: boolean;

  private _previewMode: boolean;

  private _currentInnovationIndex = 0;

  private _answers: Array<Answer> = [];

  private _filteredAnswers: Array<Answer> = [];

  private _answersOrigins: {[c: string]: number} = {};

  private _countries: Array<string> = [];

  private _questions: Array<Question> = [];

  private _adminMode = false;

  private _campaignsStats: {
    nbPros: number,
    nbProsSent: number,
    nbProsOpened: number,
    nbProsClicked: number,
    nbValidatedResp: number
  };

  private _scrollOn = false;

  private _showDetails: boolean;

  private _openModal = false;

  private _innovationEndModal: boolean;

  private _innovationExport = false;

  private _today: Number;

  private _menuButton = false;

  private _displayMenuWrapper = false;

  private _numberOfSections: number;

  private _exportType = '';

  private _executiveTemplates: Array<Executive>;

  private _modalAnswer: Answer = null;

  private _sidebarTemplateValue: SidebarInterface = {};

  private _companies: Array<Clearbit>;

  private _activeSection: string;

  objectKeys = Object.keys;

  private _mapInitialConfiguration: {[continent: string]: boolean};

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private translateService: TranslateService,
              private answerService: AnswerService,
              private translateNotificationsService: TranslateNotificationsService,
              private innovationService: InnovationService,
              private authService: AuthService,
              private shareService: ShareService,
              private filterService: FilterService,
              private responseService: ResponseService,
              private innovationCommonService: InnovationCommonService,
              private worldmapService: SharedWorldmapService) { }

  ngOnInit() {
    this.filterService.reset();
    this.initializeReport();
    this._isOwner = (this.authService.userId === this._innovation.owner.id) || this.authService.adminLevel > 2;
    PageScrollConfig.defaultDuration = 800;
  }


  /***
   * This function is calling all the initial functions.
   */
  private initializeReport() {
    this.initializeVariable();
    this.getAnswers();
    this.getCampaign();
    this.resetMap();
    this.presets();
  }


  getMessage():string {
    let message = '';

    switch (this._innovation.status) {

      case 'EDITING':
        if (this._innovation.reviewing) {
          message = 'MARKET_REPORT.MESSAGE.REVIEWING';
        } else if (!this._innovation.reviewing) {
          message = 'MARKET_REPORT.MESSAGE.EDITING';
        }
        break;

      case 'EVALUATING':
        message = 'MARKET_REPORT.MESSAGE.EVALUATING';
        break;

      case 'SUBMITTED':
        message = 'MARKET_REPORT.MESSAGE.SUBMITTED';
        break;

      default:
      // do nothing...

    }

    return message;
  }


  /***
   *This function is to initialize the variables regarding the innovation and the projectt.
   */
  private initializeVariable() {

    /***
     * here we are registering the index of the lang of the user and according to that we display the innovation.
     * @type {number}
     */
    const index = this._innovation.innovationCards.findIndex((items) => items.lang === this.userLang);
    this._currentInnovationIndex = index !== -1 ? index : 0;

    /***
     * this is to check, if the admin make the synthesis available before the status is Done.
     * @type {boolean | undefined}
     * @user
     */
    this._previewMode = this._innovation.previewMode || false;

    /***
     * this is to display on the front page.
     * @type {number}
     */
    this._today = Date.now();

    /***
     * Client side to toggle the full view.
     * @type {boolean}
     * @user
     */
    this._showDetails = !this.wordpress;


    /***
     * we are checking do we have any template.
     * @type {number | undefined}
     */
    this._numberOfSections = this._innovation.executiveReport ? this._innovation.executiveReport.totalSections || 0 : 0;

    /***
     * assinging the value of the executive template.
     * @type {Executive}
     */
    this._executiveTemplates = executiveTemplate;

    /***
     * this is when we update the innovation in any sub component,
     * we are listening that update and will update the innovation attribute.
     */
    this.innovationCommonService.getInnovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response: Innovation) => {
        if (response) {
          this._innovation = response;
        }
      });

  }


  /***
   * This function is to fetch the answers from the server.
   */
  private getAnswers() {
    this.answerService.getInnovationValidAnswers(this._innovation._id).subscribe((response) => {
      this._answers = response.answers.sort((a, b) => {
        return b.profileQuality - a.profileQuality;
      });

      /***
       * passing the non filtered answers to the service to use in the executive report.
       */
      this.responseService.setExecutiveAnswers(this._answers);

      this._filteredAnswers = this._answers;

      this._answersOrigins = this.worldmapService.getCountriesRepartition(
        this._filteredAnswers.map(x => x.country.flag || x.professional.country)
      );

      this.filterService.filtersUpdate.subscribe((_) => {
        this._filteredAnswers = this.filterService.filter(this._answers);
        this._answersOrigins = this.worldmapService.getCountriesRepartition(
          this._filteredAnswers.map(x => x.country.flag || x.professional.country)
        );
      });

      this._companies = response.answers.map((answer: any) => answer.company || {
        name: answer.professional.company
      }).filter(function(item: any, pos: any, self: any) {
        return self.findIndex((subitem: Clearbit) => subitem.name === item.name) === pos;
      });

      this._countries = response.answers.reduce((acc, answer) => {
        if (acc.indexOf(answer.country.flag) === -1) {
          acc.push(answer.country.flag);
        }
        return acc;
      }, []);

    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  /***
   * This function is to fetch the campaign from the server.
   */
  private getCampaign() {
    this.innovationService.campaigns(this._innovation._id).subscribe((results) => {
      if (results && Array.isArray(results.result)) {
        this._campaignsStats = results.result.reduce(function(acc: any, campaign: Campaign) {
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
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  /***
   * This function is to reset the map configuration.
   */
  private resetMap() {
    this._mapInitialConfiguration = {
      africa: true,
      americaNord: true,
      americaSud: true,
      asia: true,
      europe: true,
      oceania: true,
      russia: true
    };
  }


  /***
   * This function is to get the questions.
   */
  private presets() {
   if (this._innovation.preset && this._innovation.preset.sections) {
     this._questions = this.responseService.getPresets(this._innovation);
   }
  }


  /***
   * We are getting the scroll value for the sticky bar.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this._scrollOn = window.scrollY !== 0;
    this._menuButton = (this.getCurrentScroll() > 150);
  }

  private getCurrentScroll() {
    if (typeof window.scrollY !== 'undefined' && window.scrollY >= 0) {
      return window.scrollY;
    }
    return 0;
  }


  /***
   * This function toggles the view.
   * @param {Event} event
   */
  toggleDetails(event: Event) {
    event.preventDefault();
    this._showDetails = !this._showDetails;
  }


  /***
   * This function make the market report available to the client but it will be partial report.
   * @param {Event} event
   */
  enablePreviewMode(event: Event) {
    event.preventDefault();

    this._previewMode =  this._innovation.previewMode = event.target['checked'] === true;

    if (event.target['checked']) {
      this.innovationService.save(this._innovation._id, this._innovation).subscribe( () => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS_VISIBLE');
      });
    } else {
      this.innovationService.save(this._innovation._id, this._innovation).subscribe( () => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS_NOT_VISIBLE');
      });
    }

  }


  /***
   * This function calls the modal.
   * @param event
   * @param value
   */
  displayModal(event: Event, value: string) {
    event.preventDefault();
    this._openModal = true;
    this._innovationExport = false;
    this._innovationEndModal = false;

    if (value === 'endInnovation') {
      this._innovationEndModal = true;
    }

    if (value === 'exportInnovation') {
      this._innovationExport = true;
    }

  }


  /***
   * This function will make the project end and synthesis will be available to the client.
   * @param {Event} event
   * @param {"DONE"} status
   */
  endInnovation(event: Event, status: 'DONE'): void {
    this._innovationEndModal = false;
    this._openModal = false;

    this.innovationService.endProject(this._innovation._id).subscribe((response) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS');
      this._innovation = response;
      this.innovationCommonService.setInnovation(this._innovation);
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }


  /***
   * This function the deletes the applied filtered.
   * @param {string} key
   * @param {Event} event
   */
  deleteFilter(key: string, event: Event) {
    event.preventDefault();

    if (key === 'worldmap') {
      this.resetMap();
    }

    this.filterService.deleteFilter(key);

  }


  /***
   * This function is called when the user clicks on the share synthesis button. We call the
   * share service to get the objectId and share key for this innovation, so that he can share
   * this innovation with other. Then we call the "openMailTo()".
   * @param {Event} event
   */
  shareSynthesis(event: Event) {
    event.preventDefault();

    this.shareService.shareSynthesis(this._innovation._id).subscribe((response: Share) => {
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

    if (this.userLang === 'en') {

      subject = 'Results - ' + this._innovation.innovationCards[this._currentInnovationIndex].title;

      message = encodeURI('Hello,' + '\r\n' + '\r\n' + 'I invite you to discover the results of the market test carried out by ' + this.getCompanyName() + ' for the innovation ' +
        this._innovation.innovationCards[this._currentInnovationIndex].title + '\r\n' + '\r\n' + 'Go on this link: ' + url +  '\r\n' + '\r\n' + 'You can view the results by filtering by domain, ' +
        'geographical location, person etc. ' + '\r\n' + '\r\n' + 'Cordially, ' + '\r\n' + '\r\n' + this.getOwnerName());

    }

    if (this.userLang === 'fr') {

      subject = 'Résultats - ' + this._innovation.innovationCards[this._currentInnovationIndex].title;

      message = encodeURI('Bonjour,' + '\r\n' + '\r\n' + 'Je vous invite à découvrir les résultats du test marché réalisé par ' + this.getCompanyName() + ' pour l\'innovation ' +
        this._innovation.innovationCards[this._currentInnovationIndex].title + '\r\n' + '\r\n' + 'Allez sur ce lien: ' + url +  '\r\n' + '\r\n' + 'Vous pouvez afficher les résultats en filtrant par domaine, ' +
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

    if (this._innovation.innovationCards[this._currentInnovationIndex].principalMedia && this._innovation.innovationCards[this._currentInnovationIndex].principalMedia.type === 'PHOTO') {
      src = this._innovation.innovationCards[this._currentInnovationIndex].principalMedia.url;
    } else {
      const index = this._innovation.innovationCards[this._currentInnovationIndex].media.findIndex((media) => media.type === 'PHOTO');
      src = index === -1 ? defaultSrc : this._innovation.innovationCards[this._currentInnovationIndex].media[index].url;
    }

    if (src === '' || undefined) {
      src = defaultSrc;
    }

    return src;

  }


  /***
   * This function is to update the projects.
   * @param {Event} event
   */
  update(event: Event) {
    this.innovationCommonService.saveInnovation(this._innovation);
  }


  /***
   * This function returns the color according to the length of the input data.
   * @param {number} length
   * @param {number} limit
   * @returns {string}
   */
  getColor(length: number, limit: number) {
    return this.responseService.getColor(length, limit);
  }


  /***
   * This function is called when we click on the radio button, and assign the
   * clicked value to the numberOfSection.
   * @param {Event} event
   * @param {number} value
   */
  assignSectionValue(event: Event, value: number) {
    event.preventDefault();
    this._numberOfSections = value;
  }


  /***
   * This function is called when you click on the valid template button.
   * We assign the number of section value to the this.project.executiveReport.totalSections
   * and call the update function to save it in database.
   * @param {Event} event
   */
  generateExecutiveTemplate(event: Event) {
    event.preventDefault();
    this._innovation.executiveReport.totalSections = this._numberOfSections;
    this.update(event);
    window.location.reload();
  }


  /***
   * this function is to delete the executive template.
   * @param event
   */
  deleteExecutiveTemplate(event: Event) {
    event.preventDefault();
    this._innovation.executiveReport.totalSections = 0;
    this._innovation.executiveReport.sections = [{}];
    this.update(event);
    window.location.reload();
  }


  /***
   * This function is to return the src of the UMI intro image.
   * @returns {string}
   */
  getIntroSrc(): string {

    if (this.userLang === 'en') {
      return 'https://res.cloudinary.com/umi/image/upload/v1550482760/app/default-images/intro/UMI-en.png';
    }

    if (this.userLang === 'fr') {
      return 'https://res.cloudinary.com/umi/image/upload/v1550482760/app/default-images/intro/UMI-fr.png';
    }

  }


  /***
   * This function is returning the analytic percentage.
   * @param {number} value1
   * @param {number} value2
   * @returns {number}
   */
  percentageCalculation(value1: number, value2: number) {
    if (value2 === 0 || value2 === undefined) {
      return 0;
    } else {
      const percentage = (value2 / value1) * 100;
      return percentage === Infinity ? 0 : Math.floor(percentage);
    }
  }


  /***
   * This function display the menu options.
   * @param {Event} event
   */
  displayMenu(event: Event) {
    event.preventDefault();
    this._displayMenuWrapper = true;
  }


  /***
   * This function hides the menu options.
   * @param {Event} event
   */
  hideMenu(event: Event) {
    event.preventDefault();
    this._displayMenuWrapper = false;
  }


  /***
   * This function saves the comment of the operator.
   * @param event
   * @param {string} ob
   */
  saveOperatorComment(event: any, ob: string) {
    const objToSave = {};
    objToSave[ob] = {
      conclusion: event['content']
    };

    this.innovationService.updateMarketReport(this._innovation._id, objToSave).subscribe((response) => {
      this._innovation.marketReport = response;
      this.update(event);
    });
  }


  /***
   * This function is to filter by the countries.
   * @param {{continents: {[continent: string]: string}, allChecked: boolean}} event
   */
  filterByContinents(event: {continents: {[continent: string]: string}, allChecked: boolean}): void {
    if (!event.allChecked) {
      this.filterService.addFilter(
        {
          status: 'COUNTRIES',
          value: event.continents,
          questionId: 'worldmap',
          questionTitle: {en: 'worldmap', fr: 'mappemonde'}
        }
      );
    } else {
      this.filterService.deleteFilter('worldmap');
    }
  }

  filterPro(answer: Answer, event: Event) {
    event.preventDefault();
    const proFilter = this.filterService.filters['professionals'];
    this.filterService.addFilter({
      status: 'PROFESSIONALS',
      value: proFilter && Array.isArray(proFilter.value) ? [...proFilter.value, answer._id] : [answer._id],
      questionId: 'professionals',
      questionTitle: {en: 'Professionals', fr: 'Professionnels'}
    });
  }

  seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;

    this._sidebarTemplateValue = {
      animate_state: this._sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'Insight',
      size: '726px'
    };

  }


  /***
   * this function assign the value to exportType when we select one of the options
   * from the modal.
   * @param event
   * @param type
   */
  assignExportType(event: Event, type: string) {
    event.preventDefault();
    this._exportType = type;
  }


  /***
   * this function is to toggle the consent value based on the checbox is
   * checked or not.
   * @param event
   */
  toggleConsent(event: Event) {
    event.preventDefault();
    this._innovation.ownerConsent.value = !!event.target['checked'];
  }


  /***
   * this function calls the respective function based on the value of the
   * exportType. It is called by the Download button.
   * @param event
   */
  exportInnovation(event: Event) {
    event.preventDefault();

    this._innovation.ownerConsent.date = Date.now();

    this.innovationCommonService.saveInnovation(this._innovation);

    switch (this._exportType) {

      case('excel'):
        this.downloadExcel(event);
        break;

      case('executiveReport'):
        this.printExecutiveReport(event);
        break;

      case('respReport'):
        this.printAnswers(event);
        break;

      default:
        // Do nothing
    }

    this._exportType = '';

    this._openModal = false;

  }


  /***
   * this function will download the excel file.
   * @param event
   */
  private downloadExcel(event: Event) {
    event.preventDefault();
    window.open( this.answerService.getExportUrl(this._innovation._id, true));
  }

  /***
   * this function will download the response.
   * @param event
   */
  private printAnswers(event: Event) {

    event.preventDefault();

    this.answerService.getReportHTML(this._innovation._id, 'en').subscribe(html => {
        const reportWindow = window.open('', '');
        reportWindow.document.write(html);
        setTimeout(() => {
          reportWindow.focus();
          reportWindow.print();
          reportWindow.close();
        }, 500);
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });

  }


  /***
   * This functions is called when the user selects the executive report option.
   * @param {Event} event
   */
  private printExecutiveReport(event: Event) {
    event.preventDefault();
    window.print();
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  public getContact(): string {
    return environment.commercialContact;
  }

  public getMailto(): string {
    return `mailto:${environment.commercialContact}`;
  }

  /***
   * getting the current lang of the user.
   * @returns {string}
   */
  get userLang(): string {
    return this.translateService.currentLang || this.translateService.getBrowserLang() || 'en';
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

  get currentInnovationIndex(): number {
    return this._currentInnovationIndex;
  }

  get previewMode(): boolean {
    return this._previewMode;
  }

  get showDetails(): boolean {
    return this._showDetails;
  }

  get filters(): {[questionId: string]: Filter} {
    return this.filterService.filters;
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

  get answers(): Array<Answer> {
    return this._answers;
  }

  get filteredAnswers(): Array<Answer> {
    return this._filteredAnswers;
  }

  get countries(): Array<string> {
    return this._countries;
  }

  get continentTarget(): any {
    return this._innovation.settings ? this._innovation.settings.geography.continentTarget : {};
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

  getLogo(): string {
    return environment.logoSynthURL;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  get sidebarTemplateValue(): SidebarInterface {
    return this._sidebarTemplateValue;
  }

  set sidebarTemplateValue(value: SidebarInterface) {
    this._sidebarTemplateValue = value;
  }

  get menuButton(): boolean {
    return this._menuButton;
  }

  get displayMenuWrapper(): boolean {
    return this._displayMenuWrapper;
  }

  get innovationEndModal(): boolean {
    return this._innovationEndModal;
  }

  getCompanyName(): string {
    return environment.companyShortName;
  }

  getInnovationUrl(): string {
    return environment.clientUrl;
  }

  getCompanyURL(): string {
    return environment.companyURL;
  }

  getOwnerName(): string {
    return this._innovation.owner.name || '';
  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get isOwner(): boolean {
    return this._isOwner;
  }

  get openModal(): boolean {
    return this._openModal;
  }

  set openModal(value: boolean) {
    this._openModal = value;
  }

  get innovationExport(): boolean {
    return this._innovationExport;
  }

  get numberOfSections(): number {
    return this._numberOfSections;
  }

  get exportType(): string {
    return this._exportType;
  }

  get executiveTemplates(): Array<Executive> {
    return this._executiveTemplates;
  }

  get today(): Number {
    return this._today;
  }

  get mapInitialConfiguration(): { [p: string]: boolean } {
    return this._mapInitialConfiguration;
  }

  get answersOrigins(): {[c: string]: number} {
    return this._answersOrigins;
  }

  get activeSection(): string {
    return this._activeSection;
  }
  get adminMode(): boolean {
    return this._adminMode;
  }

  get scrollOn(): boolean {
    return this._scrollOn;
  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const wrapper = document.getElementById('answer-wrapper');
      if (wrapper) {
        const sections = Array.from(
          wrapper.querySelectorAll('section')
        );
        window.onscroll = () => {
          const scrollPosY = document.body.scrollTop;
          const section = sections.find((n) => scrollPosY <= n.getBoundingClientRect().top);
          this._activeSection = section ? section.id : '';
        };
      }
    }

  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
