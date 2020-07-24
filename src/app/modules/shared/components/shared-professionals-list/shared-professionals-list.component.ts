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

  @Input() accessPath: Array<string> = [];

  @Input() set config(value: Config) {
    this._localConfig = value;
  }

  @Input() tableSelector = '';

  @Input() total = -1;

  @Input() campaign: Campaign = <Campaign>{};

  @Input() set professionals(value: Array<SelectedProfessional>) {
    this._professionals = value;
    this._setProfessionals();
    this._initializeTable();
  }

  @Output() configChange: EventEmitter<Config> = new EventEmitter<Config>();

  @Output() selectedProfessionalChange: EventEmitter<{ total: number, pros: Array<any> }>
    = new EventEmitter<{ total: number, pros: Array<any> }>();

  private _professionals: Array<SelectedProfessional> = [];

  private _table: Table = <Table>{};

  private _localConfig: Config = <Config>{};

  private _sidebarValue: SidebarInterface = {
    animate_state: 'inactive'
  };

  private _isProfessionalSidebar = false;

  private _isTagsSidebar = false;

  private _selectedProfessional: Professional = <Professional>{};

  private _modalDelete = false;

  private _professionalsToRemove: Array<SelectedProfessional> = [];

  private _professionalsToTags: Array<SelectedProfessional> = [];

  private _isDeleting = false;

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
      _selector: this.tableSelector,
      _title: 'professionals',
      _content: this._professionals,
      _total: this.total,
      _isSearchable: !!this.canAccess(['searchBy']),
      _isTitle: true,
      _isPaginable: true,
      _isDeletable: this.canAccess(['profile', 'delete']),
      _isSelectable: this.canAccess(['profile', 'delete']) || this.canAccess(['profile', 'edit']),
      _buttons: [
          {
            _label: 'Merge',
            _icon: 'fas fa-object-group',
            _isHidden: !this.canAccess(['profile', 'edit'])
          },
          {
            _label: 'Convert to ambassador',
            _icon: 'fas fa-user-graduate',
            _isHidden: !this.canAccess(['profile', 'edit'])
          },
          {
            _label: 'Add tags',
            _icon: 'icon icon-plus',
            _iconSize: '12px',
            _isHidden: !this.canAccess(['profile', 'edit'])
          }
          ],
      _clickIndex: (this.canAccess(['profile', 'view']) || this.canAccess(['profile', 'edit'])) ?
        this.canAccess(['tableColumns', 'member']) ? 2 : 1 : null,
      _columns: [
        {
          _attrs: ['ambassador.is'],
          _name: 'Member',
          _type: 'MULTI-IMAGE-CHOICES',
          _isSearchable: this.canAccess(['searchBy', 'member']),
          _isHidden: !this.canAccess(['tableColumns', 'member']),
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
          _isSearchable: this.canAccess(['searchBy', 'name']),
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'name']),
        },
        {
          _attrs: ['email'],
          _name: 'Email Address',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'email']),
          _isSortable: true,
          _isHidden: true
        },
        {
          _attrs: ['country'],
          _name: 'Country',
          _type: 'COUNTRY',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'country']),
          _isHidden: !this.canAccess(['tableColumns', 'country']),
          _width: '180px',
        },
        {
          _attrs: ['jobTitle'],
          _name: 'Job Title',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'job']),
          _isHidden: !this.canAccess(['tableColumns', 'job'])
        },
        {
          _attrs: ['company'],
          _name: 'Company',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'company']),
          _isHidden: !this.canAccess(['tableColumns', 'company'])
        },
        {
          _attrs: ['campaigns'],
          _name: 'Campaigns',
          _type: 'ARRAY',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'campaign']),
          _isHidden: !this.canAccess(['tableColumns', 'campaign']),
          _width: '120px'
        },
        {
          _attrs: ['messages'],
          _name: 'Contact',
          _type: 'ARRAY',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'contact']),
          _isHidden: !this.canAccess(['tableColumns', 'contact']),
          _width: '120px'
        },
      ]
    };
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
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
    this._resetSidebarVariables('tags');
    this._professionalsService.get(value._id).pipe(first()).subscribe((response: Professional) => {
      this._selectedProfessional = response;
      this._isProfessionalSidebar = true;
      this._sidebarValue = {
        animate_state: 'active',
        title: this.canAccess(['profile', 'edit']) ? 'Edit Professional' : 'View Professional',
        type: 'professional'
      };
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onClickDelete(value: Array<SelectedProfessional>) {
    this._professionalsToRemove = value;
    this._modalDelete = true;
  }

  public onClickConfirm() {
    if (!this._isDeleting) {
      this._isDeleting = true;
      this._professionalsToRemove.forEach((professional, index) => {
        if(this._isCampaignProfessional()) {
          this._removeProfessionalFromCampaign(professional._id, index)
        } else {
          this._removeProfessional(professional._id, index);
        }
      });
    }
  }

  private _removeProfessionalFromCampaign(value: string, index: number) {
    const _campaignId = this.campaign._id;
    const _innovationId = this.campaign.innovation._id;

    this._professionalsService.removeFromCampaign(value, _campaignId, _innovationId).pipe(first()).subscribe(result => {
      if (index === this._professionalsToRemove.length - 1) {
        this.onConfigChange(this._localConfig);
        this._translateNotificationsService.success('Success', 'The professional(s) are deleted from the campaign.');
        this._modalDelete = false;
        this._professionalsToRemove = [];
      }
      }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      if (index === this._professionalsToRemove.length - 1) {
        this._isDeleting = false;
      }
      console.error(err);
    });
  }

  private _removeProfessional(value: string, index: number) {
    this._professionalsService.remove(value).pipe(first()).subscribe(() => {
      if (index === this._professionalsToRemove.length - 1) {
        this.onConfigChange(this._localConfig);
        this._translateNotificationsService.success('Success', 'The professional(s) are deleted.');
        this._modalDelete = false;
        this._professionalsToRemove = [];
      }
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      if (index === this._professionalsToRemove.length - 1) {
        this._isDeleting = false;
      }
      console.error(err);
    });
  }

  public onClickActions(value: any) {
    switch (value._action) {

      case('Convert to ambassador'):
        if(value._rows.length) {
          if(value._rows.length > 1) {
            this._translateNotificationsService.error('Error', "Look, I could do this action just for " +
              "the first one...");
          }
          const link = `/user/admin/community/members/${value._rows[0]._id}`;
          this._router.navigate([link]);
        } else {
          this._translateNotificationsService.error('Error', "What? empty rows? How did you do that?");
        }
        break;

      case('Add tags'):
        this._editProfessionalTags(value._rows);
        break;

      default:
        this._translateNotificationsService.error('Error', "Idk how to do that :(");

    }
  }

  private _editProfessionalTags(value: Array<SelectedProfessional>) {
    this._resetSidebarVariables('professional');
    this._professionalsToTags = value;
    this._isTagsSidebar = true;
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Add Tags',
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

    this._professionalsToTags.forEach((value, index) => {
      this.updateProfessional(value, index, this._professionalsToTags.length - 1);
    });
  }

  public onSelectRows(value: any) {
    this.selectedProfessionalChange.emit({ total: value._rows.length, pros: value._rows });
  }

  public updateProfessional(value: Professional, index?: number, total?: number) {
    this._professionalsService.save(value._id, value).pipe(first()).subscribe(() => {
      if (index && total && index === total) {
        this.onConfigChange(this._localConfig);
        this._translateNotificationsService.success('Success', 'The professionals are updated.');
      } else if (!index && !total) {
        this.onConfigChange(this._localConfig);
        this._translateNotificationsService.success('Success', 'The professional is updated.');
      }
    }, (err: HttpErrorResponse) => {
      if(err && err.error.code && err.error.code === 11000) {
        this._translateNotificationsService.error('Error', 'A professional with that e-mail already exists. ' +
          'Try to manually merge both professionals. For more info, ask the tech team.');
      } else {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      }
      console.error(err);
    });
  }

  private _isCampaignProfessional(): boolean {
    return !!this.campaign;
  }

  get professionals(): Array<SelectedProfessional> {
    return this._professionals;
  }

  get table(): Table {
    return this._table;
  }

  get localConfig(): Config {
    return this._localConfig;
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

  get isDeleting(): boolean {
    return this._isDeleting;
  }

}
