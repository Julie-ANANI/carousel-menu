import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Professional } from '../../../../models/professional';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { Campaign } from '../../../../models/campaign';
import { Router } from '@angular/router';
import { Tag } from '../../../../models/tag';
import { RolesFrontService } from '../../../../services/roles/roles-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../services/error/error-front.service';
import { GeographySettings } from '../../../../models/innov-settings';
import {Column, Table, UmiusConfigInterface, UmiusSidebarInterface} from '@umius/umi-common-component';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-shared-professionals-list',
  templateUrl: './shared-professionals-list.component.html',
})
export class SharedProfessionalsListComponent {
  @Input() accessPath: Array<string> = [];

  private _isFiltersSidebar = false;

  @Input() set config(value: UmiusConfigInterface) {
    this._localConfig = value;
  }

  @Input() tableSelector = '';

  @Input() total = -1;

  @Input() campaign: Campaign = null; // This needs to be initialized as null because of some verifications below !!campaign

  @Input() set professionals(value: Array<SelectedProfessional>) {
    this._professionals = value;
    this._setProfessionals();
    this._initializeTable();
  }

  @Output() configChange: EventEmitter<UmiusConfigInterface> = new EventEmitter<UmiusConfigInterface>();

  @Output() selectedProfessionalChange: EventEmitter<{
    total: number;
    pros: Array<any>;
  }> = new EventEmitter<{ total: number; pros: Array<any> }>();

  private _professionals: Array<SelectedProfessional> = [];

  private _table: Table = <Table>{};

  private _localConfig: UmiusConfigInterface = <UmiusConfigInterface>{};

  /**
   * deletion confirmation modal
   * @private
   */
  private _isShowModal = false;

  private _sidebarValue: UmiusSidebarInterface = {
    animate_state: 'inactive',
  };

  private _isProfessionalSidebar = false;

  private _isTagsSidebar = false;

  private _selectedProfessional: Professional = <Professional>{};

  private _modalDelete = false;

  private _professionalsToRemove: Array<SelectedProfessional> = [];

  private _professionalsToTags: Array<SelectedProfessional> = [];

  private _isDeleting = false;

  private _isSelectAll = false;

  private _countriesSelected: Array<any> = [];

  private _geography: GeographySettings = {
    continentTarget: {
      africa: false,
      oceania: false,
      asia: false,
      europe: false,
      americaNord: false,
      americaSud: false,
    },
    exclude: [],
    include: [],
  };

  constructor(
    private _professionalsService: ProfessionalsService,
    private _router: Router,
    private _rolesFrontService: RolesFrontService,
    private _translateNotificationsService: TranslateNotificationsService
  ) {
  }

