import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { ShareService } from '../../../../services/share/share.service';
import { InnovationSettings } from '../../../../models/innov-settings';

import * as _ from 'lodash';

@Component({
  selector: 'app-shared-project-settings',
  templateUrl: 'shared-project-settings.component.html',
  styleUrls: ['shared-project-settings.component.scss']
})

export class SharedProjectSettingsComponent implements OnInit {

  @Input() settings: InnovationSettings;
  @Input() adminMode: boolean;

  @Output() settingsChange = new EventEmitter<any>();

  private _displayCountriesToExcludeSection = false;
  private _displayCountriesCommentSection = false;
  private _displayCompanyToExcludeSection = false;
  private _displayCompanyToIncludeSection = false;
  private _displayPersonsToExcludeSection = false;
  private _displayKeywordsSection = false;
  private _displayCompanyCommentSection = false;

  constructor(private translateService: TranslateService,
              private _authService: AuthService,
              public shareService: ShareService) {
  }


  ngOnInit() {
    this.adminMode = this.adminMode && this._authService.adminLevel >= 1;

    if (this.settings) {
      // this._displayCountriesToExcludeSection = this.settings.geography && this.settings.geography.exclude && this.settings.geography.exclude.length > 0;
      this._displayCountriesCommentSection = this.settings.geography && this.settings.geography.comments && this.settings.geography.comments.length > 0;
      this._displayCompanyCommentSection = this.settings.companies.description.length > 0;
      // this._displayCompanyToExcludeSection = this.settings.companies && this.settings.companies.exclude && this.settings.companies.exclude.length > 0;
      // this._displayCompanyToIncludeSection = this.settings.companies && this.settings.companies.include && this.settings.companies.include.length > 0;
      this._displayPersonsToExcludeSection = this.settings.professionals && this.settings.professionals.exclude && this.settings.professionals.exclude.length > 0;
      this._displayKeywordsSection = this.settings.keywords.length > 0;
    }

  }

  get lang() {
    return this.translateService.currentLang;
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
      this.updateSettings();
    }
  }

  /**
   * Add a country to the exclusion list
   */
  public addCountryToExclude(event: {value: Array<string>}): void {
    this.settings.geography.exclude = event.value;
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
    this.settingsChange.emit(this.settings);
  }

}
