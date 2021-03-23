import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../models/innovation';
import { Subject } from 'rxjs';
import {GeographySettings} from '../../../../models/innov-settings';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-shared-project-settings',
  templateUrl: 'shared-project-settings.component.html',
  styleUrls: ['shared-project-settings.component.scss']
})

export class SharedProjectSettingsComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this._innovation = value;
    this.getCommentSections();
    this._setTargetCountries();
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

  private _innovation: Innovation = <Innovation>{};

  private _canEdit = false;

  private _adminMode = false;

  private _adminSide = false;

  private _displayPersonsToExcludeSection = false;

  private _displayKeywordsSection = false;

  private _displayCompanyCommentSection = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _targetingCountries: Array<string> = [];

  contactInternal: Array<string> = ['false', 'true'];

  constructor(private translateService: TranslateService,
              private innovationFrontService: InnovationFrontService) { }

  ngOnInit(): void {
    this.innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      if (innovation && innovation._id) {
        this._innovation = innovation;
        if (this._innovation._id) {
          this.getCommentSections();
          this._canEdit = this._innovation.status === 'EDITING';
          this._setTargetCountries();
        }
      }
    });
  }

  private getCommentSections() {
    this._displayCompanyCommentSection = this._innovation.settings.companies.description.length > 0;
    this._displayPersonsToExcludeSection = this._innovation.settings.professionals &&
      this._innovation.settings.professionals.exclude && this._innovation.settings.professionals.exclude.length > 0;
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
      case 'excludedPeople':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.PROFESSIONALS.NEW_PROFESSIONAL_TO_EXCLUDE_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.professionals ?
            this._innovation.settings.professionals.exclude || [] : []
        };
      case 'excludedCompanies':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.COMPANIES.NEW_COMPANY_TO_EXCLUDE_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.companies ?
            this._innovation.settings.companies.exclude || [] : [],
          type: 'company',
          showDomain: !!this._adminMode
        };
      case 'includedCompanies':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.COMPANIES.NEW_COMPANY_TO_INCLUDE_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.companies ?
            this._innovation.settings.companies.include || [] : [],
          type: 'company',
          showDomain: !!this._adminMode
        };
      case 'keywords':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.KEYWORDS.PLACEHOLDER',
          initialData: this._innovation.settings ? this._innovation.settings.keywords || [] : []
        };
      case 'domainBL':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.BLACKLIST.DOMAINS_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.blacklist ?
            _.map(this._innovation.settings.blacklist.domains, (val: string) => ({text: val})) : []
        };
      case 'emailBL':
        return {
          placeholder: 'SHARED_PROJECT_SETTINGS.BLACKLIST.EMAILS_PLACEHOLDER',
          initialData: this._innovation.settings && this._innovation.settings.blacklist ?
            _.map(this._innovation.settings.blacklist.emails, (val: string) => ({text: val})) : []
        };
      case 'peopleBL':
        return {
          placeholder: 'Ex. sjobs@apple.com',
          initialData: this._innovation.settings && this._innovation.settings.blacklist ?
            _.map(this._innovation.settings.blacklist.people, (val: string) => ({text: val})) : []
        };
      default:
        return {
          placeholder: 'Input',
          initialData: ''
        };
    }
  }

  public formatCompanyList(company: any): string {
    return `${company.name} ${this._adminMode && company.domain ? '(' + company.domain + ')' : ''}`;
  }

  public onChangeContact() {
    this._innovation.settings.contact.internal = !this._innovation.settings.contact.internal;
    this.updateSettings();
  }

  private _setTargetCountries() {
    this._targetingCountries = this._innovation.settings.geography.include.map((country) => country.code);
  }

  get continentTarget(): any {
    return this._innovation.settings ? this._innovation.settings.geography.continentTarget : {};
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

  updateSettings() {
    if (this._canEdit) {
      this.innovationFrontService.setNotifyChanges({key: 'settings', state: true});
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

  get targetingCountries() {
    return this._targetingCountries;
  }

  get geography() {
    return this._innovation.settings.geography;
  }

  set geography(value: GeographySettings) {
    this._innovation.settings.geography = value;
    this._setTargetCountries();
    this.updateSettings();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
