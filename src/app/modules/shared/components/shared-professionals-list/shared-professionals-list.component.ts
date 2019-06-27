import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Professional } from '../../../../models/professional';
import { Table } from '../../../table/models/table';
import { Config } from '../../../../models/config';
import { ProfessionalsService} from '../../../../services/professionals/professionals.service';
import { first} from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';
import { Campaign } from '../../../../models/campaign';
import { Router } from '@angular/router';
import { Tag } from '../../../../models/tag';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-shared-professionals-list',
  templateUrl: './shared-professionals-list.component.html',
  styleUrls: ['./shared-professionals-list.component.scss']
})

export class SharedProfessionalsListComponent {

  @Input() set config(value: Config) {
    this._config = value;
  }

  @Input() set tableSelector(value: string) {
    this._tableSelector = value;
  }

  @Input() set total(value: number) {
    this._total = value;
  }

  @Input() set campaign(value: Campaign) {
    this._campaign = value;
  }

  @Input() set professionals(value: Array<SelectedProfessional>) {
    this._professionals = value;
    this._setProfessionals();
    this._initializeTable();
  }

  @Output() configChange: EventEmitter<Config> = new EventEmitter<Config>();

  @Output() selectedProfessionalChange: EventEmitter<any> = new EventEmitter<any>();

  private _professionals: Array<SelectedProfessional> = [];

  private _table: Table;

  private _tableSelector: string;

  private _total: number;

  private _config: Config;

  private _sidebarValue: SidebarInterface = {};

  private _isProfessionalSidebar = false;

  private _isTagsSidebar = false;

  private _selectedProfessional: Professional;

  private _campaign: Campaign = null;

  private _modalDelete: boolean;

  private _professionalsToRemove: Array<SelectedProfessional> = [];

  private _professionalsToTags: Array<SelectedProfessional> = [];

  constructor(private _professionalsService: ProfessionalsService,
              private _router: Router,
              private _translateNotificationsService: TranslateNotificationsService) { }

  private _setProfessionals() {
    if (this._professionals.length > 0) {
      this._professionals.forEach(professional => {
        professional.sent = professional.messages && professional.messages.length > 0;
      });
    }
  }

