import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {EmailQueueModel} from '../../../../models/mail.queue.model';
import {Table} from '../../../table/models/table';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-emails-form',
  templateUrl: './emails-form.component.html',
  styleUrls: ['./emails-form.component.scss']
})

export class EmailsFormComponent implements OnInit, OnChanges {

  @Input() set editBlacklistEmail(value: any) {
    this.emailToEdit = value;
  };

  @Input() set campaignInfos(value: EmailQueueModel) {
    this.campaignInfosToShow = value;
  }

  @Input() set countryInfos(value: any) {
    this.countryInfo = value;
  }

  @Input() sidebarState: Subject<string>;

  @Input() set type(type: string) {
    this._type = type;
    this.loadTypes();
  }

  @Output() editBlacklist = new EventEmitter<any>();
  @Output() emailsToBlacklists = new EventEmitter<Array<string>>();
  @Output() countryToFilter = new EventEmitter<any>();
  @Output() editCountry = new EventEmitter<any>();

  private _type = '';

  isBlacklist = false;
  isExcludeEmails = false;
  isShowCampaignInfos = false;
  isFilterCountry = false;
  isEditCountry = false;

  private _tableInfos: Table = null;

  formData: FormGroup;

  emailToEdit: any = null;
  campaignInfosToShow: EmailQueueModel = null;
  countryInfo: any = null;

  public country: {flag: string, domain: string, name: string} = null;

  constructor (private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formData = this.formBuilder.group( {
      email: ['', [Validators.required, Validators.email]],
      domain: ['', Validators.required],
      expiration: '',
      acceptation: [80, [Validators.required, Validators.max(100), Validators.min(0)]]
    });

    if (this.sidebarState) {
      this.sidebarState.subscribe((state) => {
        if (state === 'inactive') {
          setTimeout (() => {
            this.country = null;
            this.loadTypes();
          }, 700);
        }
      })
    }
  }

  loadTypes() {
    this.reinitialiseForm();
    if (this._type === 'excludeEmails') {
      this.isExcludeEmails = true;
    } else if (this._type === 'editBlacklist') {
      this.isBlacklist = true;
      this.loadBlacklist();
    } else if (this._type === 'showCampaignInfos') {
      this.isShowCampaignInfos = true;
      this.loadCampaignInfos();
    }else if (this._type === 'excludeCountry') {
      this.isFilterCountry = true;
      this.initialiseCountryExclusion();
    } else if (this._type === 'editCountry') {
      this.isEditCountry = true;
      this.loadCountry();
    }
  }

  loadBlacklist() {
    if (this.emailToEdit && this.formData) {
      this.emailToEdit.expiration === ''
        ? this.emailToEdit.expiration = ''
        : this.emailToEdit.expiration = new Date(this.emailToEdit.expiration);
      this.formData.patchValue(this.emailToEdit);
    }
  }

  loadCountry() {
    if (this.countryInfo && this.formData) {
      this.countryInfo.expiration === ''
        ? this.countryInfo.expiration = ''
        : this.countryInfo.expiration = new Date(this.countryInfo.expiration);
      this.formData.patchValue(this.countryInfo);
    }
  }

  initialiseCountryExclusion() {
    this.formData.get('acceptation').setValue(80);
  }

  loadCampaignInfos() {
    if (this.campaignInfosToShow) {
      this._tableInfos = {
        _selector: 'admin-mailgun',
        _title: 'COMMON.PROFESSIONALS',
        _isHeadable: true,
        _content: this.campaignInfosToShow.payload.recipients,
        _total: this.campaignInfosToShow.payload.recipients.length,
        _isNotPaginable: true,
        _columns: [
          {_attrs: ['firstName', 'lastName'], _name: 'COMMON.NAME', _type: 'TEXT', _isSortable: false},
          {_attrs: ['company'], _name: 'COMMON.COMPANY', _type: 'TEXT', _isSortable: false},
        ]
      };
    }
  }

  reinitialiseForm() {
    this.isBlacklist = false;
    this.isExcludeEmails = false;
    this.isShowCampaignInfos = false;
    this.isFilterCountry = false;
    this.isEditCountry = false;
  }

  onSubmit() {
    if (this.isBlacklist) {
      const blacklist = this.formData.value;
      blacklist.expiration === '' ? blacklist.expiration = 0 : blacklist.expiration = blacklist.expiration;
      blacklist._id = this.emailToEdit._id;
      this.editBlacklist.emit(blacklist);
    } else if (this.isExcludeEmails) {
      this.emailsToBlacklists.emit(this.formData.value.email);
      this.emailsToBlacklists.emit(this.formData.value.domain);
    } else if (this.isFilterCountry) {
      this.countryToFilter.emit({acceptation: this.formData.value.acceptation, name: this.country.name, flag: this.country.flag});
    } else if (this.isEditCountry) {
      const newCountry = this.formData.value;
      newCountry.expiration === '' ? newCountry.expiration = 0 : newCountry.expiration = newCountry.expiration;
      newCountry._id = this.countryInfo._id;
      this.editCountry.emit(newCountry);
    }
  }

  public getConfig(type: string): any {
    const _inputConfig = {
        'countries': {
          placeholder: 'COMMON.COUNTRY_PLACEHOLDER',
          initialData: this.country || null,
          type: 'countries',
        }
    };
    return _inputConfig[type] || {
        placeholder: 'Input',
        initialData: ''
    };
  }

  resetExpirationDate(check: boolean) {
    if (check === true) {
      this.formData.value.expiration = '';
    } else {
      this.formData.value.expiration = new Date();
    }
  }

  addEmail(event: {value: Array<any>}) {
    this.formData.get('email')!.setValue(event.value)
  }

  addDomain(event: {value: Array<any>}) {
    this.formData.get('domain')!.setValue(event.value)
  }

  updateCountry(event: {value: Array<any>}) {
    this.country = event.value[0] || null;
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  get tableInfos(): Table { return this._tableInfos; }

}
