import { Component } from '@angular/core';
import { PresetService } from '../../../../../../../services/preset/preset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Preset } from '../../../../../../../models/preset';
import { first } from 'rxjs/operators';
import { Config } from '../../../../../../../models/config';
import { TranslateTitleService } from '../../../../../../../services/title/title.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { Table } from '../../../../../../table/models/table';
import { Response } from '../../../../../../../models/response';

@Component({
  selector: 'app-admin-presets-list',
  templateUrl: './admin-presets-list.component.html',
  styleUrls: ['./admin-presets-list.component.scss']
})

export class AdminPresetsListComponent {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  private _fetchingError: boolean;

  private _total: number;

  private _modalOpen: boolean;

  private _isModalAdd: boolean;

  private _modalTitle: string;

  private _newPresetName: string;

  private _presets: Array<Preset> = [];

  private _table: Table;

  private _isModalDelete: boolean;

  private _presetsToRemove: Array<Preset> = [];

  private _isModalClone: boolean;

  private _isModalCloneAdd: boolean;

  private _presetToClone: Preset;

  constructor(private _presetService: PresetService,
              private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _translateNotificationsService: TranslateNotificationsService,
              private _router: Router) {

    this._translateTitleService.setTitle('Questionnaires | Libraries');

    if (this._activatedRoute.snapshot.data.presets && Array.isArray(this._activatedRoute.snapshot.data.presets.result)) {
       this._presets = this._activatedRoute.snapshot.data.presets.result;
       this._total = this._activatedRoute.snapshot.data.presets._metadata.totalCount;
       this._initializeTable();
    } else {
      this._fetchingError = true;
    }

  }

  private _getPresets() {
    this._presetService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._presets = response.result;
      this._total = response._metadata.totalCount;
      this._initializeTable();
    });
  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-presets-limit',
      _title: 'preset(s)',
      _content: this._presets,
      _total: this._total,
      _isSearchable: true,
      _isDeletable: true,
      _isSelectable: true,
      _isPaginable: true,
      _isTitle: true,
      _editIndex: 1,
      _buttons: [{ _icon: 'fas fa-clone', _label: 'Clone' }],
      _columns: [
        {_attrs: ['name'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['sections'], _name: 'TABLE.HEADING.SECTIONS', _type: 'LENGTH', _isSortable: true},
        {_attrs: ['domain'], _name: 'TABLE.HEADING.DOMAIN', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['updated'], _name: 'TABLE.HEADING.UPDATED', _type: 'DATE', _isSortable: true},
        {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true}
      ]
    };
  }

  private _resetModalVariables() {
    this._isModalAdd = false;
    this._isModalDelete = false;
    this._isModalClone = false;
    this._isModalCloneAdd = false;
  }

  public onClickAdd() {
    this._resetModalVariables();
    this._modalTitle = 'COMMON.MODAL.TITLE_CREATE';
    this._newPresetName = '';
    this._isModalAdd = true;
    this._modalOpen = true;
  }

  public onAddConfirm() {
    const newPreset: Preset = {
      name: this._newPresetName,
      sections: []
    };
    this._createPreset(newPreset, true, 'PRESETS.ADDED');
  }

  private _createPreset(preset: Preset, navigate: boolean, message: string) {
    this._presetService.create(preset).pipe(first()).subscribe((response: Preset) => {
      this._translateNotificationsService.success('ERROR.SUCCESS', message);

      if (navigate) {
        this._router.navigate(['/user/admin/libraries/questionnaire/' + response._id]);
      } else {
        this._getPresets();
        this._modalOpen = false;
      }

    }, () => {
      this._checkPresetAlready();
    });
  }

  private _checkPresetAlready() {
    if (this._presets.length > 0 && this._newPresetName && this._presets.find((preset) => preset.name === this._newPresetName)) {
      this._translateNotificationsService.error('ERROR.ERROR', 'PRESETS.ALREADY_EXIST');
    } else {
      this._modalOpen = false;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    }
  }

  public showPreset(value: Preset) {
    this._router.navigate(['/user/admin/libraries/questionnaire/' + value._id]);
  }

  public OnClickDelete(values: Array<Preset>) {
    this._presetsToRemove = values;
    this._resetModalVariables();
    this._modalTitle = 'COMMON.MODAL.TITLE_DELETE';
    this._isModalDelete = true;
    this._modalOpen = true;
  }

  public onDeleteConfirm() {

    this._presetsToRemove.forEach((preset) => {
      this._presetService.remove(preset._id).pipe(first()).subscribe(() => {
        this._getPresets();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'PRESETS.DELETED');
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
      })
    });

    this._modalOpen = false;

  }

  public onClickActions(value: any) {
    if (value._action === 'Clone') {
      if (value._rows.length === 1) {
        this._resetModalVariables();
        this._presetToClone = value._rows[0];
        this._modalTitle = 'COMMON.MODAL.TITLE_CONFIRMATION';
        this._isModalClone = true;
        this._modalOpen = true;
      } else {
        this._translateNotificationsService.error('ERROR.ERROR', 'PRESETS.NO_MULTIPLE_CLONE');
      }

    }
  }

  public onCloneConfirm() {
    this._resetModalVariables();
    delete this._presetToClone._id;
    this._newPresetName =  this._presetToClone.name;
    this._modalTitle = 'COMMON.MODAL.TITLE_CREATE';
    this._isModalCloneAdd = true;
    this._modalOpen = true;
  }

  public onClickCloneAdd() {
    this._presetToClone.name = this._newPresetName;
    this._createPreset(this._presetToClone, false, 'PRESETS.CLONED');
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

}
