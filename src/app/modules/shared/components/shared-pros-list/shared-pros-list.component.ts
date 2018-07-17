import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { SearchService } from '../../../../services/search/search.service';
import { Campaign } from '../../../../models/campaign';
import { Professional } from '../../../../models/professional';
import {Table} from '../../../table/models/table';
import {Template} from '../../../sidebar/interfaces/template';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-shared-pros-list',
  templateUrl: './shared-pros-list.component.html',
  styleUrls: ['./shared-pros-list.component.scss']
})
export class SharedProsListComponent {

  private _config: any;
  public smartSelect: any = null;
  public editUser: {[propString: string]: boolean} = {};
  private _tableInfos: Table = null;

  @Input() public requestId: string;
  @Input() public campaign: Campaign;
  @Input() set config(value: any) {
    this.loadPros(value);
  }
  @Output() selectedProsChange = new EventEmitter <any>();

  private _total = 0;
  private _pros: Array <SelectedProfessional>;

  private _prosToRemove: Professional[] = [];
  private _more: Template = {};
  private _showDeleteModal = false;
  private _currentPro: Professional = null;

  constructor(private _professionalService: ProfessionalsService,
              private _notificationsService: TranslateNotificationsService,
              private _searchService: SearchService) { }

  loadPros(config: any): void {
    this._config = config;

    if (this.requestId) {
      this._searchService.getPros(this._config, this.requestId).first().subscribe(pros => {
        this._pros = pros.persons;
        this._total = pros._metadata.totalCount;

        this._tableInfos = {
          _selector: 'admin-pros',
          _title: 'COMMON.PROFESSIONALS',
          _content: this._pros,
          _total: this._total,
          _isHeadable: true,
          _isFiltrable: true,
          _isDeletable: true,
          _isSelectable: true,
          _isEditable: true,
          _columns: [
            {_attrs: ['firstName', 'lastName'], _name: 'COMMON.NAME', _type: 'TEXT'},
            {_attrs: ['country'], _name: 'COMMON.COUNTRY', _type: 'COUNTRY'},
            {_attrs: ['jobTitle'], _name: 'COMMON.JOBTITLE', _type: 'TEXT'},
            {_attrs: ['company.name'], _name: 'COMMON.COMPANY', _type: 'TEXT', _isSortable: false, _isFiltrable: false},
            {_attrs: ['campaigns'], _name: 'COMMON.CAMPAIGNS', _type: 'ARRAY'}]
        };

      });
    } else {
      this._professionalService.getAll(this._config).first().subscribe(pros => {
        this._pros = pros.result;
        this._total = pros._metadata.totalCount;

        this._tableInfos = {
          _selector: 'admin-pros',
          _title: 'COMMON.PROFESSIONALS',
          _content: this._pros,
          _total: this._total,
          _isFiltrable: true,
          _isHeadable: true,
          _isDeletable: true,
          _isSelectable: true,
          _isEditable: true,
          _columns: [
            {_attrs: ['firstName', 'lastName'], _name: 'COMMON.NAME', _type: 'TEXT'},
            {_attrs: ['country'], _name: 'COMMON.COUNTRY', _type: 'COUNTRY'},
            {_attrs: ['jobTitle'], _name: 'COMMON.JOBTITLE', _type: 'TEXT'},
            {_attrs: ['company'], _name: 'COMMON.COMPANY', _type: 'TEXT'},
            {_attrs: ['campaigns'], _name: 'COMMON.CAMPAIGNS', _type: 'ARRAY'}]
        };

      });
    }

  }

  selectPro(pro: SelectedProfessional): void {
    pro.isSelected = !pro.isSelected;
    const prosSelected = this._pros.filter(p => p.isSelected);
    this.selectedProsChange.emit({
      total: this.nbSelected,
      pros: prosSelected
    });
  }

  updatePro(pro: Professional): void {
    this.editUser[pro._id] = false;
    this._professionalService.save(pro._id, pro).first().subscribe(res => {
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
      this._more = {animate_state: 'inactive', title: this._more.title};
      this.loadPros(this._config);
    }, err => {
      this._notificationsService.error('ERROR.ERROR', err.message);
    });
  }

  deletePro(pro: Professional, event: Event): void {
      event.preventDefault();
      this.editUser[pro._id] = false;
      this._professionalService.remove(pro._id).first().subscribe(res => {
          this._notificationsService.success('ERROR.SUCCESS', 'ERROR.SUCCESS');
      }, err => {
          this._notificationsService.error('ERROR', err.message);
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

  editPro(pro: Professional) {
    this._professionalService.get(pro._id).subscribe((professional: Professional) => {
      this._more = {
        animate_state: 'active',
        title: 'COMMON.EDIT_PROFESSIONAL',
        type: 'professional'
      };
      this._currentPro = professional;
    });
  }

  closeSidebar(value: string) {
    this._more.animate_state = value;
  }

  deleteProModal(pro: Professional) {
    this._prosToRemove = [];
    this._more = {animate_state: 'inactive', title: this._more.title};
    this._showDeleteModal = true;
    this._prosToRemove.push(pro);
  }

  deleteProsModal(pros: Professional[]) {
    this._showDeleteModal = true;
    this._prosToRemove = pros;
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._showDeleteModal = false;
  }

  removePros() {
    for (const pro of this._prosToRemove) {
      this.removePro(pro._id);
    }
    this._prosToRemove = [];
    this._showDeleteModal = false;
  }

  removePro(userId: string) {
    this._professionalService.remove(userId).first()
      .subscribe(foo => {
        this.loadPros(this._config);
      });
  }

  get total() { return this._total; }
  get pros() { return this._pros; }
  get config() { return this._config; }
  get tableInfos(): Table { return this._tableInfos; }
  get prosToRemove(): Professional[] { return this._prosToRemove; }
  get more(): any { return this._more; }
  get showDeleteModal(): boolean { return this._showDeleteModal; }
  get currentPro(): Professional { return this._currentPro; }
}
