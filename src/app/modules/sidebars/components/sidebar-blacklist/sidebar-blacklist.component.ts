import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmailQueueModel} from '../../../../models/mail.queue.model';
import {Table} from '../../../table/models/table';
import {Config} from '../../../../models/config';

type Template = 'EXCLUDE_EMAILS_DOMAINS' | 'EDIT_EMAILS' | 'EXCLUDE_COUNTRY' | 'EDIT_COUNTRY' | 'SHOW_CAMPAIGN_INFOS' | '';

@Component({
  selector: 'app-sidebar-blacklist',
  templateUrl: './sidebar-blacklist.component.html',
  styleUrls: ['./sidebar-blacklist.component.scss']
})

export class SidebarBlacklistComponent implements OnInit {

  @Input() isEditable = false; // make true to save the changes.

  @Input() set initialDomains(value: string[]) {
    const domains: any[] = [];
    value.forEach(value1 => domains.push({text: '*@' + value1}));
    this._initialDomains = domains;
  };

  @Input() set initialEmails(value: string[]) {
    const emails: any[] = [];
    value.forEach(value1 => emails.push({text: value1}));
    this._initialEmails = emails;
  };

  @Input() set editBlacklistEmail(value: any) {
    this._emailToEdit = value;
    this._loadBlacklist();
  };

  @Input() set campaignInfos(value: EmailQueueModel) {
    this._campaignInfosToShow = value;
    this._loadCampaignInfos();
  }

  @Input() set countryInfos(value: any) {
    this._countryInfo = value;
    this._loadCountry();
  }

  @Input() set type(type: Template) {
    this._type = type;
    this._toBeSaved = false;
    this._buildForm();
    this._initData();
  }

  @Output() editBlacklist = new EventEmitter<any>(); // updated blacklist email information

  @Output() toBlacklists = new EventEmitter<{emails: Array<string>, domains: Array<string>}>();

  @Output() countryToFilter = new EventEmitter<any>(); // country to exclude.

  @Output() editCountry = new EventEmitter<any>(); // edit the country.

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _type: Template = 'EDIT_EMAILS';

  private _tableInfos: Table = <Table>{};

  private _formData: FormGroup;

  private _emailToEdit: any = null;

  private _campaignInfosToShow: EmailQueueModel = null;

  private _countryInfo: any = null;

  private _initialDomains: any[] = [];

  private _initialEmails: any[] = [];

  private _country: {flag: string, domain: string, name: string} = null;

  private _toBeSaved = false;

  constructor (private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this._buildForm();
    this._initData();
  }

  private _buildForm() {
    this._formData = this._formBuilder.group( {
      email: [[], [Validators.required, Validators.email]],
      domain: [[], Validators.required],
      expiration: '',
      acceptation: [80, [Validators.required, Validators.max(100), Validators.min(0)]]
    });
  }

  private _initData() {
    switch (this._type) {
      case 'EDIT_EMAILS':
        this._loadBlacklist();
        break;

      case 'EXCLUDE_EMAILS_DOMAINS':
        this._formData.get('email').patchValue([...this._initialEmails]);
        this._formData.get('domain').patchValue([...this._initialDomains]);
        break;

      case 'EXCLUDE_COUNTRY':
        this._initialiseCountryExclusion();
        break;

      case 'EDIT_COUNTRY':
        this._loadCountry();
        break;

      case 'SHOW_CAMPAIGN_INFOS':
        this._loadCampaignInfos();
        break;

    }
  }

  private _loadBlacklist() {
    if (!!this._emailToEdit && this._formData) {
      this._emailToEdit.expiration === '' ? this._emailToEdit.expiration = ''
        : this._emailToEdit.expiration = new Date(this._emailToEdit.expiration);
      this._formData.patchValue(this._emailToEdit);
    }
  }

  public saveChanges() {
    this._toBeSaved = true;
  }

  private _loadCountry() {
    if (!!this._countryInfo && this._formData) {
      this._countryInfo.expiration === ''
        ? this._countryInfo.expiration = ''
        : this._countryInfo.expiration = new Date(this._countryInfo.expiration);
      this._formData.patchValue(this._countryInfo);
    }
  }

  private _initialiseCountryExclusion() {
    this._formData.get('acceptation').setValue(80);
  }

  private _loadCampaignInfos() {
    if (!!this._campaignInfosToShow) {
      this._tableInfos = {
        _selector: 'admin-mailgun',
        _title: 'Professionals',
        _isSearchable: true,
        _content: this._campaignInfosToShow.payload.recipients,
        _total: this._campaignInfosToShow.payload.recipients.length,
        _isLocal: true,
        _isPaginable: this._campaignInfosToShow.payload.recipients.length > 10,
        _columns: [
          { _attrs: ['firstName', 'lastName'], _name: 'Name', _type: 'TEXT' },
          { _attrs: ['company'], _name: 'Company', _type: 'TEXT' },
        ]
      };
    }
  }

  public onSubmit() {
    if (this.isEditable) {
      switch (this._type) {

        case 'EDIT_EMAILS':
          const blacklist = this._formData.value;
          blacklist.expiration = blacklist.expiration === '' ? 0 : blacklist.expiration;
          blacklist._id = this._emailToEdit && this._emailToEdit._id;
          this.editBlacklist.emit(blacklist);
          break;

        case 'EXCLUDE_EMAILS_DOMAINS':
          this.toBlacklists.emit({
            emails: this._formData.value && this._formData.value.email || [],
            domains: this._formData.value && this._formData.value.domain || []
          });
          break;

        case 'EXCLUDE_COUNTRY':
          this.countryToFilter.emit({
            acceptation: this._formData.value.acceptation,
            name: this._country.name,
            flag: this._country.flag
          });
          break;

        case 'EDIT_COUNTRY':
          const newCountry = this._formData.value;
          newCountry.expiration = newCountry.expiration === '' ? 0 : newCountry.expiration;
          newCountry._id = this._countryInfo._id;
          this.editCountry.emit(newCountry);
          break;

      }
    }
  }

  public getConfig(type: string): any {
    switch (type) {
      case 'countries':
        return {
          placeholder: 'Enter the country',
          initialData: this._country || null,
          type: 'countries',
        };
      case 'excludedCompanies':
        return {
          placeholder: 'Companies/Domains to be excluded',
          initialData:  [],
          type: 'company',
          showDomain: true
        };
      default:
        return {
          placeholder: 'Input',
          initialData: ''
        };
    }
  }

  public resetExpirationDate(event: Event) {
    if (event.target && (event.target as HTMLInputElement).checked) {
      this._formData.value.expiration = '';
    } else {
      this._formData.value.expiration = new Date();
    }
    this.saveChanges();
  }

  public addEmail(event: {value: Array<any>}) {
    this._formData.get('email')!.setValue(event.value);
    this.saveChanges();
  }

  public addDomain(event: {value: Array<any>}) {
    this._formData.get('domain')!.setValue(event.value);
    this.saveChanges();
  }

  public updateCountry(event: {value: Array<any>}) {
    this._country = event.value[0] || null;
    this.saveChanges();
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get initialDomains(): string[] {
    return this._initialDomains;
  }

  get initialEmails(): string[] {
    return this._initialEmails;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get config(): Config {
    return this._config;
  }

  get emailToEdit(): any {
    return this._emailToEdit;
  }

  get type(): Template {
    return this._type;
  }

  get country(): { flag: string; domain: string; name: string } {
    return this._country;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

}