  private _initializeTable() {
    this._table = {
      _selector: this._tableSelector,
      _title: 'TABLE.TITLE.PROFESSIONALS',
      _content: this._professionals,
      _total: this._total,
      _isSearchable: true,
      _isTitle: true,
      _isPaginable: true,
      _isDeletable: true,
      _isSelectable: true,
      _isEditable: true,
      _buttons: [{_label: 'Convert to ambassador', _icon: 'fas fa-user-graduate'}, {_label: 'COMMON.TAG_LABEL.ADD_TAGS', _icon: 'fas fa-plus'}],
      _editIndex: 1,
      _columns: [
        {_attrs: ['ambassador.is'], _name: 'Member', _type: 'MULTI-IMAGE-CHOICES', _isSortable: true, _minWidth: '125px', _isSearchable: true,
          _choices: [
            {_name: 'false', _alias: 'No', _url: ''},
            {_name: 'true', _alias: 'Yes', _url: 'https://res.cloudinary.com/umi/image/upload/v1552659548/app/default-images/badges/ambassador.svg'}
          ]
        },
        {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY', _isSortable: true, _isSearchable: true, _minWidth: '125px'},
        {_attrs: ['jobTitle'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT', _isSortable: true, _isSearchable: true},
        {_attrs: ['company'], _name: 'TABLE.HEADING.COMPANY', _type: 'TEXT', _isSortable: true, _isSearchable: true},
        {_attrs: ['campaigns'], _name: 'TABLE.HEADING.CAMPAIGNS', _type: 'ARRAY', _isSortable: true, _isSearchable: true, _minWidth: '125px'},
        {_attrs: ['messages'], _name: 'TABLE.HEADING.CONTACT', _type: 'ARRAY', _isSortable: true, _isSearchable: true, _minWidth: '125px'},
      ]
    };
  }

  public onConfigChange(value: Config) {
    this.configChange.emit(value);
  }

  private _resetSidebarVariables() {
    this._isProfessionalSidebar = false;
    this._isTagsSidebar = false;
  }

  public onClickEdit(value: Professional) {

    this._resetSidebarVariables();

    this._professionalsService.get(value._id).pipe(first()).subscribe((response: Professional) => {
      this._selectedProfessional = response;
      this._isProfessionalSidebar = true;

      this._sidebarValue = {
        animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
        title: 'SIDEBAR.TITLE.EDIT_PROFESSIONAL',
        type: 'professional'
      };

    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public onClickDelete(value: Array<SelectedProfessional>) {
    this._professionalsToRemove = value;
    this._modalDelete = true;
  }

  public onClickConfirm() {

    for (const professional of this._professionalsToRemove) {
      if(this._isCampaignProfessional()) {
        this._removeProfessionalFromCampaign(professional._id)
      } else {
        this._removeProfessional(professional._id);
      }
    }

    this._modalDelete = false;
    this._professionalsToRemove = [];

  }

  private _removeProfessionalFromCampaign(value: string) {
    const campaignId = this._campaign._id;
    const innovationId = this._campaign.innovation._id;

    this._professionalsService.removeFromCampaign(value, campaignId, innovationId).pipe(first()).subscribe(result => {
      this.onConfigChange(this._config);
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_DELETE_TEXT');
      }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  private _removeProfessional(value: string) {
    this._professionalsService.remove(value).subscribe(() => {
      this.onConfigChange(this._config);
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_DELETE_TEXT');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public onClickActions(value: any) {
    switch (value._action) {

      case 'Convert to ambassador':
        if(value._rows.length) {
          if(value._rows.length > 1) {
            console.log("Look man, I could do this action just for the first one...");
          }
          const link = `/user/admin/community/members/${value._rows[0]._id}`;
          this._router.navigate([link]);
        } else {
          console.error("What? empty rows? How did you do that?");
        }
        break;

      case 'COMMON.TAG_LABEL.ADD_TAGS':
        this._editProfessionalTags(value._rows);
        break;

    }
  }

  private _editProfessionalTags(value: Array<SelectedProfessional>) {
    this._resetSidebarVariables();
    this._professionalsToTags = value;
    this._isTagsSidebar = true;

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.ADD_TAGS',
      type: 'addTags'
    };

  }

  public addProfessionalTags(tags: Array<Tag>) {
    this._professionalsToTags.forEach((value, index) => {

      if (!this._professionalsToTags[index].tags) {
        this._professionalsToTags[index].tags = [];
      }

      tags.forEach( (value1) => {
        if (!(value.tags.find(value2 => {return value2._id === value1._id}))) {
          this._professionalsToTags[index].tags.push(value1);
        }
      });
    });

    this._professionalsToTags.forEach(value => this.updateProfessional(value));

  }

  public onSelectRows(value: any) {
    this.selectedProfessionalChange.emit({ total: value._rows.length, pros: value._rows });
  }

  public updateProfessional(value: Professional) {
    this._professionalsService.save(value._id, value).subscribe(() => {
      this.onConfigChange(this._config);
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_UPDATE_TEXT');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  private _isCampaignProfessional(): boolean {
    return !!this._campaign;
  }

  get professionals(): Array<SelectedProfessional> {
    return this._professionals;
  }

  get table(): Table {
    return this._table;
  }

  get tableSelector(): string {
    return this._tableSelector;
  }

  get total(): number {
    return this._total;
  }

  get config(): Config {
    return this._config;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  get isProfessionalSidebar(): boolean {
    return this._isProfessionalSidebar;
  }

  get isTagsSidebar(): boolean {
    return this._isTagsSidebar;
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
  }

  get selectedProfessional(): Professional {
    return this._selectedProfessional;
  }

  get professionalsToRemove(): Array<SelectedProfessional> {
    return this._professionalsToRemove;
  }

  get professionalsToTags(): Array<SelectedProfessional> {
    return this._professionalsToTags;
  }

}
