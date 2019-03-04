import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InnovationSettings } from '../../../../models/innov-settings';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { InnovationCommonService } from '../../../../services/innovation/innovation-common.service';

@Component({
  selector: 'app-shared-project-settings',
  templateUrl: 'shared-project-settings.component.html',
  styleUrls: ['shared-project-settings.component.scss']
})

export class SharedProjectSettingsComponent {

  @Input() set projectSettings(value: InnovationSettings) {
    this._innovationSettings = JSON.parse(JSON.stringify(value));
    this.getCommentSections();
  }

  @Input() set editable(value: boolean) {
    this._canEdit = value;
  }

  @Input() set modeAdmin(value: boolean) {
    this._adminMode = value;
  }

  @Input() set sideAdmin(value: boolean) {
    this._adminSide = value;
  }

  @Output() settingsChange = new EventEmitter<InnovationSettings>();

  private _innovationSettings: InnovationSettings;

  private _canEdit = false;

  private _adminMode = false;

  private _adminSide = false;

  private _displayCountriesToExcludeSection = false;

  private _displayCountriesCommentSection = false;

  private _displayCompanyToExcludeSection = false;

  private _displayCompanyToIncludeSection = false;

  private _displayPersonsToExcludeSection = false;

  private _displayKeywordsSection = false;

  private _displayCompanyCommentSection = false;

  constructor(private translateService: TranslateService,
              private innovationCommonService: InnovationCommonService) { }

  private getCommentSections() {
    this._displayCountriesCommentSection = this._innovationSettings.geography && this._innovationSettings.geography.comments && this._innovationSettings.geography.comments.length > 0;
    this._displayCompanyCommentSection = this._innovationSettings.companies.description.length > 0;
    this._displayPersonsToExcludeSection = this._innovationSettings.professionals && this._innovationSettings.professionals.exclude && this._innovationSettings.professionals.exclude.length > 0;
    this._displayKeywordsSection = this._innovationSettings.keywords.length > 0;
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
        initialData: this._innovationSettings && this._innovationSettings.geography ? this._innovationSettings.geography.exclude || [] : [],
        type: 'countries'
      },
      'excludedPeople': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.PROFESSIONALS.NEW_PROFESSIONAL_TO_EXCLUDE_PLACEHOLDER',
        initialData: this._innovationSettings && this._innovationSettings.professionals ? this._innovationSettings.professionals.exclude || [] : []
      },
      'excludedCompanies': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.COMPANIES.NEW_COMPANY_TO_EXCLUDE_PLACEHOLDER',
        initialData: this._innovationSettings && this._innovationSettings.companies ? this._innovationSettings.companies.exclude || [] : [],
        type: 'company'
      },
      'includedCompanies': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.COMPANIES.NEW_COMPANY_TO_INCLUDE_PLACEHOLDER',
        initialData: this._innovationSettings && this._innovationSettings.companies ? this._innovationSettings.companies.include || [] : [],
        type: 'company'
      },
      'keywords': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.KEYWORDS.PLACEHOLDER',
        initialData: this._innovationSettings ? this._innovationSettings.keywords || [] : []
      },
      'domainBL': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.BLACKLIST.DOMAINS_PLACEHOLDER',
        initialData: this._innovationSettings && this._innovationSettings.blacklist ? _.map(this._innovationSettings.blacklist.domains, (val: string) => {return {text: val}; }) : []
      },
      'emailBL': {
        placeholder: 'PROJECT_MODULE.SETUP.TARGETING.BLACKLIST.EMAILS_PLACEHOLDER',
        initialData: this._innovationSettings && this._innovationSettings.blacklist ? _.map(this._innovationSettings.blacklist.emails, (val: string) => {return {text: val}; }) : []
      },
      'peopleBL': {
        placeholder: 'Ex. sjobs@apple.com',
        initialData: this._innovationSettings && this._innovationSettings.blacklist ? _.map(this._innovationSettings.blacklist.people, (val: string) => {return {text: val}; }) : []
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
      this._innovationSettings.geography.continentTarget = event.continents;
      this.updateSettings();
    }
  }


  /**
   * Add a country to the exclusion list
   */
  addCountryToExclude(event: {value: Array<string>}): void {
    this._innovationSettings.geography.exclude = event.value;
    // this.showGeographyError = this.innovationSettings.geography.exclude.length === 0;
    this.updateSettings();
  }


  get continentTarget(): any {
    return this._innovationSettings ? this._innovationSettings.geography.continentTarget : {};
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
    this._innovationSettings.companies.exclude = event.value;
    this.updateSettings();
  }


  get displayCompanyToExcludeSection(): boolean {
    return this._displayCompanyToExcludeSection;
  }


  set displayCompanyToExcludeSection(value: boolean) {
    this._displayCompanyToExcludeSection = value;
  }


  addCompanyToInclude(event: {value: Array<string>}): void {
    this._innovationSettings.companies.include = event.value;
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
    this._innovationSettings.professionals.exclude = event.value;
    this.updateSettings();
  }


  get displayPersonsToExcludeSection(): boolean {
    return this._displayPersonsToExcludeSection;
  }


  set displayPersonsToExcludeSection(value: boolean) {
    this._displayPersonsToExcludeSection = value;
  }


  get comments(): string {
    return this._innovationSettings ? this._innovationSettings.comments : '';
  }


  set comments(value: string) {
    this._innovationSettings.comments = value;
    this.updateSettings();
  }


  get displayKeywordsSection(): boolean {
    return this._displayKeywordsSection;
  }


  set displayKeywordsSection(value: boolean) {
    this._displayKeywordsSection = value;
  }


  addKeywordToExclude(event: {value: Array<string>}): void {
    this._innovationSettings.keywords = event.value;
    this.updateSettings();
  }


  addDomainToExclude(event: {value: Array<string>}): void {
    this._innovationSettings.blacklist.domains = _.map(event.value, (val: any) => { return val['text']; });
    this.updateSettings();
  }


  addEMailToExclude(event: {value: Array<string>}): void {
    this._innovationSettings.blacklist.emails = _.map(event.value, (val: any) => { return val['text']; });
    this.updateSettings();
  }


  updateSettings() {
    if (this._canEdit) {
      this.innovationCommonService.setNotifyChanges(true);
      this.settingsChange.emit(this._innovationSettings);
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

  get innovationSettings(): InnovationSettings {
    return this._innovationSettings;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  get adminMode(): boolean {
    return this._adminMode;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

}
