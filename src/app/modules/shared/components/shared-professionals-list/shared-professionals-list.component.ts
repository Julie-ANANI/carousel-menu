import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Professional } from '../../../../models/professional';
import { Table } from '../../../table/models/table';
import { Config } from '../../../../models/config';
import { ProfessionalsService} from '../../../../services/professionals/professionals.service';
import { first} from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../sidebars/interfaces/sidebar-interface';
import { Campaign } from '../../../../models/campaign';
import { Router } from '@angular/router';
import { Tag } from '../../../../models/tag';
import { RolesFrontService } from "../../../../services/roles/roles-front.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../../services/error/error-front.service";

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-shared-professionals-list',
  templateUrl: './shared-professionals-list.component.html',
  styleUrls: ['./shared-professionals-list.component.scss']
})

export class SharedProfessionalsListComponent {

  // ex: ['professionals', 'tableColumns'] or ['projects', 'campaigns', 'campaign', 'pros', 'tableColumns']
  @Input() tableColumnsPath: Array<string> = [];

  // ex: ['professionals', 'searchBy'] or ['projects', 'campaigns', 'campaign', 'pros', 'searchBy']
  @Input() searchByPath: Array<string> = [];

  // ex: ['professionals', 'profile'] or ['projects', 'campaigns', 'campaign', 'pros', 'profile']
  @Input() profilePath: Array<string> = [];

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

  @Output() selectedProfessionalChange: EventEmitter<{ total: number, pros: Array<any> }>
    = new EventEmitter<{ total: number, pros: Array<any> }>();

  private _professionals: Array<SelectedProfessional> = [];

  private _table: Table;

  private _tableSelector: string;

  private _total: number;

  private _config: Config;

  private _sidebarValue: SidebarInterface = {
    animate_state: 'inactive'
  };

  private _isProfessionalSidebar = false;

  private _isTagsSidebar = false;

  private _selectedProfessional: Professional;

  private _campaign: Campaign = null;

  private _modalDelete: boolean;

  private _professionalsToRemove: Array<SelectedProfessional> = [];

  private _professionalsToTags: Array<SelectedProfessional> = [];

