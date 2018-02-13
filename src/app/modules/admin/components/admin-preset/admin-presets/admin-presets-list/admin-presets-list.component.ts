import { Component, OnInit } from '@angular/core';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { Router } from '@angular/router';
import { Preset } from '../../../../../../models/preset';

@Component({
  selector: 'app-admin-presets-list',
  templateUrl: './admin-presets-list.component.html',
  styleUrls: ['./admin-presets-list.component.scss']
})
export class AdminPresetsListComponent implements OnInit {

  private _presets: Array<Preset>;
  public selectedPresetIdToBeDeleted: string = null;
  public selectedPresetToBeCloned: Preset = null;
  private _total: number;
  private _config = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private _presetService: PresetService,
              private _router: Router) {}

  ngOnInit(): void {
    this.loadPresets(this._config);
  }

  loadPresets(config: any): void {
    this._config = config;
    this._presetService.getAll(this._config)
      .first()
      .subscribe(presets => {
        this._presets = presets.result;
        this._total = presets._metadata.totalCount;
      });
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
  public removePreset(presetId: string) {
    this._presetService
      .remove(presetId)
      .first()
      .subscribe(_ => {
        this._presets.splice(this._getPresetIndex(presetId), 1);
        this.selectedPresetIdToBeDeleted = null;
      });
  }

  public clonePreset(clonedPreset: Preset) {
    delete clonedPreset._id;
    this._presetService.create(clonedPreset).first().subscribe(preset => {
      this._router.navigate(['/admin/presets/' + preset._id])
    });
  }

  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total () { return this._total; }
  get presets () { return this._presets; }
}
