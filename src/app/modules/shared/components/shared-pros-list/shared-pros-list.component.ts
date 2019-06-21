import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { SearchService } from '../../../../services/search/search.service';
import { Campaign } from '../../../../models/campaign';
import { Professional } from '../../../../models/professional';
import { Table } from '../../../table/models/table';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';
import { Tag } from '../../../../models/tag';
import { Router } from "@angular/router";

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-shared-pros-list',
  templateUrl: './shared-pros-list.component.html',
  styleUrls: ['./shared-pros-list.component.scss']
})

export class SharedProsListComponent {

  @Input() requestId: string;

  @Input() campaign: Campaign;

  @Input() set config(value: any) {
    this.loadPros(value);
  }

  @Output() selectedProsChange = new EventEmitter <any>();

  private _config: any;

  editUser: {[propString: string]: boolean} = {};

  private _tableInfos: Table = null;

  private _total = -1;

  private _pros: Array <SelectedProfessional>;

  private _prosToRemove: Professional[] = [];

  private _prosToTag: Professional[] = [];

  private _sidebarValue: SidebarInterface = {};

  private _currentPro: Professional = null;

  private _isProfessionalForm = false;

  private _isTagsForm = false;

  private _modalDelete = false;

  constructor(private professionalsService: ProfessionalsService,
              private translateNotificationsService: TranslateNotificationsService,
              private searchService: SearchService,
              private router: Router) { }

  loadPros(config: any): void {
    this._config = config;

    if (this.requestId) {
      this.searchService.getPros(this._config, this.requestId).subscribe((pros: any) => {
        this._pros = pros.persons;
        this._total = pros._metadata.totalCount;

        this._tableInfos = {
          _selector: 'admin-pros',
          _title: 'TABLE.TITLE.PROFESSIONALS',
          _content: this._pros,
          _total: this._total,
          _isSearchable: true,
          _isTitle: true,
          _isPaginable: true,
          _isDeletable: true,
          _isSelectable: true,
          _isEditable: true,
          _buttons: [{_label: 'Convert to ambassador', _icon: 'fas fa-user-graduate'}, {_label: 'COMMON.TAG_LABEL.ADD_TAGS', _icon: 'fas fa-plus'}],
          _editIndex: 2,
          _columns: [
            {_attrs: ['ambassador.is'], _name: 'Member', _type: 'MULTI-CHOICES', _isSortable: true, _minWidth: '125px', _isSearchable: true,
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
          ]
        };

      });
    } else {
      this.professionalsService.getAll(this.configToString()).pipe(first()).subscribe((pros: any) => {
        this._pros = pros.result;

        this._pros.forEach(pro => {
          pro.sent = pro.messages && pro.messages.length > 0;
        });

        this._total = pros._metadata.totalCount;

        this._tableInfos = {
          _selector: 'admin-pros',
          _title: 'TABLE.TITLE.PROFESSIONALS',
          _content: this._pros,
          _total: this._total,
          _isSearchable: true,
          _isTitle: true,
          _isPaginable: true,
          _isDeletable: true,
          _isSelectable: true,
          _isEditable: true,
          _buttons: [{_label: 'Convert to ambassador', _icon: 'fas fa-user-graduate'}, {_label: 'COMMON.TAG_LABEL.ADD_TAGS', _icon: 'fas fa-plus'}],
          _editIndex: 2,
          _columns: [
            {_attrs: ['ambassador.is'], _name: 'Member', _type: 'MULTI-CHOICES', _isSortable: true, _minWidth: '125px', _isSearchable: true,
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
      });
    }

  }

  private configToString() {
    const config: any = {};
    Object.keys(this._config).forEach(key => {
      if (this._config[key] instanceof Object) {
        config[key] = JSON.stringify(this._config[key]);
      } else {
        config[key] = this._config[key];
      }
    });

    return config;
  }


  selectPro(event: any): void {
    this.selectedProsChange.emit({
      total: event._rows.length,
      pros: event._rows
    });
  }


  performActions(action: any) {

    switch (action._action) {

      case 'Convert to ambassador':
        if(action._rows.length) {
          if(action._rows.length > 1) {
            console.log("Look man, I could do this action just for the first one...");
          }
          const link = `/user/admin/community/members/${action._rows[0]._id}`;
          this.router.navigate([link]);
        } else {
          console.error("What? empty rows? How did you do that?");
        }
        break;

      case 'COMMON.TAG_LABEL.ADD_TAGS':
        this.editTags(action._rows);
        break;

    }

  }


  onClickEdit(pro: Professional) {
    this.professionalsService.get(pro._id).subscribe((professional: Professional) => {
      this._isProfessionalForm = true;
      this._isTagsForm = false;
      this._currentPro = professional;
      this._sidebarValue = {
        animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
        title: 'SIDEBAR.TITLE.EDIT_PROFESSIONAL',
        type: 'professional'
      };
      this._currentPro = professional;
    });
  }


  updatePro(pro: Professional): void {
    this.editUser[pro._id] = false;

    this.professionalsService.save(pro._id, pro).subscribe((res: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_UPDATE_TEXT');
      this.loadPros(this._config);
    }, (err: any) => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  deleteProsModal(pros: Professional[]) {
    this._modalDelete = true;
    this._prosToRemove = pros;
  }


  onClickSubmit(event: Event) {
    event.preventDefault();

    for (const pro of this._prosToRemove) {
      if(this.isCampaignProsLis()) {
        this.removeProsFromCampaign(pro._id)
      } else {
        this.removePro(pro._id);
      }
    }

    this._prosToRemove = [];
    this._modalDelete = false;

  }


  private removePro(userId: string) {
    this.professionalsService.remove(userId).subscribe((foo: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_DELETE_TEXT');
      this.loadPros(this._config);
    }, () => {
      this.translateNotificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  private removeProsFromCampaign(userId: string) {
    const campaignId = this.campaign._id;
    const innovationId = this.campaign.innovation._id;
    this.professionalsService.removeFromCampaign(userId, campaignId, innovationId)
      .subscribe(result => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_DELETE_TEXT');
        this.loadPros(this._config);
    }, err => {
        this.translateNotificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
      });
  }


  editTags(pros: Professional[]) {
    this._isProfessionalForm = false;
    this._isTagsForm = true;
    this._prosToTag = pros;

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.ADD_TAGS',
      type: 'addTags'
    };

  }


  addTagsToPro(tags: Tag[]) {
    this._prosToTag.forEach((value, index) => {
      if (!this._prosToTag[index].tags) {
        this._prosToTag[index].tags = [];
      }
      tags.forEach(value1 => {
        if (!(value.tags.find(value2 => {return value2._id === value1._id}))) {
          this._prosToTag[index].tags.push(value1);
        }
      });
    });

    this._prosToTag.forEach(value => this.updatePro(value));

  }

  public isCampaignProsLis(): boolean {
    return !!this.campaign;
  }

  get total() {
    return this._total;
  }

  get pros() {
    return this._pros;
  }

  get config() {
    return this._config;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
  }

  get currentPro(): Professional {
    return this._currentPro;
  }

  get isProfessionalForm(): boolean {
    return this._isProfessionalForm;
  }

  get isTagsForm(): boolean {
    return this._isTagsForm;
  }

}