  constructor(private _professionalsService: ProfessionalsService,
              private _router: Router,
              private _rolesFrontService: RolesFrontService,
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
      _title: 'professionals',
      _content: this._professionals,
      _total: this._total,
      _isSearchable: true,
      _isTitle: true,
      _isPaginable: true,
      _isDeletable: this.canAccessProfile(['delete']),
      _isSelectable: this.canAccessProfile(['delete']) || this.canAccessProfile(['edit']),
      _buttons: [
          {_label: 'Merge', _icon: 'fas fa-object-group', _isHidden: !this.canAccessProfile(['edit'])},
          {_label: 'Convert to ambassador', _icon: 'fas fa-user-graduate', _isHidden: !this.canAccessProfile(['edit'])},
          {_label: 'Add tags', _icon: 'icon icon-plus', _iconSize: '12px', _isHidden: !this.canAccessProfile(['edit'])}],
      _clickIndex: this.canAccessProfile(['view']) ? 2 : null,
      _columns: [
        {
          _attrs: ['ambassador.is'],
          _name: 'Member',
          _type: 'MULTI-IMAGE-CHOICES',
          _isSearchable: this.canAccessSearchBy(['member']),
          _isHidden: !this.canAccessTableColumns(['member']),
          _width: '180px',
          _choices: [
            {_name: 'false', _alias: 'No', _url: ''},
            {
              _name: 'true',
              _alias: 'Yes',
              _url: 'https://res.cloudinary.com/umi/image/upload/v1552659548/app/default-images/badges/ambassador.svg'
            }
          ]
        },
        {
          _attrs: ['firstName', 'lastName'],
          _name: 'Name',
          _type: 'TEXT',
          _isSearchable: this.canAccessSearchBy(['name']),
          _isSortable: true,
          _isHidden: !this.canAccessTableColumns(['name']),
        },
        {
          _attrs: ['email'],
          _name: 'Email Address',
          _type: 'TEXT',
          _isSearchable: this.canAccessSearchBy(['email']),
          _isSortable: true,
          _isHidden: true
        },
        {
          _attrs: ['country'],
          _name: 'Country',
          _type: 'COUNTRY',
          _isSortable: true,
          _isSearchable: this.canAccessSearchBy(['country']),
          _isHidden: !this.canAccessTableColumns(['country']),
          _width: '180px',
        },
        {
          _attrs: ['jobTitle'],
          _name: 'Job Title',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccessSearchBy(['job']),
          _isHidden: !this.canAccessTableColumns(['job'])
        },
        {
          _attrs: ['company'],
          _name: 'Company',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccessSearchBy(['company']),
          _isHidden: !this.canAccessTableColumns(['company'])
        },
        {
          _attrs: ['campaigns'],
          _name: 'Campaigns',
          _type: 'ARRAY',
          _isSortable: true,
          _isSearchable: this.canAccessSearchBy(['campaign']),
          _isHidden: !this.canAccessTableColumns(['campaign']),
          _width: '120px'
        },
        {
          _attrs: ['messages'],
          _name: 'Contact',
          _type: 'ARRAY',
          _isSortable: true,
          _isSearchable: this.canAccessSearchBy(['contact']),
          _isHidden: !this.canAccessTableColumns(['contact']),
          _width: '120px'
        },
      ]
    };
  }

  public canAccessTableColumns(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(this.tableColumnsPath.concat(path));
  }

  public canAccessSearchBy(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(this.searchByPath.concat(path));
  }

  public canAccessProfile(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(this.profilePath.concat(path));
  }

  public onConfigChange(value: Config) {
    this.configChange.emit(value);
  }

  private _resetSidebarVariables(sidebarToReset: string) {
    switch (sidebarToReset) {

      case 'professional':
        this._isProfessionalSidebar = false;
        return;

      case 'tags':
        this._isTagsSidebar = false;
        return;

    }
  }

  public onClickEdit(value: Professional) {
    if (this.canAccessProfile(['view'])) {
      this._resetSidebarVariables('tags');

      this._professionalsService.get(value._id).pipe(first()).subscribe((response: Professional) => {
        this._selectedProfessional = response;
        this._isProfessionalSidebar = true;
        this._sidebarValue = {
          animate_state: 'active',
          title: 'SIDEBAR.TITLE.EDIT_PROFESSIONAL',
          type: 'professional'
        };
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });

    }
  }

  public onClickDelete(value: Array<SelectedProfessional>) {
    if (this.canAccessProfile(['delete'])) {
      this._professionalsToRemove = value;
      this._modalDelete = true;
    }
  }

  public onClickConfirm() {
    if (this.canAccessProfile(['delete'])) {

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
    if (this.canAccessProfile(['edit'])) {
      switch (value._action) {

        case('Convert to ambassador'):
          if(value._rows.length) {
            if(value._rows.length > 1) {
              this._translateNotificationsService.error('ERROR.ERROR', "Look, I could do this action just for the first one...");
            }
            const link = `/user/admin/community/members/${value._rows[0]._id}`;
            this._router.navigate([link]);
          } else {
            this._translateNotificationsService.error('ERROR.ERROR', "What? empty rows? How did you do that?");
          }
          break;

        case('Add tags'):
          this._editProfessionalTags(value._rows);
          break;

        default:
          this._translateNotificationsService.error('ERROR.ERROR', "Idk how to do that :(");

      }
    }
  }

  private _editProfessionalTags(value: Array<SelectedProfessional>) {
    if (this.canAccessProfile(['edit'])) {
      this._resetSidebarVariables('professional');
      this._professionalsToTags = value;
      this._isTagsSidebar = true;
      this._sidebarValue = {
        animate_state: 'active',
        title: 'SIDEBAR.TITLE.ADD_TAGS',
        type: 'addTags'
      };
    }
  }

  public addProfessionalTags(tags: Array<Tag>) {
    if (this.canAccessProfile(['edit'])) {

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
  }

  public onSelectRows(value: any) {
    if (this.canAccessProfile(['delete']) || this.canAccessProfile(['edit'])) {
      this.selectedProfessionalChange.emit({ total: value._rows.length, pros: value._rows });
    }
  }

  public updateProfessional(value: Professional) {
    if (this.canAccessProfile(['edit'])) {
      this._professionalsService.save(value._id, value).pipe(first()).subscribe(() => {
        this.onConfigChange(this._config);
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_UPDATE_TEXT');
      }, (err) => {
        if(err && err.error.code && err.error.code === 11000) {
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROFESSIONAL.MERGE_ERROR');
        } else {
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
        }
      });
    }
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

}