  private _setProfessionals() {
    if (this._professionals.length > 0) {
      this._professionals.forEach((professional) => {
        professional.sent =
          professional.messages && professional.messages.length > 0;
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
      _paginationTemplate: 'TEMPLATE_1',
      _buttons: this.tableSelector === 'admin-campaign-pros-limit' ? [
        {
          _label: 'Filter by country',
          _action: 'filter by country'
        }
      ] : [],
      _isCanSelectAll: this.tableSelector === 'admin-campaign-pros-limit',
      _isNoMinHeight: this.total < 11,
      _isDeletable: this.canAccess(['user', 'delete']),
      _isSelectable: this._isSelectable(),
      _actions: [
        {
          _label: 'Remove',
          _icon: 'icon icon-delete',
          _iconSize: '12px',
          _isHidden: !this.canAccess(['user', 'remove'])
        },
      ],
      _clickIndex:
        this.canAccess(['user', 'view']) || this.canAccess(['user', 'edit'])
          ? this.canAccess(['tableColumns', 'member'])
          ? 2
          : 1
          : null,
      _columns: [
        {
          _attrs: ['member'],
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
              _url:
                'https://res.cloudinary.com/umi/image/upload/v1552659548/app/default-images/badges/ambassador.svg',
            },
          ],
        },
        {
          _attrs: ['firstName', 'lastName'],
          _name: 'Name',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'name']),
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'name']),
          _searchTooltip:
            'Utilisez "prénom,nom" pour faire des recherches de personnes',
        },
        {
          _attrs: ['email'],
          _name: 'Email Address',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'email']),
          _isSortable: true,
          _isHidden: true,
        },
        {
          _attrs: ['country'],
          _name: 'Country',
          _type: 'COUNTRY',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'country']),
          _isHidden: !this.canAccess(['tableColumns', 'country']),
          _width: '150px',
        },
        {
          _attrs: ['jobTitle'],
          _name: 'Job Title',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'job']),
          _isHidden: !this.canAccess(['tableColumns', 'job']),
        },
        {
          _attrs: ['companyOriginalName'],
          _name: 'Company',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'company']),
          _isHidden: !this.canAccess(['tableColumns', 'company']),
        },
        {
          _attrs: ['campaigns'],
          _name: 'Campaigns',
          _type: 'ARRAY',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'campaign']),
          _isHidden: !this.canAccess(['tableColumns', 'campaign']),
          _width: '120px',
        },
        {
          _attrs: ['messages'],
          _name: 'Contact',
          _type: 'ARRAY',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'contact']),
          _isHidden: !this.canAccess(['tableColumns', 'contact']),
          _width: '120px',
        },
      ],

    };

    if (this._table._selector === 'admin-campaign-pros-limit') {
      this._table._columns.push(this._emailConfCol(), this._unShieldCol());
    } else {
      this._table._columns.push(this._unShieldCol(), this._emailConfCol());
    }

  }

  private _unShieldCol(): Column {
    return {
      _attrs: ['unshield'],
      _name: 'Unshield',
      _type: 'DATE',
      _width: '140px',
      _isHidden: !this.canAccess(['tableColumns', 'unshield']),
    };
  }

  /**
   * it not emailConfidence then we assign 0 as default.
   * @private
   */
  private _emailConfCol(): Column {
    return {
      _attrs: ['emailConfidence'],
      _name: 'Email Confidence',
      _type: 'MULTI-CHOICES',
      _width: '180px',
      _isHidden: !this.canAccess(['tableColumns', 'emailConfidence']),
      _choices: this._emailConfidenceChoices()
    };
  }

  private _emailConfidenceChoices(){
    return this._professionals.map((_pro) => {
      const _choice = {
        _name: _pro.emailConfidence ? _pro.emailConfidence.toString() : '0',
        _alias: '--'
      };
      if (_pro.emailConfidence >= 90) {
        _choice._alias = 'Good';
        _choice['_class'] = 'label is-success';
      } else if (_pro.emailConfidence >= 80 && _pro.emailConfidence <= 85) {
        _choice._alias = 'Risky';
        _choice['_class'] = 'label is-progress';
      }
      _pro.emailConfidence = _pro.emailConfidence.toString();
      return _choice;
    })
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(
      this.accessPath.concat(path)
    );
  }

  public onConfigChange(value: UmiusConfigInterface) {
    this.configChange.emit(value);
  }

  private _resetSidebarVariables(sidebarToReset: string) {
    switch (sidebarToReset) {
      case 'professional':
        this._isProfessionalSidebar = false;
        return;

      case 'filters':
        this._isFiltersSidebar = false;
        return;

      case 'tags':
        this._isTagsSidebar = false;
        return;
    }
  }

  public onClickEdit(value: Professional) {
    this._resetSidebarVariables('professional')
    this._resetSidebarVariables('tags');
    this._resetSidebarVariables('filters');
    this._professionalsService
      .get(value._id, 'reset')
      .pipe(first())
      .subscribe(
        (response: Professional) => {
          this._selectedProfessional = response;
          this._isProfessionalSidebar = true;
          this._sidebarValue = {
            animate_state: 'active',
            title: this.canAccess(['profile', 'edit'])
              ? 'Edit Professional'
              : 'View Professional',
            type: 'professional',
          };
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public onClickDelete(value: Array<SelectedProfessional>) {
    this._professionalsToRemove = value;
    this._modalDelete = true;
  }

  public onClickConfirm() {
    if (!this._isDeleting) {
      this._isDeleting = true;
      this._professionalsToRemove.forEach((professional, index) => {
        if (this._isCampaignProfessional()) {
          this._removeProfessionalFromCampaign(index, [professional]);
        } else {
          this._removeProfessional(professional._id, index);
        }
      });
    }
  }

  private _removeProfessionalFromCampaign(index: number, pros: any[]) {
    const _campaignId = this.campaign && this.campaign._id;
    const _innovationId =
      this.campaign && this.campaign.innovation && this.campaign.innovation._id;
    const body = {
      queryResult: pros,
    };
    this._professionalsService
      .removeFromCampaign(_campaignId, _innovationId, body)
      .pipe(first())
      .subscribe(
        (result) => {
          if (index === this._professionalsToRemove.length - 1) {
            this._localConfig.limit = '10';
            delete this._localConfig.country;
            this.onConfigChange(this._localConfig);
            this._translateNotificationsService.success(
              'Success',
              'The professional(s) are deleted from the campaign.'
            );
            this._modalDelete = false;
            this._professionalsToRemove = [];
            this._isDeleting = false;
          }
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          if (index === this._professionalsToRemove.length - 1) {
            this._isDeleting = false;
          }
          console.error(err);
        }
      );
  }

  private _removeProfessional(value: string, index: number) {
    this._professionalsService
      .remove(value)
      .pipe(first())
      .subscribe(
        () => {
          if (index === this._professionalsToRemove.length - 1) {
            this.onConfigChange(this._localConfig);
            this._translateNotificationsService.success(
              'Success',
              'The professional(s) are deleted.'
            );
            this._modalDelete = false;
            this._isDeleting = false;
            this._professionalsToRemove = [];
          }
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          if (index === this._professionalsToRemove.length - 1) {
            this._isDeleting = false;
          }
          console.error(err);
        }
      );
  }

  public onClickActions(value: any) {
    switch (value._action) {
      case 'Convert to ambassador':
        if (value._rows.length) {
          if (value._rows.length > 1) {
            this._translateNotificationsService.error(
              'Error',
              'Look, I could do this action just for ' + 'the first one...'
            );
          }
          const link = `/user/admin/community/members/${value._rows[0]._id}`;
          this._router.navigate([link]);
        } else {
          this._translateNotificationsService.error(
            'Error',
            'What? empty rows? How did you do that?'
          );
        }
        break;

      case 'Add tags':
        this._editProfessionalTags(value._rows);
        break;

      case 'Remove':
        this._isShowModal = true;
        this._professionalsToRemove = value._rows;
        break;

      case 'filter by country':
        this._filtersByCountry();
        break;

      case 'Select all':
        this._isSelectAll = value._context;
        this.hideButtonsWhenSelectAll();
        break;

      default:
        this._translateNotificationsService.error(
          'Error',
          'Idk how to do that :('
        );
    }
  }

  private hideButtonsWhenSelectAll() {
    this._table._actions.map((button) => {
      if (button._label !== 'Remove') {
        button._isHidden = this._isSelectAll;
      }
    });
  }

  private _removeAllProfessionalsSelectedFromCampaign() {
    if (this._professionalsToRemove.length > 0) {
      this._removeProfessionalFromCampaign(
        this._professionalsToRemove.length - 1,
        this._professionalsToRemove
      );
    }
  }

  private _filtersByCountry() {
    this._resetSidebarVariables('professional');
    this._resetSidebarVariables('tags');
    this._isFiltersSidebar = true;
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Filter by country',
      type: 'Filter',
      size: '600px',
    };
  }

  private _editProfessionalTags(value: Array<SelectedProfessional>) {
    this._resetSidebarVariables('professional');
    this._resetSidebarVariables('filters');
    this._professionalsToTags = value;
    this._isTagsSidebar = true;
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Add Tags',
      type: 'ADD_TAGS',
    };
  }

  public addProfessionalTags(tags: Array<Tag>) {
    this._professionalsToTags.forEach((value, index) => {
      if (!this._professionalsToTags[index].tags) {
        this._professionalsToTags[index].tags = [];
      }
      tags.forEach((value1) => {
        if (
          !value.tags.find((value2) => {
            return value2._id === value1._id;
          })
        ) {
          this._professionalsToTags[index].tags.push(value1);
        }
      });
    });

    this._professionalsToTags.forEach((value, index) => {
      this.updateProfessional(
        value,
        index,
        this._professionalsToTags.length - 1
      );
    });
  }

  public onSelectRows(value: any) {
    this.selectedProfessionalChange.emit({
      total: value._rows.length,
      pros: value._rows,
    });
  }

  public updateProfessional(
    value: Professional,
    index?: number,
    total?: number
  ) {
    // If company is empty we remove field before saving
    if(value.company && !value.company.domain) {
      delete value.company;
    }
    this._professionalsService
      .save(value._id, value)
      .pipe(first())
      .subscribe(
        () => {
          if (index && total && index === total) {
            this.onConfigChange(this._localConfig);
            this._translateNotificationsService.success(
              'Success',
              'The professionals are updated.'
            );
          } else if (!index && !total) {
            this.onConfigChange(this._localConfig);
            this._translateNotificationsService.success(
              'Success',
              'The professional is updated.'
            );
          }
        },
        (err: HttpErrorResponse) => {
          if (err && err.error.code && err.error.code === 11000) {
            this._translateNotificationsService.error(
              'Error',
              'A professional with that E-mail already exists. ' +
              'Try to manually merge both professionals. For more info, ask the tech team.'
            );
          } else {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorKey(err.error)
            );
          }
          console.error(err);
        }
      );
  }

  private _isSelectable() {
    if (this.accessPath.indexOf('professionals') === -1) {
      return this.canAccess(['user', 'remove']);
    } else {
      return this.canAccess(['user', 'edit']) || this.canAccess(['user', 'delete']);
    }
  }

  closeRemoveProModal() {
    this._isShowModal = false;
  }

  onClickConfirmRemovePros() {
    this._isShowModal = false;
    if (!this._isSelectAll) {
      this._removeAllProfessionalsSelectedFromCampaign();
    } else {
      this._translateNotificationsService.success(
        'Success',
        'We received your request, the process will take a few minutes.'
      );
      const _campaignId = this.campaign && this.campaign._id;
      const _innovationId =
        this.campaign &&
        this.campaign.innovation &&
        this.campaign.innovation._id;
      this._localConfig.limit = '500';
      this._localConfig.offset = '0';
      const body = {
        batchSize: 500,
        total: this.total,
        campaignId: _campaignId,
        query: this._localConfig,
        innovationId: _innovationId,
      };
      this._professionalsService
        .removeAllFromCampaign(_campaignId, _innovationId, body)
        .pipe(first())
        .subscribe(
          (next) => {
            if (next.status === 200) {
              this._translateNotificationsService.success(
                'Success',
                'The professional(s) are deleted from the campaign.'
              );
            }
            if (next.status === 400) {
              this._translateNotificationsService.error(
                'Information',
                'The professional(s) are partially deleted from the campaign.'
              );
            }
            this._isShowModal = false;
            this._table._content = [];
            this._table._total = 0;
            this._localConfig.limit = '10';
          },
          (error) => {
            console.error(error);
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorKey(error.error)
            );
            this._isShowModal = false;
            this._localConfig.limit = '10';
          }
        );
    }
  }

  public onGeographyChange(value: GeographySettings) {
    this._geography = value;
    this._countriesSelected = this._geography.include.map((c) => c.code);
    if (this._countriesSelected.length > 0) {
      if (this._countriesSelected.indexOf('GB') !== -1) {
        this._countriesSelected.push('UK');
      }
      this._localConfig.country = JSON.stringify({
        $in: this._countriesSelected,
      });
    } else {
      delete this._localConfig.country;
    }
    this.configChange.emit(this._localConfig);
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

  get localConfig(): UmiusConfigInterface {
    return this._localConfig;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): UmiusSidebarInterface {
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

  get isShowModal(): boolean {
    return this._isShowModal;
  }

  set isShowModal(value: boolean) {
    this._isShowModal = value;
  }

  get isFiltersSidebar(): boolean {
    return this._isFiltersSidebar;
  }

  get geography(): GeographySettings {
    return this._geography;
  }

  set geography(value: GeographySettings) {
    this._geography = value;
  }
}
