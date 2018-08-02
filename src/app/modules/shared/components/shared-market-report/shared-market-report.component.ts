import { Component, OnInit, Input, AfterViewInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { PageScrollConfig } from 'ng2-page-scroll';
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
import { environment} from '../../../../../environments/environment';
import { Template } from '../../../sidebar/interfaces/template';
import { Clearbit } from '../../../../models/clearbit';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit, AfterViewInit {

  @Input() project: Innovation;
  @Input() adminMode: boolean;

  adminSide: boolean;
  sidebarTemplateValue: Template = {};
  scrollOn = false;
  menuButton = false;
  displayMenuWrapper = false;
  editMode = new Subject<boolean>(); // this is for the admin side.
  previewMode: boolean;
  disableButton: any;
  projectToBeFinished: boolean;
  endDate: Date;

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
              public filterService: FilterService) {
    this.filterService.reset();
  }

  ngOnInit() {
    this.isAdmin();
    this.today = Date.now();
    this._innoid = this.project._id;
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

    this.previewMode = this.project.previewMode;

    this.disableButton = this.project.status;

    this.projectFinishDate();

  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY !== 0) {
      this.scrollOn = true;
    } else {
      this.scrollOn = false;
    }

    this.menuButton = (this.getCurrentScroll() > 10);

  }

  getCurrentScroll() {
    if (typeof window.scrollY !== 'undefined' && window.scrollY >= 0) {
      return window.scrollY;
    }
    return 0;
  };

  isAdmin() {
    this.adminSide = this.location.path().slice(0, 6) === '/admin';
    this.adminMode = this.authService.adminLevel > 2;
  }

  projectFinishDate() {
    const index = this.project.statusLogs.findIndex(action => action.action === 'FINISH');
    this.endDate = index === -1 ? null : this.project.statusLogs[index].date;
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
    this._filteredAnswers = this.filterService.filter(this._answers);
  }

  confirmModal(event: Event) {
    event.preventDefault();
    this.projectToBeFinished = true;
  }

  changeStatus(event: Event, status: 'DONE'): void {
    this.projectToBeFinished = false;
    this.project.endDate = new Date();

    this.innovationService.updateStatus(this._innoid, status).first().subscribe((results) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS');
      this.disableButton = results.status;
    }, (error) => {
      this.translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  closeModal(event: Event) {
    event.preventDefault();
    this.projectToBeFinished = false;
  }

  toggleDetails(event: Event): void {
    event.preventDefault();
    const value = !this._showDetails;
    this._showDetails = value;
    this._showListProfessional = value;
  }

  toggleMode(event: Event): void {
    event.preventDefault();
   this.previewMode =  this.project.previewMode = event.target['checked'] === true;

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
    this.displayMenuWrapper = true;
  }

  hideMenu(event: Event) {
    event.preventDefault();
    this.displayMenuWrapper = false;
  }

  seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;

    this.sidebarTemplateValue = {
      animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: this.adminSide ? 'COMMON.EDIT_INSIGHT' : 'Insight',
      size: '726px'
    };

  }

  closeSidebar(value: string) {
    this.sidebarTemplateValue.animate_state = value;
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

  public printSynthesis(event: Event): void {
    event.preventDefault();
    window.print();
  }

  public percentageCalculataion(value1: number, value2: number) {
    let percentage = (value2 / value1) * 100;

    if (percentage === Infinity) {
      percentage = 0;
    }

    return Math.floor(percentage);
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

  formatCompanyName(name: string) {
    if (name) {
      return `${name[0].toUpperCase()}${name.slice(1)}`;
    }
    return '--';
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

  get showListProfessional(): boolean {
    return this._showListProfessional;
  }

  set showListProfessional(val: boolean) {
    this._showListProfessional = val;
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

}
