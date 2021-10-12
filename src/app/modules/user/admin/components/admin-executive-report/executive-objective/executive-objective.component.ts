import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { ExecutiveObjective } from '../../../../../../models/executive-report';
import { UserService } from '../../../../../../services/user/user.service';
import { CommonService } from '../../../../../../services/common/common.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { AutocompleteService } from '../../../../../../services/autocomplete/autocomplete.service';
import { SnippetService } from '../../../../../../services/snippet/snippet.service';
import { ExecutiveReportFrontService } from '../../../../../../services/executive-report/executive-report-front.service';
import { EnterpriseService } from '../../../../../../services/enterprise/enterprise.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';

interface Commercial {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-admin-executive-objective',
  templateUrl: './executive-objective.component.html',
  styleUrls: ['./executive-objective.component.scss']
})

export class ExecutiveObjectiveComponent implements OnInit {

  get borderClass(): string {
    return this._config.objective && this._config.objective.length ? 'is-success' : 'is-error';
  }

  @Input() isEditable = false;

  @Input() lang = 'en';

  @Input() set config(value: ExecutiveObjective) {
    this._config = value;
    // Set the logo here
    this._logo = this._config.client.company && this._config.client.company.logo && this._config.client.company.logo.uri;
    this._company = this._config.client.company && this._config.client.company.name;
    this.textColor('objective');
    this.textColor('clientName');
    this.textColor('clientEmail');
  }

  @Output() configChange: EventEmitter<ExecutiveObjective> = new EventEmitter<ExecutiveObjective>();

  private _showUploadModal = false;

  private _config: ExecutiveObjective = <ExecutiveObjective>{
    objective: '',
    client: {
      name: '',
      email: '',
      company: {
        name: '',
        logo: {
          uri: '',
          alt: '',
          id: ''
        },
        topLevelDomain: '',
        id: ''
      }
    },
    sale: ''
  };

  private _company = '';

  private _logo = '';

  private _allCommercials: Array<Commercial> = [];

  private _commercial: Commercial = <Commercial>{};

  private _objectiveColor = '';

  private _clientNameColor = '';

  private _clientEmailColor = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _executiveReportFrontService: ExecutiveReportFrontService,
              private _userService: UserService,
              private _sanitizer: DomSanitizer,
              private _enterpriseService: EnterpriseService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _autoCompleteService: AutocompleteService) {
  }

  ngOnInit(): void {
    this._getCommercials();
  }

  /***
   * this is to get the commercial list from the back. From the moment we are getting the
   * super-admin.
   * @private
   */
  private _getCommercials() {
    if (isPlatformBrowser(this._platformId)) {
      const config = {
        roles: 'commercial',
        fields: '_id firstName lastName phone email'
      };
      this._userService.getAll(config)
        .pipe(first()).subscribe((response) => {

        this._allCommercials = response && response['result'] ? response['result'] : [];

        if (this._allCommercials.length > 0) {  // TODO really? a sort?
          this._allCommercials = this._allCommercials.sort((a, b) => {
            const nameA = (a.firstName + a.lastName).toLowerCase();
            const nameB = (b.firstName + b.lastName).toLowerCase();
            return nameA.localeCompare(nameB);
          });
        }

        this._populateCommercial();

      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  /***
   * populating the sale field.
   * @private
   */
  private _populateCommercial() {
    if (this._config.sale) {
      const index = this._allCommercials.findIndex((commercial) => commercial._id === this._config.sale);
      if (index !== -1) {
        this._commercial = this._allCommercials[index];
      }
    }
  }

  public textColor(field: string) {
    switch (field) {

      case 'objective':
        this._objectiveColor = CommonService.getLimitColor(this._config.objective, 120);
        break;

      case 'clientName':
        this._clientNameColor = CommonService.getLimitColor(this._config.client.name, 58);
        break;

      case 'clientEmail':
        this._clientEmailColor = CommonService.getLimitColor(this._config.client.email, 58);
        break;

    }
  }

  public emitChanges() {
    if (this.isEditable) {
      this.configChange.emit(this._config);
    }
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this._executiveReportFrontService.audio(this._config.objective, this.lang);
  }

  public onClickSnippet(event: Event) {
    event.preventDefault();
    this._config.objective = SnippetService.storyboard('OBJECTIVE', this.lang);
    this.textColor('objective');
    this.emitChanges();
  }

  /***
   * when the user selects the commercial from the Select box.
   * @param event
   */
  public selectCommercial(event: Event) {
    this._config.sale = event && event.target && (event.target as HTMLSelectElement).value || '';
    this._populateCommercial();
    this.emitChanges();
  }

  public companiesSuggestions = (searchString: string): Observable<Array<{ name: string, domain: string, logo: string }>> => {
    return this._autoCompleteService.get({query: searchString, type: 'company', internalOnly: 'true'});
  }

  public selectCompany(c: string | any) {
    if (typeof c === 'object') {
      // Maybe there's a logo...
      // Convert here to the good format
      if (!this._config.client.company) {
        this._config.client.company = {
          name: '',
          topLevelDomain: '',
          id: '',
          logo: {
            uri: '',
            alt: '',
            id: ''
          }
        };
      }
      this._config.client.company.name = c.name;
      this._config.client.company.topLevelDomain = c.domain;
      this._config.client.company.id = c.id;
      this._config.client.company.logo = {
        uri: c.logo,
        alt: c.name,
        id: ''
      };
      console.log(c);
      this._company = c.name;
      this._logo = c.logo;
      this.emitChanges();
    } // If typeof c === string, leave the thing alone.
  }

  public autocompleteCompanyListFormatter = (data: any): SafeHtml => {
    return this._sanitizer.bypassSecurityTrustHtml(`<img style="vertical-align:middle;" src="${data.logo}" height="35" alt=" "/><span>${data.name}</span>`);
  }

  public autocompleteEnterpriseListFormatter = (data: any): SafeHtml => {
    return this._sanitizer.bypassSecurityTrustHtml(`<img style="vertical-align:middle;" src="${data.logo.uri}" height="35" alt=" "/><span>${data.name}</span>`);
  }

  get logo(): string {
    return this._logo;
  }

  get company(): string {
    return this._company;
  }

  set company(value: string) {
    this._company = value;
  }

  get config(): ExecutiveObjective {
    return this._config;
  }

  get allCommercials(): Array<Commercial> {
    return this._allCommercials;
  }

  get commercial(): Commercial {
    return this._commercial;
  }

  get objectiveColor(): string {
    return this._objectiveColor;
  }

  get clientNameColor(): string {
    return this._clientNameColor;
  }

  get clientEmailColor(): string {
    return this._clientEmailColor;
  }

  get showUploadModal(): boolean {
    return this._showUploadModal;
  }

  set showUploadModal(value: boolean) {
    this._showUploadModal = value;
  }

  public uploadImage(event: any) {
    if (event && event.url) {
      this._config.client.company.logo.uri = event.url;
      this._logo = event.url;
      this.updateEnterprise();
    }
    this._showUploadModal = false;
  }

  updateEnterprise() {
    if (this._config.client.company && this._config.client.company.id && this._config.client.company.logo) {
      this._enterpriseService.updateLogo(this._config.client.company.id, this._config.client.company.logo).pipe(first())
        .subscribe(res => {
          this._translateNotificationsService.success('Success', 'Upload company logo succeed.');
        }, err => {
          console.error(err);
          this._translateNotificationsService.error('ERROR.ERROR', 'Upload company logo failed.');
        });
    }
  }

  openUploadModal() {
    this._showUploadModal = true;
  }
}
