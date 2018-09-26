import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { ShareService } from '../../../../services/share/share.service';
import { InnovationSettings } from '../../../../models/innov-settings';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Router } from '@angular/router';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-shared-project-settings',
  templateUrl: 'shared-project-settings.component.html',
  styleUrls: ['shared-project-settings.component.scss']
})

export class SharedProjectSettingsComponent implements OnInit {

  @Input() settings: InnovationSettings;
  @Input() adminMode: boolean;
  @Input() showTargetingFieldError: Subject<boolean>;
  @Input() projectStatus: string;
  @Input() innovId: string;

  @Output() settingsChange = new EventEmitter<any>();

  private _showMarketError: boolean;
  private _showGeographyError: boolean;
  private _adminSide: boolean;
  private _deleteModal = false;

  private _displayCountriesToExcludeSection = false;
  private _displayCountriesCommentSection = false;
  private _displayCompanyToExcludeSection = false;
  private _displayCompanyToIncludeSection = false;
  private _displayPersonsToExcludeSection = false;
  private _displayKeywordsSection = false;
  private _displayCompanyCommentSection = false;

  constructor(private translateService: TranslateService,
              private authService: AuthService,
              public shareService: ShareService,
              private location: Location,
              private innovationService: InnovationService,
              private router: Router,
              private translateNotificationsService: TranslateNotificationsService) {}


  ngOnInit() {
    this.isAdmin();

    if (this.settings) {
      this._displayCountriesCommentSection = this.settings.geography && this.settings.geography.comments && this.settings.geography.comments.length > 0;
      this._displayCompanyCommentSection = this.settings.companies.description.length > 0;
      this._displayPersonsToExcludeSection = this.settings.professionals && this.settings.professionals.exclude && this.settings.professionals.exclude.length > 0;
      this._displayKeywordsSection = this.settings.keywords.length > 0;
    }

    if (!this._adminSide) {
      this.showTargetingFieldError.subscribe((value: any) => {
        if (value) {
          this._showMarketError = this.settings.market.comments.length === 0;
          this.checkGeographyError();
        } else {
          this._showMarketError = false;
        }
      });
    }

  }

  isAdmin() {
    this.adminMode = this.adminMode && this.authService.adminLevel >= 1;
    this._adminSide = this.location.path().slice(0, 6) === '/admin';
  }

