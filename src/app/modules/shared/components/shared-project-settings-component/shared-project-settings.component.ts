import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { ShareService } from '../../../../services/share/share.service';

@Component({
  selector: 'app-shared-project-settings',
  templateUrl: 'shared-project-settings.component.html',
  styleUrls: ['shared-project-settings.component.scss']
})
export class SharedProjectSettingsComponent implements OnInit {

  @Input() settings: any;
  @Input() adminMode: boolean;
  @Output() settingsChange = new EventEmitter<any>();

  private _displayCountriesToExcludeSection: boolean = false;
  private _displayCompanyToExcludeSection: boolean = false;
  private _displayPersonsToExcludeSection: boolean = false;
  private _displayKeywordsSection: boolean = false;

  constructor(private _translateService: TranslateService,
              private _authService: AuthService,
              public shareService: ShareService) { }


  ngOnInit() {
    this.adminMode = this.adminMode && this._authService.adminLevel >= 1;
  }

  get lang() {
    return this._translateService.currentLang;
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
        placeholder: 'PROJECT_EDIT.TARGETING.NEW_COUNTRY_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.settings ? this.settings.geography.exclude : [],
        type: 'countries'
      },
      'excludedPeople': {
        placeholder: 'PROJECT_EDIT.PROFESSIONALS.NEW_PROFESSIONAL_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.settings ? this.settings.professionals.exclude : []
      },
      'excludedCompanies': {
        placeholder: 'PROJECT_EDIT.COMPANIES.NEW_COMPANY_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.settings ? this.settings.companies.exclude : [],
        type: 'company'
      },
      'keywords': {
        placeholder: 'PROJECT_EDIT.KEYWORDS.PLACEHOLDER',
        initialData: this.settings ? this.settings.keywords : []
      },
      'domainBL': {
        placeholder: 'Ex. apple.com',
        initialData: this.settings && this.settings.blacklist ? this.settings.blacklist.domains : []
      },
      'emailBL': {
        placeholder: 'Ex. sjobs@apple.com',
        initialData: this.settings && this.settings.blacklist ? this.settings.blacklist.emails : []
      },
      'peopleBL': {
        placeholder: 'Ex. sjobs@apple.com',
        initialData: this.settings && this.settings.blacklist ? this.settings.blacklist.emails : []
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
  public continentModificationDrain(event) {
    if(event) {
      this.settings.geography.continentTarget = event.continents;
      this.updateSettings();
    }
  }

  /**
   * Add a country to the exclusion list
   */
  public addCountryToExclude(event): void {
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

  /****************************************************************************
   ********************************* Sectors **********************************
   ****************************************************************************/

  /****************************************************************************
   ******************************* Enterprises ********************************
   ****************************************************************************/

  public addCompanyToExclude(event): void {
    this.settings.companies.exclude = event.value;
    this.updateSettings();
  }

  get displayCompanyToExcludeSection(): boolean {
    return this._displayCompanyToExcludeSection;
  }

  set displayCompanyToExcludeSection(value: boolean) {
    this._displayCompanyToExcludeSection = value;
  }

  /****************************************************************************
   ****************************** Professionals *******************************
   ****************************************************************************/

  public addPeopleToExclude(event): void {
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
    return this.settings ? this.settings.comments : "";
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

  public addKeywordToExclude(event): void {
    this.settings.keywords = event.value;
    this.updateSettings();
  }

  /****************************************************************************
   ********************************* Blacklist ********************************
   ****************************************************************************/

  public addDomainToExclude(event): void {
    this.settings.blacklist.domains = event.value;
    this.updateSettings();
  }

  public addEMailToExclude(event): void {
    this.settings.blacklist.emails = event.value;
    this.updateSettings();
  }

  /**
   * After all the settings modifications are done, send them back to the project to be saved.
   */
  public updateSettings() {
    this.settingsChange.emit(this.settings);
  }
}
