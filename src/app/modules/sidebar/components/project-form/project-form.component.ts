import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {EmailQueueModel} from '../../../../models/mail.queue.model';
import {Table} from '../../../shared/components/shared-table/models/table';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})

export class ProjectFormComponent implements OnInit, OnChanges {

  @Input() set editBlacklistEmail(value: any) {
    this.emailToEdit = value;
    this.loadBlacklist();
  };

  @Input() set campaignInfos(value: EmailQueueModel) {
    this.campaignInfosToShow = value;
    this.loadCampaignInfos();
  }

  @Input() sidebarState: string;

  @Input() set type(type: string) {
    this.reinitialiseForm();
    if (type === 'excludeEmails') {
      this.isExcludeEmails = true;
    } else if (type === 'editBlacklist') {
      this.isBlacklist = true;
    } else if (type === 'showCampaignInfos') {
      this.isShowCampaignInfos = true;
    } else if (type === 'excludeDomains') {
      this.isExcludeDomains = true;
    } else if (type === 'excludeCountries') {
      this.isExcludeCountries = true;
    }
  }

  @Output() editBlacklist = new EventEmitter<any>();
  @Output() emailsToBlacklists = new EventEmitter<Array<string>>();
  @Output() domainsToBlacklists = new EventEmitter<Array<string>>();

  isBlacklist = false;
  isExcludeEmails = false;
  isExcludeDomains = false;
  isExcludeCountries = false;
  isShowCampaignInfos = false;

  private _tableInfos: Table = null;

  formData: FormGroup;

  emailToEdit: any = null;
  campaignInfosToShow: EmailQueueModel = null;

  constructor (private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formData = this.formBuilder.group( {
      email: ['', [Validators.required, Validators.email]],
      domain: ['', Validators.required],
      expiration: ''
    });
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
    this.isExcludeDomains = false;
    this.isExcludeCountries = false;
  }

  onSubmit() {
    if (this.isBlacklist) {
      const blacklist = this.formData.value;
      blacklist.expiration === '' ? blacklist.expiration = 0 : blacklist.expiration = blacklist.expiration;
      blacklist._id = this.emailToEdit._id;
      this.editBlacklist.emit(blacklist);
    } else if (this.isExcludeEmails) {
      this.emailsToBlacklists.emit(this.formData.value.email);
    } else if (this.isExcludeDomains) {
      this.domainsToBlacklists.emit(this.formData.value.domain);
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isExcludeEmails) {
      if (changes.sidebarState.currentValue !== changes.sidebarState.previousValue) {
        this.formData.reset();
      }
    }

  }

  get tableInfos(): Table { return this._tableInfos; }


}
