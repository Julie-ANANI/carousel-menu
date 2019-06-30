import { Component, OnInit } from '@angular/core';
import { PresetService } from '../../../../../../../services/preset/preset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Preset } from '../../../../../../../models/preset';
import { Pagination } from '../../../../../../utility-components/paginations/interfaces/pagination';
import { first } from 'rxjs/operators';
import { Config } from '../../../../../../../models/config';
import { TranslateTitleService } from '../../../../../../../services/title/title.service';

@Component({
  selector: 'app-admin-presets-list',
  templateUrl: './admin-presets-list.component.html',
  styleUrls: ['./admin-presets-list.component.scss']
})

export class AdminPresetsListComponent implements OnInit {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _presets: Array<Preset>;

  selectedPresetIdToBeDeleted: string = null;

  selectedPresetToBeCloned: Preset = null;

  private _total: number;

  private _modalDelete = false;

  private _modalClone = false;

  private _paginationConfig: any = {limit: this._config.limit, offset: this._config.offset};

  constructor(private _presetService: PresetService,
              private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router) {

    this._translateTitleService.setTitle('Questionnaires | Libraries');

    if (this._activatedRoute.snapshot.data.presets && Array.isArray(this._activatedRoute.snapshot.data.presets.result)) {
      // this._signatures = this._activatedRoute.snapshot.data.signatures.result;
      // this._total = this._activatedRoute.snapshot.data.signatures._metadata.totalCount;
      // this._initializeTable();
    } else {
      //this._fetchingError = true;
    }

  }

  ngOnInit(): void {
    this.loadPresets(this._config);
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


  set config(value: Config) {
    this._config = value;
  }

  get config(): Config {
    return this._config;
  }

  get total () { return this._total; }

  get paginationConfig(): Pagination { return this._paginationConfig; }

  get presets () { return this._presets; }

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
