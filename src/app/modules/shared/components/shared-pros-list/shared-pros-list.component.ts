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

  smartSelect: any = null;

  editUser: {[propString: string]: boolean} = {};

  private _tableInfos: Table = null;

  private _actions: string[] = ['COMMON.TAG_LABEL.ADD_TAGS'];

  private _total = 0;

  private _pros: Array <SelectedProfessional>;

  private _prosToRemove: Professional[] = [];

  private _prosToTag: Professional[] = [];

  private _sidebarValue: SidebarInterface = {};

  private _currentPro: Professional = null;

  isProfessionalForm = false;

  isTagsForm = false;

  private _modalDelete = false;

  constructor(private professionalsService: ProfessionalsService,
              private translateNotificationsService: TranslateNotificationsService,
              private searchService: SearchService) { }

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
          _isHeadable: true,
          _isFiltrable: true,
          _isDeletable: true,
          _isSelectable: true,
          _isEditable: true,
          _actions: this._actions,
          _columns: [
            {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
            {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY'},
            {_attrs: ['jobTitle'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT'},
            {_attrs: ['company.name'], _name: 'TABLE.HEADING.COMPANY', _type: 'TEXT', _isSortable: false, _isFiltrable: false},
            {_attrs: ['campaigns'], _name: 'TABLE.HEADING.CAMPAIGNS', _type: 'ARRAY'}
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
          _isFiltrable: true,
          _isHeadable: true,
          _isDeletable: true,
          _isSelectable: true,
          _isEditable: true,
          _actions: this._actions,
          _editIndex: 2,
          _columns: [
            {_attrs: ['ambassador.is'], _name: 'Member', _type: 'MULTI-CHOICES',
              _choices: [
                {_name: 'false', _alias: 'No'},
                {_name: 'true', _alias: 'Yes',
                  _url: 'https://res.cloudinary.com/umi/image/upload/v1552659548/app/default-images/badges/ambassador.svg'}]},
            {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
            {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY'},
            {_attrs: ['jobTitle'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT'},
            {_attrs: ['company'], _name: 'TABLE.HEADING.COMPANY', _type: 'TEXT'},
            {_attrs: ['campaigns'], _name: 'TABLE.HEADING.CAMPAIGNS', _type: 'ARRAY'},
            {_attrs: ['sent'], _name: 'TABLE.HEADING.CONTACT', _type: 'CHECK'}]
        };
      });
    }

  }

  private configToString() {
    let config = {};
    Object.keys(this._config).forEach(key=>{
      if(this._config[key] instanceof Object) {
        config[key] = JSON.stringify(this._config[key]);
      } else {
        config[key] = this._config[key];
      }
    });

    return config;
  }


  selectPro(event): void {
    this.selectedProsChange.emit({
      total: event._rows.length,
      pros: event._rows
    });
  }


  updateSelection(event: any) {
    this.smartSelect = event;
    const config = this._config;
    config.offset = this.smartSelect.offset;
    config.limit = this.smartSelect.limit;
    this.selectedProsChange.emit({
      total: this.nbSelected,
      pros: 'all',
      query: config
    });
  }


  get nbSelected(): number {
    if (this.smartSelect) {
      return (this.smartSelect.limit + this.smartSelect.offset) > this.total ?
        this.total - this.smartSelect.offset :
        this.smartSelect.limit;
    }
    return this._pros ? this._pros.filter(p => p.isSelected).length : 0;
  }


  performActions(action: any) {
    switch (this._actions.findIndex(value => action._action === value)) {
      case 0: {
        this.editTags(action._rows);
        break;
      }
    }
  }


  onClickEdit(pro: Professional) {
    this.professionalsService.get(pro._id).subscribe((professional: Professional) => {
      this.isProfessionalForm = true;
      this.isTagsForm = false;
      this._currentPro = professional;
      this._sidebarValue = {
        animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
        title: 'SIDEBAR.TITLE.EDIT_PROFESSIONAL',
        type: 'professional'
      };
    });
  }


  updatePro(pro: Professional): void {
    this.editUser[pro._id] = false;

    this.professionalsService.save(pro._id, pro).pipe(first()).subscribe((res: any) => {
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
    this.professionalsService.remove(userId).pipe(first()).subscribe((foo: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_DELETE_TEXT');
      this.loadPros(this._config);
    }, () => {
      this.translateNotificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  private removeProsFromCampaign(userId: string) {
    const campaignId = this.campaign['id'];
    const innovationId = this.campaign.innovation._id;
    this.professionalsService.removeFromCampaign(userId, campaignId, innovationId)
      .pipe(first())
      .subscribe(result=>{
        this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_DELETE_TEXT');
        this.loadPros(this._config);
    }, err=>{
        this.translateNotificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
      });
  }


  editTags(pros: Professional[]) {
    this.isProfessionalForm = false;
    this.isTagsForm = true;
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
        }})
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

  get prosToRemove(): Professional[] {
    return this._prosToRemove;
  }

  get prosToTag(): Professional[] {
    return this._prosToTag;
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

}


// deletePro(pro: Professional, event: Event): void {
//   event.preventDefault();
//
//   this.editUser[pro._id] = false;
//
//   this._professionalService.remove(pro._id).pipe(first()).subscribe((res: any) => {
//     this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_DELETE_TEXT');
//   }, (err: any) => {
//     this._notificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
//   });
//
// }

// deleteProModal(pro: Professional) {
//   this._prosToRemove = [];
//   this._sidebarValue = {
//     animate_state: 'inactive',
//     title: this._sidebarValue.title
//   };
//   this._showDeleteModal = true;
//   this._prosToRemove.push(pro);
// }
