import { Component, Input, Output, EventEmitter } from '@angular/core';
//import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Campaign } from '../../../../models/campaign';
import { Professional } from '../../../../models/professional';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';
import { Tag } from '../../../../models/tag';
import { AdvSearchService } from "../../../../services/advsearch/advsearch.service";

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-shared-ambassadors-list',
  templateUrl: './shared-ambassador-list.component.html',
  styleUrls: ['./shared-ambassador-list.component.scss']
})

export class SharedAmbassadorListComponent {

  @Input() requestId: string;

  @Input() campaign: Campaign;

  @Input() set config(value: any) {
    this.loadPros(value);
  }

  @Output() selectedProsChange = new EventEmitter<any>();

  private _config: any;

  smartSelect: any = null;

  editUser: { [propString: string]: boolean } = {};

  private _tableInfos: any = null;

  private _actions: string[] = [];

  private _total = 0;

  private _pros: Array<SelectedProfessional>;

  private _prosToRemove: Professional[] = [];

  private _prosToTag: Professional[] = [];

  private _sidebarValue: SidebarInterface = {};

  private _currentPro: Professional = null;

  isProfessionalForm = false;

  isTagsForm = false;

  private _modalDelete = false;

  constructor(private _advSearchService: AdvSearchService,
  //            private translateNotificationsService: TranslateNotificationsService
  ) {
  }

  loadPros(config: any): void {
    this._config = config;

    this._advSearchService.getCommunityMembers(this.configToString()).pipe(first()).subscribe((pros: any) => {
      this._pros = pros.result;
      this._pros.forEach(pro => {
        pro.sent = pro.messages && pro.messages.length > 0;
      });

      this._total = pros._metadata.totalCount;

      this._tableInfos = {
        _selector: 'admin-ambassador',
        _title: 'TABLE.TITLE.AMBASSADORS',
        _content: this._pros,
        _total: this._total,
        _isFiltrable: false,
        _isLocal: true,
        _isHeadable: false,
        _isDeletable: true,
        _isSelectable: true,
        _actions: this._actions,
        _columns: [
          //"tags.label":1, "country":1,"answers.innovation":1, "answers.status":1, "ambassador.industry":1
          {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
          {_attrs: ['tags'], _name: 'TABLE.HEADING.SECTORS', _type: 'TAG-LIST'},
          {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY'},
          {_attrs: ['ambassador.industry'], _name: 'TABLE.HEADING.INDUSTRY', _type: 'TEXT'},
          {_attrs: ['answers'], _name: 'TABLE.HEADING.FEEDBACK', _type: 'ARRAY'}]
      };

    });

  }

  private configToString() {
    let config = {};
    Object.keys(this._config).forEach(key => {
      if (this._config[key] instanceof Object) {
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


  onClickEdit(value: any) {
    console.log(value);
  }


  updatePro(pro: Professional): void {
    this.editUser[pro._id] = false;
  }


  deleteProsModal(pros: Professional[]) {
    this._modalDelete = true;
    this._prosToRemove = pros;
  }


  onClickSubmit(event: Event) {
    event.preventDefault();

    for (const pro of this._prosToRemove) {
      if (this.isCampaignProsLis()) {
        this.removeProsFromCampaign(pro._id)
      } else {
        this.removePro(pro._id);
      }
    }

    this._prosToRemove = [];
    this._modalDelete = false;

  }


  private removePro(userId: string) {

  }

  private removeProsFromCampaign(userId: string) {

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
        if (!(value.tags.find(value2 => {
          return value2._id === value1._id
        }))) {
          this._prosToTag[index].tags.push(value1);
        }
      })
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

  get tableInfos(): any {
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