  /**
   * This configuration tells the directive what text to use for the placeholder and if it exists,
   * the initial data to show.
   * @param type
   * @returns {any|{placeholder: string, initialData: string}}
   */
  public getConfig(type: string): any {
    const _inputConfig = {
      'countries': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.GEOGRAPHY.NEW_COUNTRY_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.settings && this.settings.geography ? this.settings.geography.exclude || [] : [],
        type: 'countries'
      },
      'excludedPeople': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.PROFESSIONALS.NEW_PROFESSIONAL_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.settings && this.settings.professionals ? this.settings.professionals.exclude || [] : []
      },
      'excludedCompanies': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.COMPANIES.NEW_COMPANY_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.settings && this.settings.companies ? this.settings.companies.exclude || [] : [],
        type: 'company'
      },
      'includedCompanies': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.COMPANIES.NEW_COMPANY_TO_INCLUDE_PLACEHOLDER',
        initialData: this.settings && this.settings.companies ? this.settings.companies.include || [] : [],
        type: 'company'
      },
      'keywords': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.KEYWORDS.PLACEHOLDER',
        initialData: this.settings ? this.settings.keywords || [] : []
      },
      'domainBL': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.BLACKLIST.DOMAINS_PLACEHOLDER',
        initialData: this.settings && this.settings.blacklist ? _.map(this.settings.blacklist.domains, (val: string) => {return {text: val}; }) : []
      },
      'emailBL': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.BLACKLIST.EMAILS_PLACEHOLDER',
        initialData: this.settings && this.settings.blacklist ? _.map(this.settings.blacklist.emails, (val: string) => {return {text: val}; }) : []
      },
      'peopleBL': {
        placeholder: 'Ex. sjobs@apple.com',
        initialData: this.settings && this.settings.blacklist ? _.map(this.settings.blacklist.people, (val: string) => {return {text: val}; }) : []
      }
    };
    return _inputConfig[type] || {
          placeholder: 'Input',
          initialData: ''
        };
  }

  /****************************************************************************
   ******************************** Geography *********************************
   ****************************************************************************/

  /**
   * This method receives the event from a click in some continent. It should update the geography.continentTarget
   * @param event
   */
  public continentModificationDrain(event: any) {
    if (event) {
      this.settings.geography.continentTarget = event.continents;
      this.checkGeographyError();
      this.updateSettings();
    }
  }

  /**
   * Add a country to the exclusion list
   */
  public addCountryToExclude(event: {value: Array<string>}): void {
    this.settings.geography.exclude = event.value;
    this._showGeographyError = this.settings.geography.exclude.length === 0;
    this.checkGeographyError();
    this.updateSettings();
  }

  get continentTarget(): any {
    return this.settings ? this.settings.geography.continentTarget : {};
  }

  get displayCountriesToExcludeSection(): boolean {
    return this._displayCountriesToExcludeSection;
  }

  set displayCountriesToExcludeSection(value: boolean) {
    this._displayCountriesToExcludeSection = value;
  }

  get displayCountriesCommentSection(): boolean {
    return this._displayCountriesCommentSection;
  }

  set displayCountriesCommentSection(value: boolean) {
    this._displayCountriesCommentSection = value;
  }

  /****************************************************************************
   ******************************* Enterprises ********************************
   ****************************************************************************/

  public addCompanyToExclude(event: {value: Array<string>}): void {
    this.settings.companies.exclude = event.value;
    this.updateSettings();
  }

  get displayCompanyToExcludeSection(): boolean {
    return this._displayCompanyToExcludeSection;
  }

  set displayCompanyToExcludeSection(value: boolean) {
    this._displayCompanyToExcludeSection = value;
  }

  public addCompanyToInclude(event: {value: Array<string>}): void {
    this.settings.companies.include = event.value;
    this.updateSettings();
  }

  get displayCompanyToIncludeSection(): boolean {
    return this._displayCompanyToIncludeSection;
  }

  set displayCompanyToIncludeSection(value: boolean) {
    this._displayCompanyToIncludeSection = value;
  }

  set displayCompanyCommentSection(value: boolean) {
    this._displayCompanyCommentSection = value;
  }

  get displayCompanyCommentSection(): boolean {
    return this._displayCompanyCommentSection;
  }

  /****************************************************************************
   ****************************** Professionals *******************************
   ****************************************************************************/

  public addPeopleToExclude(event: {value: Array<string>}): void {
    this.settings.professionals.exclude = event.value;
    this.updateSettings();
  }

  get displayPersonsToExcludeSection(): boolean {
    return this._displayPersonsToExcludeSection;
  }

  set displayPersonsToExcludeSection(value: boolean) {
    this._displayPersonsToExcludeSection = value;
  }

  /****************************************************************************
   **************************** Keywords & Comments ***************************
   ****************************************************************************/

  get comments(): string {
    return this.settings ? this.settings.comments : '';
  }

  set comments(value: string) {
    this.settings.comments = value;
    this.updateSettings();
  }

  get displayKeywordsSection(): boolean {
    return this._displayKeywordsSection;
  }

  set displayKeywordsSection(value: boolean) {
    this._displayKeywordsSection = value;
  }

  public addKeywordToExclude(event: {value: Array<string>}): void {
    this.settings.keywords = event.value;
    this.updateSettings();
  }

  /****************************************************************************
   ********************************* Blacklist ********************************
   ****************************************************************************/

  public addDomainToExclude(event: {value: Array<string>}): void {
    this.settings.blacklist.domains = _.map(event.value, (val: any) => { return val['text']; });
    this.updateSettings();
  }

  public addEMailToExclude(event: {value: Array<string>}): void {
    this.settings.blacklist.emails = _.map(event.value, (val: any) => { return val['text']; });
    this.updateSettings();
  }

  /**
   * After all the settings modifications are done, send them back to the project to be saved.
   */
  public updateSettings() {
    if (this._projectStatus) {
      this.settingsChange.emit(this.settings);
    }
  }

  checkGeographyError() {
    if (this.settings.geography.exclude.length === 0 && this.settings.geography.comments.length === 0
      && !this.settings.geography.continentTarget.russia && !this.settings.geography.continentTarget.oceania
      && !this.settings.geography.continentTarget.europe && !this.settings.geography.continentTarget.asia
      && !this.settings.geography.continentTarget.americaSud && !this.settings.geography.continentTarget.americaNord
      && !this.settings.geography.continentTarget.africa) {
      this._showGeographyError = true;
    } else {
      this._showGeographyError = false;
    }
  }

  getColor(length: number) {
    if (length <= 0) {
      return '#EA5858';
    } else if (length > 0 && length < 250) {
      return '#f0ad4e';
    } else {
      return '#2ECC71';
    }
  }


  showDeleteModal(event: Event) {
    event.preventDefault();
    this._deleteModal = true;
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._deleteModal = false;
  }

  deleteProject(event: Event) {
    event.preventDefault();

    this.innovationService.remove(this.innovId).pipe(first()).subscribe((res: any) => {
      this.router.navigate(['/project']);
      this.translateNotificationsService.success('ERROR.PROJECT.DELETED', 'ERROR.PROJECT.DELETED_PROJECT_TEXT');
    }, (err: any) => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.NOT_DELETED_TEXT');
    })
  }

  get lang() {
    return this.translateService.currentLang;
  }

  get _projectStatus(): boolean {
    return this.projectStatus === 'EDITING' || this.projectStatus === 'SUBMITTED' || this._adminSide;
  }

  get showMarketError(): boolean {
    return this._showMarketError;
  }

  set showMarketError(value: boolean) {
    this._showMarketError = value;
  }

  get showGeographyError(): boolean {
    return this._showGeographyError;
  }


  get adminSide(): boolean {
    return this._adminSide;
  }


  get deleteModal(): boolean {
    return this._deleteModal;
  }

}
