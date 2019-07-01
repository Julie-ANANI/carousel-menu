import { Component } from '@angular/core';
import { PresetService } from '../../../../../../../services/preset/preset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Preset } from '../../../../../../../models/preset';
import { Pagination } from '../../../../../../utility-components/paginations/interfaces/pagination';
import { first } from 'rxjs/operators';
import { Config } from '../../../../../../../models/config';
import { TranslateTitleService } from '../../../../../../../services/title/title.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { Section } from '../../../../../../../models/section';
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


  selectedPresetIdToBeDeleted: string = null;

  selectedPresetToBeCloned: Preset = null;

  private _modalDelete = false;

  private _modalClone = false;

  private _paginationConfig: any = {limit: this._config.limit, offset: this._config.offset};

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
      _columns: [
        {_attrs: ['name'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['sections'], _name: 'TABLE.HEADING.SECTIONS', _type: 'LENGTH', _isSortable: true},
        {_attrs: ['domain'], _name: 'TABLE.HEADING.DOMAIN', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['updated'], _name: 'TABLE.HEADING.UPDATED', _type: 'DATE', _isSortable: true},
        {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true}
      ]
    };
  }

  public onClickAdd() {
    this._resetModalVariables();
    this._modalTitle = 'COMMON.MODAL.TITLE_CREATE';
    this._newPresetName = '';
    this._isModalAdd = true;
    this._modalOpen = true;
  }

  private _resetModalVariables() {
    this._isModalAdd = false;
  }

  public onAddConfirm() {

    const newPreset: { name: string; sections: Array<Section> } = {
      name: this._newPresetName,
      sections: []
    };

    this._presetService.create(newPreset).pipe(first()).subscribe((response: Preset) => {
      this._router.navigate(['/user/admin/libraries/questionnaire/' + response._id]);
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
    console.log(values);
  }

  loadPresets(config: any): void {
    this._config = config;
    this._presetService.getAll(this._config)
      .pipe(first())
      .subscribe((presets: any) => {
        this._presets = presets.result;
        this._total = presets._metadata.totalCount;
      });
  }

  configChange(value: any) {
    this._paginationConfig = value;
    this._config.limit = value.limit;
    this._config.offset = value.offset;
    window.scroll(0, 0);
    this.loadPresets(this._config);
  }

  onClickDelete() {
    this._modalDelete = true;
  }

  onClickClone() {
    this._modalClone = true;
  }

  private _getPresetIndex(presetId: string): number {
    for (const preset of this._presets) {
      if (presetId === preset._id) {
        return this._presets.indexOf(preset);
      }
    }
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removePreset(event: Event, presetId: string) {
    event.preventDefault();
    this._presetService
      .remove(presetId)
      .pipe(first())
      .subscribe((_: any) => {
        this._presets.splice(this._getPresetIndex(presetId), 1);
        this.selectedPresetIdToBeDeleted = null;
        this._modalDelete = false;
      });
  }

  public clonePreset(event: Event, clonedPreset: Preset) {
    event.preventDefault();
    delete clonedPreset._id;
    this._presetService.create(clonedPreset).pipe(first()).subscribe((preset: any) => {
      this._router.navigate(['/user/admin/libraries/questionnaire/' + preset._id])
    });
  }

  get sortConfig(): string {
    return this._config.sort;
  }

  set sortConfig(value: string) {
    this._config.sort = value;
    this.loadPresets(this._config);
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

  get paginationConfig(): Pagination { return this._paginationConfig; }

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
  }

  get modalClone(): boolean {
    return this._modalClone;
  }

  set modalClone(value: boolean) {
    this._modalClone = value;
  }

}
