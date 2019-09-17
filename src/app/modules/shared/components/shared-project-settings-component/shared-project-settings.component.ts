import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../models/innovation';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-shared-project-settings',
  templateUrl: 'shared-project-settings.component.html',
  styleUrls: ['shared-project-settings.component.scss']
})

export class SharedProjectSettingsComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this._innovation = value;
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

  private _innovation: Innovation = {};

  private _canEdit = false;

  private _adminMode = false;

  private _adminSide = false;

  private _displayCountriesCommentSection = false;

  private _displayPersonsToExcludeSection = false;

  private _displayKeywordsSection = false;

  private _displayCompanyCommentSection = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private translateService: TranslateService,
              private innovationFrontService: InnovationFrontService) { }

  ngOnInit(): void {
    this.getCommentSections();
  }

  private getCommentSections() {
    this._displayCountriesCommentSection = this._innovation.settings.geography && this._innovation.settings.geography.comments && this._innovation.settings.geography.comments.length > 0;
    this._displayCompanyCommentSection = this._innovation.settings.companies.description.length > 0;
    this._displayPersonsToExcludeSection = this._innovation.settings.professionals && this._innovation.settings.professionals.exclude && this._innovation.settings.professionals.exclude.length > 0;
    this._displayKeywordsSection = this._innovation.settings.keywords.length > 0;
  }


  /**
   * This configuration tells the directive what text to use for the placeholder and if it exists,
   * the initial data to show.
   * @param type
   * @returns {any|{placeholder: string, initialData: string}}
   */
  getConfig(type: string): any {
    switch (type) {
      case 'countries':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.GEOGRAPHY.NEW_COUNTRY_TO_EXCLUDE_PLACEHOLDER',
            initialData: this._innovation.settings && this._innovation.settings.geography ? this._innovation.settings.geography.exclude || [] : [],
            type: 'countries'
        };
      case 'excludedPeople':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.PROFESSIONALS.NEW_PROFESSIONAL_TO_EXCLUDE_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.professionals ? this._innovation.settings.professionals.exclude || [] : []
        };
      case 'excludedCompanies':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.COMPANIES.NEW_COMPANY_TO_EXCLUDE_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.companies ? this._innovation.settings.companies.exclude || [] : [],
          type: 'company'
        };
      case 'includedCompanies':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.COMPANIES.NEW_COMPANY_TO_INCLUDE_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.companies ? this._innovation.settings.companies.include || [] : [],
          type: 'company'
        };
      case 'keywords':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.KEYWORDS.PLACEHOLDER',
          initialData: this._innovation.settings ? this._innovation.settings.keywords || [] : []
        };
      case 'domainBL':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.BLACKLIST.DOMAINS_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.blacklist ? _.map(this._innovation.settings.blacklist.domains, (val: string) => {return {text: val}; }) : []
        };
      case 'emailBL':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.BLACKLIST.EMAILS_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.blacklist ? _.map(this._innovation.settings.blacklist.emails, (val: string) => {return {text: val}; }) : []
        };
      case 'peopleBL':
        return {
          placeholder: 'Ex. sjobs@apple.com',
          initialData: this._innovation.settings && this._innovation.settings.blacklist ? _.map(this._innovation.settings.blacklist.people, (val: string) => {return {text: val}; }) : []
        };
      default:
        return {
          placeholder: 'Input',
          initialData: ''
        };
    }
  }


  /**
   * This method receives the event from a click in some continent. It should update the geography.continentTarget
   * @param event
   */
  continentModificationDrain(event: any) {
    if (event) {
      this._innovation.settings.geography.continentTarget = event.continents;
      this.updateSettings();
    }
  }

  /**
   * Add a country to the exclusion list
   */
  addCountryToExclude(event: {value: Array<string>}): void {
    this._innovation.settings.geography.exclude = event.value;
    this.updateSettings();
  }

  get continentTarget(): any {
    return this._innovation.settings ? this._innovation.settings.geography.continentTarget : {};
  }


  get displayCountriesCommentSection(): boolean {
    return this._displayCountriesCommentSection;
  }


  set displayCountriesCommentSection(value: boolean) {
    this._displayCountriesCommentSection = value;
  }


  addCompanyToExclude(event: {value: Array<string>}): void {
    this._innovation.settings.companies.exclude = event.value;
    this.updateSettings();
  }


  addCompanyToInclude(event: {value: Array<string>}): void {
    this._innovation.settings.companies.include = event.value;
    this.updateSettings();
  }


  set displayCompanyCommentSection(value: boolean) {
    this._displayCompanyCommentSection = value;
  }


  get displayCompanyCommentSection(): boolean {
    return this._displayCompanyCommentSection;
  }


  addPeopleToExclude(event: {value: Array<string>}): void {
    this._innovation.settings.professionals.exclude = event.value;
    this.updateSettings();
  }


  get displayPersonsToExcludeSection(): boolean {
    return this._displayPersonsToExcludeSection;
  }


  set displayPersonsToExcludeSection(value: boolean) {
    this._displayPersonsToExcludeSection = value;
  }


  get comments(): string {
    return this._innovation.settings ? this._innovation.settings.comments : '';
  }


  set comments(value: string) {
    this._innovation.settings.comments = value;
    this.updateSettings();
  }


  get displayKeywordsSection(): boolean {
    return this._displayKeywordsSection;
  }


  set displayKeywordsSection(value: boolean) {
    this._displayKeywordsSection = value;
  }


  addKeywordToExclude(event: {value: Array<string>}): void {
    this._innovation.settings.keywords = event.value;
    this.updateSettings();
  }

  /*public onTargetingChanged(value: SharedTargetingWorldInterface) {
    this._innovation.settings.geography.continentTarget = SharedWorldmapService.reinitializeContinents();

    value.includeContinents.forEach((value) => {
      this._innovation.settings.geography.continentTarget[value] = true;
    });

    this._innovation.settings.geography.include = value.includeCountries;
    this._innovation.settings.geography.exclude = value.excludeCountries;

    this.updateSettings();
  }*/

  updateSettings() {
    if (this._canEdit) {
      this.innovationFrontService.setNotifyChanges(true);
    }
  }


  getColor(length: number) {
    return InnovationFrontService.getColor(length, 500);
  }


  get lang() {
    return this.translateService.currentLang;
  }

  get innovation(): Innovation {
    return this._innovation;
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

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
