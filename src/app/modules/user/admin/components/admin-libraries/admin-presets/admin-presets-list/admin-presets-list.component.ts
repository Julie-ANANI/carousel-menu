import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PresetService } from '../../../../../../../services/preset/preset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Preset } from '../../../../../../../models/preset';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { Table, Config } from '@umius/umi-common-component/models';
import { Response } from '../../../../../../../models/response';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../../services/error/error-front.service';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';

@Component({
  templateUrl: './admin-presets-list.component.html',
  styleUrls: ['./admin-presets-list.component.scss']
})

export class AdminPresetsListComponent implements OnInit {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  private _fetchingError = false;

  private _total = -1;

  private _modalOpen = false;

  private _isModalAdd = false;

  private _modalTitle = '';

  private _newPresetName = '';

  private _presets: Array<Preset> = [];

  private _table: Table = <Table>{};

  private _isModalDelete = false;

  private _presetsToRemove: Array<Preset> = [];

  private _isModalClone = false;

  private _isModalCloneAdd = false;

  private _presetToClone: Preset = <Preset>{};

  private _noResult = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _presetService: PresetService,
              private _activatedRoute: ActivatedRoute,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _router: Router) { }

  ngOnInit(): void {
    this._initializeTable();

    if (isPlatformBrowser(this._platformId)) {
      if (this._activatedRoute.snapshot.data.presets
        && Array.isArray(this._activatedRoute.snapshot.data.presets.result)) {
        this._initPresets(this._activatedRoute.snapshot.data.presets);
      } else {
        this._fetchingError = true;
      }
    }

  }

  private _initPresets(response: Response) {
    this._presets = response.result;
    this._total = response._metadata.totalCount;
    this._noResult = this._config.search.length > 2 ? false : this._total === 0;
    this._initializeTable();
  }

  private _getPresets() {
    this._presetService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._initPresets(response);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-presets-limit',
      _title: 'preset(s)',
      _content: this._presets,
      _total: this._total,
      _isSearchable: !!this.canAccess(['searchBy']),
      _isDeletable: this.canAccess(['delete']),
      _isSelectable: this.canAccess(['delete']) || this.canAccess(['clone']),
      _isPaginable: true,
      _isTitle: true,
      _clickIndex: this.canAccess(['edit']) || this.canAccess(['view']) ? 1 : null,
      _isNoMinHeight: this._total < 11,
      _buttons: [{ _icon: 'fas fa-clone', _label: 'Clone', _isHidden: !this.canAccess(['clone']) }],
      _columns: [
        {
          _attrs: ['name'],
          _name: 'Name',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'name']),
          _isSortable: true
        },
        { _attrs: ['sections'], _name: 'Sections', _type: 'LENGTH', _isSortable: true },
        {
          _attrs: ['domain'],
          _name: 'Domain',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'domain']),
          _isSortable: true
        },
        { _attrs: ['updated'], _name: 'updated', _type: 'DATE', _isSortable: true },
        { _attrs: ['created'], _name: 'Created', _type: 'DATE', _isSortable: true }
      ]
    };
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['libraries', 'questionnaire'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['libraries', 'questionnaire']);
    }
  }

  private _resetModalVariables() {
    this._isModalAdd = false;
    this._isModalDelete = false;
    this._isModalClone = false;
    this._isModalCloneAdd = false;
  }

  public onClickAdd() {
    this._resetModalVariables();
    this._modalTitle = 'Addition Board';
    this._newPresetName = '';
    this._isModalAdd = true;
    this._modalOpen = true;
  }

  public onAddConfirm() {
    const newPreset: Preset = {
      name: this._newPresetName,
      sections: []
    };
    this._createPreset(newPreset, true, 'The preset is added.');
  }

  private _createPreset(preset: Preset, navigate: boolean, message: string) {
    this._presetService.create(preset).pipe(first()).subscribe((response: Preset) => {
      this._translateNotificationsService.success('Success', message);
      if (navigate) {
        this._router.navigate(['/user/admin/libraries/questionnaire/' + response._id]);
      } else {
        this._getPresets();
        this._modalOpen = false;
      }
    }, (err: HttpErrorResponse) => {
      this._checkPresetAlready(err);
    });
  }

  private _checkPresetAlready(err: HttpErrorResponse) {
    if (this._presets.length > 0 && this._newPresetName && this._presets.find((preset) =>
      preset.name === this._newPresetName)) {
      this._translateNotificationsService.error('Error', 'The preset with the same name already exists.');
    } else {
      this._modalOpen = false;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    }
  }

  public showPreset(value: Preset) {
    this._router.navigate(['/user/admin/libraries/questionnaire/' + value._id]);
  }

  public OnClickDelete(values: Array<Preset>) {
    this._presetsToRemove = values;
    this._resetModalVariables();
    this._modalTitle = 'Delete Board';
    this._isModalDelete = true;
    this._modalOpen = true;
  }

  public onDeleteConfirm() {
    this._presetsToRemove.forEach((preset, index) => {
      this._presetService.remove(preset._id).pipe(first()).subscribe(() => {
        this._translateNotificationsService.success('Success', 'The preset is deleted.');
        if (index === this._presetsToRemove.length - 1) {
          this._getPresets();
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    });
    this._modalOpen = false;
  }

  public onClickActions(value: any) {
    if (value._action === 'Clone') {
      if (value._rows.length === 1) {
        this._resetModalVariables();
        this._presetToClone = value._rows[0];
        this._modalTitle = 'Clone Board';
        this._isModalClone = true;
        this._modalOpen = true;
      } else {
        this._translateNotificationsService.error('Error',
          'This functionality is not available on multiple presets.');
      }
    }
  }

  public onCloneConfirm() {
    this._resetModalVariables();
    delete this._presetToClone._id;
    this._newPresetName =  this._presetToClone.name;
    this._modalTitle = 'Addition Board';
    this._isModalCloneAdd = true;
    this._modalOpen = true;
  }

  public onClickCloneAdd() {
    this._presetToClone.name = this._newPresetName;
    this._createPreset(this._presetToClone, false, 'The preset is cloned.');
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this._getPresets();
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get total(): number {
    return this._total;
  }

  get modalOpen(): boolean {
    return this._modalOpen;
  }

  set modalOpen(value: boolean) {
    this._modalOpen = value;
  }

  get isModalAdd(): boolean {
    return this._isModalAdd;
  }

  get modalTitle(): string {
    return this._modalTitle;
  }

  get newPresetName(): string {
    return this._newPresetName;
  }

  set newPresetName(value: string) {
    this._newPresetName = value;
  }

  get presets(): Array<Preset> {
    return this._presets;
  }

  get table(): Table {
    return this._table;
  }

  get isModalDelete(): boolean {
    return this._isModalDelete;
  }

  get presetsToRemove(): Array<Preset> {
    return this._presetsToRemove;
  }

  get isModalClone(): boolean {
    return this._isModalClone;
  }

  get isModalCloneAdd(): boolean {
    return this._isModalCloneAdd;
  }

  get presetToClone(): Preset {
    return this._presetToClone;
  }

  get noResult(): boolean {
    return this._noResult;
  }

}
