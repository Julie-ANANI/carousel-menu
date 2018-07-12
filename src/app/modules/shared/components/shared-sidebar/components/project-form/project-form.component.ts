import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Table} from '../../../shared-table/models/table';
import {EmailQueueModel} from '../../../../../../models/mail.queue.model';

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
    if (type === 'addEmail') {
      this.isBlacklist = false;
      this.isAddEmail = true;
      this.isShowCampaignInfos = false;
    } else if (type === 'editBlacklist') {
      this.isBlacklist = true;
      this.isAddEmail = false;
      this.isShowCampaignInfos = false;
    } else if (type === 'showCampaignInfos') {
      this.isShowCampaignInfos = true;
      this.isBlacklist = false;
      this.isAddEmail = false;
    }
  }

  @Output() editBlacklist = new EventEmitter<any>();
  @Output() addBlacklists = new EventEmitter<Array<string>>();

  isBlacklist = false;
  isAddEmail = false;
  isShowCampaignInfos = false;

  private _tableInfos: Table = null;

  formData: FormGroup;

  emailToEdit: any = null;
  campaignInfosToShow: EmailQueueModel = null;

  constructor (private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formData = this.formBuilder.group( {
      email: ['', [Validators.required, Validators.email]],
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
    this._tableInfos = {
      _selector: 'admin-mailgun',
      _title: 'Batchs',
      _content: this.campaignInfosToShow.payload.metadata.recipients,
      _total: 0,
      _columns: [
        {_attrs: ['firstName', 'lastName'], _name: 'COMMON.NAME', _type: 'TEXT', _isSortable: false},
        {_attrs: ['company'], _name: 'COMMON.COMPANY', _type: 'TEXT', _isSortable: false},
      ]
    };
  }

  onSubmit() {
    if (this.isBlacklist) {
      const blacklist = this.formData.value;
      blacklist.expiration === '' ? blacklist.expiration = 0 : blacklist.expiration = blacklist.expiration
      blacklist._id = this.emailToEdit._id;
      this.editBlacklist.emit(blacklist);
    } else if (this.isAddEmail) {
      this.addBlacklists.emit(this.formData.value.email);
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isAddEmail) {
      if (changes.sidebarState.currentValue !== changes.sidebarState.previousValue) {
        this.formData.reset();
      }
    }

  }

  get tableInfos(): Table { return this._tableInfos; }


}
