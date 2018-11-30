import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InnovationSettings } from '../../../../models/innov-settings';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-shared-project-settings',
  templateUrl: 'shared-project-settings.component.html',
  styleUrls: ['shared-project-settings.component.scss']
})

export class SharedProjectSettingsComponent implements OnInit {

  @Input() set projectSettings(value: InnovationSettings) {
    this.innovationSettings = JSON.parse(JSON.stringify(value));
    this.getCommentSections();
  }

  @Input() set editable(value: boolean) {
    this.canEdit = value;
  }

  @Input() set modeAdmin(value: boolean) {
    this.adminMode = value;
  }

  @Input() set sideAdmin(value: boolean) {
    this.adminSide = value;
  }

  @Output() settingsChange = new EventEmitter<InnovationSettings>();

  innovationSettings: InnovationSettings;

  canEdit = false;

  adminMode = false;

  adminSide = false;

  private _displayCountriesToExcludeSection = false;

  private _displayCountriesCommentSection = false;

  private _displayCompanyToExcludeSection = false;

  private _displayCompanyToIncludeSection = false;

  private _displayPersonsToExcludeSection = false;

  private _displayKeywordsSection = false;

  private _displayCompanyCommentSection = false;

  constructor(private translateService: TranslateService) {}


  ngOnInit() {
  }


  private getCommentSections() {
    this._displayCountriesCommentSection = this.innovationSettings.geography && this.innovationSettings.geography.comments && this.innovationSettings.geography.comments.length > 0;
    this._displayCompanyCommentSection = this.innovationSettings.companies.description.length > 0;
    this._displayPersonsToExcludeSection = this.innovationSettings.professionals && this.innovationSettings.professionals.exclude && this.innovationSettings.professionals.exclude.length > 0;
    this._displayKeywordsSection = this.innovationSettings.keywords.length > 0;
  }


  /**
   * This configuration tells the directive what text to use for the placeholder and if it exists,
   * the initial data to show.
   * @param type
   * @returns {any|{placeholder: string, initialData: string}}
   */
  getConfig(type: string): any {
    const _inputConfig = {
      'countries': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.GEOGRAPHY.NEW_COUNTRY_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.innovationSettings && this.innovationSettings.geography ? this.innovationSettings.geography.exclude || [] : [],
        type: 'countries'
      },
      'excludedPeople': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.PROFESSIONALS.NEW_PROFESSIONAL_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.innovationSettings && this.innovationSettings.professionals ? this.innovationSettings.professionals.exclude || [] : []
      },
      'excludedCompanies': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.COMPANIES.NEW_COMPANY_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.innovationSettings && this.innovationSettings.companies ? this.innovationSettings.companies.exclude || [] : [],
        type: 'company'
      },
      'includedCompanies': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.COMPANIES.NEW_COMPANY_TO_INCLUDE_PLACEHOLDER',
        initialData: this.innovationSettings && this.innovationSettings.companies ? this.innovationSettings.companies.include || [] : [],
        type: 'company'
      },
      'keywords': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.KEYWORDS.PLACEHOLDER',
        initialData: this.innovationSettings ? this.innovationSettings.keywords || [] : []
      },
      'domainBL': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.BLACKLIST.DOMAINS_PLACEHOLDER',
        initialData: this.innovationSettings && this.innovationSettings.blacklist ? _.map(this.innovationSettings.blacklist.domains, (val: string) => {return {text: val}; }) : []
      },
      'emailBL': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.BLACKLIST.EMAILS_PLACEHOLDER',
        initialData: this.innovationSettings && this.innovationSettings.blacklist ? _.map(this.innovationSettings.blacklist.emails, (val: string) => {return {text: val}; }) : []
      },
      'peopleBL': {
        placeholder: 'Ex. sjobs@apple.com',
        initialData: this.innovationSettings && this.innovationSettings.blacklist ? _.map(this.innovationSettings.blacklist.people, (val: string) => {return {text: val}; }) : []
      }
    };
    return _inputConfig[type] || {
      placeholder: 'Input',
      initialData: ''
    };
  }


  /**
   * This method receives the event from a click in some continent. It should update the geography.continentTarget
   * @param event
   */
  continentModificationDrain(event: any) {
    if (event) {
      this.innovationSettings.geography.continentTarget = event.continents;
      this.updateSettings();
    }
  }


  /**
   * Add a country to the exclusion list
   */
  addCountryToExclude(event: {value: Array<string>}): void {
    this.innovationSettings.geography.exclude = event.value;
    // this.showGeographyError = this.innovationSettings.geography.exclude.length === 0;
    this.updateSettings();
  }


  get continentTarget(): any {
    return this.innovationSettings ? this.innovationSettings.geography.continentTarget : {};
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


  addCompanyToExclude(event: {value: Array<string>}): void {
    this.innovationSettings.companies.exclude = event.value;
    this.updateSettings();
  }


  get displayCompanyToExcludeSection(): boolean {
    return this._displayCompanyToExcludeSection;
  }


  set displayCompanyToExcludeSection(value: boolean) {
    this._displayCompanyToExcludeSection = value;
  }


  addCompanyToInclude(event: {value: Array<string>}): void {
    this.innovationSettings.companies.include = event.value;
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


  addPeopleToExclude(event: {value: Array<string>}): void {
    this.innovationSettings.professionals.exclude = event.value;
    this.updateSettings();
  }


  get displayPersonsToExcludeSection(): boolean {
    return this._displayPersonsToExcludeSection;
  }


  set displayPersonsToExcludeSection(value: boolean) {
    this._displayPersonsToExcludeSection = value;
  }


  get comments(): string {
    return this.innovationSettings ? this.innovationSettings.comments : '';
  }


  set comments(value: string) {
    this.innovationSettings.comments = value;
    this.updateSettings();
  }


  get displayKeywordsSection(): boolean {
    return this._displayKeywordsSection;
  }


  set displayKeywordsSection(value: boolean) {
    this._displayKeywordsSection = value;
  }


  addKeywordToExclude(event: {value: Array<string>}): void {
    this.innovationSettings.keywords = event.value;
    this.updateSettings();
  }


  addDomainToExclude(event: {value: Array<string>}): void {
    this.innovationSettings.blacklist.domains = _.map(event.value, (val: any) => { return val['text']; });
    this.updateSettings();
  }


  addEMailToExclude(event: {value: Array<string>}): void {
    this.innovationSettings.blacklist.emails = _.map(event.value, (val: any) => { return val['text']; });
    this.updateSettings();
  }


  updateSettings() {
    if (this.canEdit) {
      this.settingsChange.emit(this.innovationSettings);
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


  get lang() {
    return this.translateService.currentLang;
  }

}
