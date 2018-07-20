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
    this.loadBlacklist();
  };

  @Input() set campaignInfos(value: EmailQueueModel) {
    this.campaignInfosToShow = value;
    this.loadCampaignInfos();
  }

  @Input() sidebarState: Subject<string>;

  @Input() set type(type: string) {
    this.reinitialiseForm();
    if (type === 'excludeEmails') {
      this.isExcludeEmails = true;
    } else if (type === 'editBlacklist') {
      this.isBlacklist = true;
    } else if (type === 'showCampaignInfos') {
      this.isShowCampaignInfos = true;
    }else if (type === 'excludeCountry') {
      this.isFilterCountry = true;
    }
  }

  @Output() editBlacklist = new EventEmitter<any>();
  @Output() emailsToBlacklists = new EventEmitter<Array<string>>();
  @Output() countryToFilter = new EventEmitter<any>();

  isBlacklist = false;
  isExcludeEmails = false;
  isShowCampaignInfos = false;
  isFilterCountry = false;

  private _tableInfos: Table = null;

  formData: FormGroup;

  emailToEdit: any = null;
  campaignInfosToShow: EmailQueueModel = null;

  private _country: {flag: string, domain: string, name: string} = null;

  constructor (private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formData = this.formBuilder.group( {
      email: ['', [Validators.required, Validators.email]],
      domain: ['', Validators.required],
      expiration: '',
      accept: [80, [Validators.required, Validators.max(100), Validators.min(0)]]
    });

    if (this.sidebarState) {
      this.sidebarState.subscribe((state) => {
        if (state === 'inactive') {
          setTimeout (() => {
            this.formData.reset();
          }, 700);
        }
      })
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
      this.countryToFilter.emit({accept: this.formData.value.accept, name: this._country.name});
    }
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
    this._country = event.value[0] || null;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  get tableInfos(): Table { return this._tableInfos; }
  get country(): { flag: string; domain: string; name: string } { return this._country; }

}
