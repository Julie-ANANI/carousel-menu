import {Component, OnInit, Input, AfterViewInit, HostListener, OnDestroy} from '@angular/core';
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
import { Innovation } from '../../../../models/innovation';
import { environment } from '../../../../../environments/environment';
import { Template } from '../../../sidebar/interfaces/template';
import { Clearbit } from '../../../../models/clearbit';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subject } from 'rxjs/Subject';
import { ShareService } from '../../../../services/share/share.service';
import { Share } from '../../../../models/share';
import { CampaignCalculationService } from '../../../../services/campaign/campaign-calculation.service';
import { Executive, executiveTemplate } from './models/template';
import { ResponseService } from './services/response.service';
import { InnovationCommonService } from '../../../../services/innovation/innovation-common.service';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this.innovation = value;
  }

  // @Input() project: Innovation;

  @Input() adminMode: boolean;

  @Input() sharable = false;

  ngUnsubscribe: Subject<any> = new Subject();

  innovation: Innovation = {};

  spinnerDisplay = true;

  private _adminSide: boolean;

  private _previewMode: boolean;

  private _currentInnovationIndex = 0;

  private _answers: Array<Answer> = [];

  private _filteredAnswers: Array<Answer> = [];

  private _countries: Array<string> = [];

  private _questions: Array<Question> = [];

  private _campaignsStats: {
    nbPros: number,
    nbProsSent: number,
    nbProsOpened: number,
    nbProsClicked: number,
    nbValidatedResp: number
  };

  scrollOn = false;

  private _showDetails: boolean;

  private _projectToBeFinished: boolean;

  today: Number;

  private _menuButton = false;

  private _displayMenuWrapper = false;

  numberOfSections: number;

  executiveTemplates: Executive;

  private _modalAnswer: Answer = null;

  private _sidebarTemplateValue: Template = {};

  editMode = new Subject<boolean>(); // this is for the admin side.

  private _companies: Array<Clearbit>;

  private _showListProfessional = true;



  public activeSection: string;
  // public
  public objectKeys = Object.keys;
  public mapInitialConfiguration: {[continent: string]: boolean};

  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert


  constructor(private translateService: TranslateService,
              private answerService: AnswerService,
              private translateNotificationsService: TranslateNotificationsService,
              private location: Location,
              private innovationService: InnovationService,
              private authService: AuthService,
              private shareService: ShareService,
              private filterService: FilterService,
              private campaignCalculationService: CampaignCalculationService,
              private responseService: ResponseService,
              private innovationCommonService: InnovationCommonService) { }

  ngOnInit() {
    this.filterService.reset();
    this.initializeReport();
    PageScrollConfig.defaultDuration = 800;
    //
  }


  /***
   * This function is calling all the initial functions.
   */
  private initializeReport() {
    this.spinnerDisplay = true;
    this.isAdminSide();
    this.initializeVariable();
    this.getAnswers();
    this.getCampaign();
    this.resetMap();
    this.presets();
    this.spinnerDisplay = false;
  }


  /**
   * This function is checking the are we on the admin side, and if yes than also
   * checking the admin level.
   */
  private isAdminSide() {
    this._adminSide = this.location.path().slice(0, 6) === '/admin';
    this.adminMode = this.authService.adminLevel > 2;
  }


  /***
   *This function is to initialize the variables regarding the innovation and the project.
   */
  private initializeVariable() {

    /***
     * here we are registering the index of the lang of the user and according to that we display the innovation.
     * @type {number}
     */
    const index = this.innovation.innovationCards.findIndex((items) => items.lang === this.lang);
    this._currentInnovationIndex = index !== -1 ? index : 0;

    /***
     * this is to check, if the admin make the synthesis available before the status is Done.
     * @type {boolean | undefined}
     * @private
     */
    this._previewMode = this.innovation.previewMode || false;

    /***
     * this is to display on the front page.
     * @type {number}
     */
    this.today = Date.now();

    /***
     * Client side to toggle the full view.
     * @type {boolean}
     * @private
     */
    this._showDetails = true;

    /***
     * we are checking do we have any template.
     * @type {number | undefined}
     */
    this.numberOfSections = this.innovation.executiveReport.totalSections || 0;

    /***
     * assinging the value of the executive template.
     * @type {Executive}
     */
    this.executiveTemplates = executiveTemplate;

    /***
     * this is when we update the innovation in any sub component,
     * we are listening that update and will update the innovation attribute.
     */
    this.innovationCommonService.getInnovation().takeUntil(this.ngUnsubscribe).subscribe((response: Innovation) => {
      if (response) {
        this.innovation = response;
      }
      console.log(response);
    });

  }


  /***
   * This function is to fetch the answers from the server.
   */
  private getAnswers() {
    this.answerService.getInnovationValidAnswers(this.innovation._id).first().subscribe((response) => {
      this._answers = response.answers.sort((a, b) => {
        return b.profileQuality - a.profileQuality;
      });

      /***
       * passing the non filtered answers to the service to use in the executive report.
       */
      this.responseService.setExecutiveAnswers(this._answers);

      this._filteredAnswers = this._answers;

      this.filterService.filtersUpdate.subscribe((_) => {
        this._filteredAnswers = this.filterService.filter(this._answers);
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
    this.innovationService.campaigns(this.innovation._id).first().subscribe((results) => {
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
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  /***
   * This function is to reset the map configuration.
   */
  private resetMap() {
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


  /***
   * This function is to get the questions.
   */
  private presets() {
   if (this.innovation.preset && this.innovation.preset.sections) {
     this._questions = this.responseService.getPresets(this.innovation);
   }
  }


  /***
   * We are getting the scroll value for the sticky bar.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollOn = window.scrollY !== 0;
    this._menuButton = (this.getCurrentScroll() > 150);
  }

  private getCurrentScroll() {
    if (typeof window.scrollY !== 'undefined' && window.scrollY >= 0) {
      return window.scrollY;
    }
    return 0;
  };


  /***
   * This function toggles the view.
   * @param {Event} event
   */
  toggleDetails(event: Event) {
    event.preventDefault();
    const value = !this._showDetails;
    this._showDetails = value;
    this._showListProfessional = value;
  }


  /***
   * This function make the market report available to the client but it will be partial report.
   * @param {Event} event
   */
  enablePreviewMode(event: Event) {
    event.preventDefault();

    this._previewMode =  this.innovation.previewMode = event.target['checked'] === true;

    if (event.target['checked']) {
      this.innovationService.save(this.innovation._id, this.innovation).first().subscribe( () => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS_VISIBLE');
      });
    } else {
      this.innovationService.save(this.innovation._id, this.innovation).first().subscribe( () => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS_NOT_VISIBLE');
      });
    }

  }


  /***
   * This function call the confirmation modal to ask for the confirmation to end the project.
   * @param {Event} event
   */
  endProjectModal(event: Event) {
    event.preventDefault();
    this._projectToBeFinished = true;
  }


  /***
   * This function is to close the end project confirmation modal.
   * @param {Event} event
   */
  closeModal(event: Event) {
    event.preventDefault();
    this._projectToBeFinished = false;
  }


  /***
   * This function will make the project end and synthesis will be available to the client.
   * @param {Event} event
   * @param {"DONE"} status
   */
  endProject(event: Event, status: 'DONE'): void {
    this._projectToBeFinished = false;

    this.innovationService.updateStatus(this.innovation._id, status).first().subscribe((response) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS');
      this.innovation = response;
      this.innovationCommonService.setInnovation(this.innovation);
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

    this.shareService.shareSynthesis(this.innovation._id).first().subscribe((response: Share) => {
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

      subject = 'Results - ' + this.innovation.innovationCards[this._currentInnovationIndex].title;

      message = encodeURI('Hello,' + '\r\n' + '\r\n' + 'I invite you to discover the results of the market test carried out by ' + this.getCompanyName() + ' for the innovation ' +
        this.innovation.innovationCards[this._currentInnovationIndex].title + '\r\n' + '\r\n' + 'Go on this link: ' + url +  '\r\n' + '\r\n' + 'You can view the results by filtering by domain, ' +
        'geographical location, person etc. ' + '\r\n' + '\r\n' + 'Cordially, ' + '\r\n' + '\r\n' + this.getOwnerName());

    }

    if (this.lang === 'fr') {

      subject = 'Résultats - ' + this.innovation.innovationCards[this._currentInnovationIndex].title;

      message = encodeURI('Bonjour,' + '\r\n' + '\r\n' + 'Je vous invite à découvrir les résultats du test marché réalisé par ' + this.getCompanyName() + ' pour l\'innovation ' +
        this.innovation.innovationCards[this._currentInnovationIndex].title + '\r\n' + '\r\n' + 'Allez sur ce lien: ' + url +  '\r\n' + '\r\n' + 'Vous pouvez afficher les résultats en filtrant par domaine, ' +
        'emplacement géographique, personne etc. ' + '\r\n' + '\r\n' + 'Cordialement, ' + '\r\n' + '\r\n' + this.getOwnerName());
    }

    window.location.href = 'mailto:' + '?subject=' + subject  + '&body=' + message;

  }


  /***
   * This functions is called when the user clicks on the print button, and it print the synthesis.
   * @param {Event} event
   */
  printSynthesis(event: Event) {
    event.preventDefault();
    window.print();
  }


  /***
   * This function is getting the image source according to the current lang of the user.
   * @returns {string}
   */
  getSrc(): string {
    let src = '';
    const defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1535383716/app/default-images/image-not-available.png';

    if (this.innovation.innovationCards[this._currentInnovationIndex].principalMedia && this.innovation.innovationCards[this._currentInnovationIndex].principalMedia.type === 'PHOTO') {
      src = this.innovation.innovationCards[this._currentInnovationIndex].principalMedia.url;
    } else {
      const index = this.innovation.innovationCards[this._currentInnovationIndex].media.findIndex((media) => media.type === 'PHOTO');
      src = index === -1 ? defaultSrc : this.innovation.innovationCards[this._currentInnovationIndex].media[index].url;
    }

    if (src === '' || undefined) {
      src = defaultSrc;
    }

    return src;

  }


  /***
   * This function is to update the project.
   * @param {Event} event
   */
  update(event: Event) {
    // TODO: add project status DONE
    if (this.innovation.status) {
     this.innovationCommonService.saveInnovation(this.innovation);
    }
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
    this.numberOfSections = value;
  }


  /***
   * This is function is called when you click on the valid template button.
   * We assign the number of section value to the this.project.executiveReport.totalSections
   * and call the update function to save it in database.
   * @param {Event} event
   */
  generateExecutiveTemplate(event: Event) {
    event.preventDefault();
    this.innovation.executiveReport.totalSections = this.numberOfSections;
    this.update(event);
  }


  /***
   * This function is to return the src of the UMI intro image.
   * @returns {string}
   */
  getIntroSrc(): string {
    return `https://res.cloudinary.com/umi/image/upload/v1539157710/app/default-images/intro/UMI-${this.lang}.png`;
  }


  /***
   * This function is returning the analytic percentage.
   * @param {number} value1
   * @param {number} value2
   * @returns {number}
   */
  percentageCalculation(value1: number, value2: number) {
    return this.campaignCalculationService.analyticPercentage(value1, value2);
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

    this.innovationService.updateMarketReport(this.innovation._id, objToSave).first().subscribe((response) => {
      this.innovation.marketReport = response;
      this.innovationCommonService.setInnovation(this.innovation);
    });

  }


  /***
   * This function is to filter by the countries.
   * @param {{countries: Array<string>; allChecked: boolean}} event
   */
  filterByCountries(event: {countries: Array<string>, allChecked: boolean}): void {
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













  formatCompanyName(name: string) {
    if (name) {
      return `${name[0].toUpperCase()}${name.slice(1)}`;
    }
    return '--';
  }

  getDomainName(): string {
    return environment.domain;
  }

  /***
   * getting the current lang of the user.
   * @returns {string}
   */
  get lang(): string {
    return this.translateService.currentLang || this.translateService.getBrowserLang() || 'en';
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
    return this.innovation.settings ? this.innovation.settings.geography.continentTarget : {};
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

  get sidebarTemplateValue(): Template {
    return this._sidebarTemplateValue;
  }

  get menuButton(): boolean {
    return this._menuButton;
  }

  get displayMenuWrapper(): boolean {
    return this._displayMenuWrapper;
  }

  get projectToBeFinished(): boolean {
    return this._projectToBeFinished;
  }

  getCompanyName(): string {
    return environment.companyShortName;
  }

  getInnovationUrl(): string {
    return environment.innovationUrl;
  }

  getCompanyURL(): string {
    return environment.companyURL;
  }

  getOwnerName(): string {
    return this.innovation.owner.name || '';
  }

  ngAfterViewInit() {
    const wrapper = document.getElementById('answer-wrapper');

    if (wrapper) {
      const sections = Array.from(
        wrapper.querySelectorAll('section')
      );
      window.onscroll = () => {
        const scrollPosY = document.body.scrollTop;
        const section = sections.find((n) => scrollPosY <= n.getBoundingClientRect().top);
        this.activeSection = section ? section.id : '';
      };
    }

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.unsubscribe();
  }

}
