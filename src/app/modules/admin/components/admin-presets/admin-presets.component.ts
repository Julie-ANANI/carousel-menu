import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { PresetService } from '../../../../services/preset/preset.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-presets',
  templateUrl: './admin-presets.component.html',
  styleUrls: ['./admin-presets.component.scss']
})
export class AdminPresetsComponent implements OnInit {

  private _presets: [any];
  public selectedPresetIdToBeDeleted: any = null;
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
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('COMMON.PRESETS');
    this.loadPresets(this._config);
  }

  loadPresets(config: any): void {
    this._config = config;
    this._presetService.getAll(this._config).subscribe(presets => {
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
  public removePreset(presetId) {
    this._presetService
      .remove(presetId)
      .subscribe(presetRemoved => {
        this._presets.splice(this._getPresetIndex(presetId), 1);
        this.selectedPresetIdToBeDeleted = null;
      });
  }

  set config(value: any) {
    this._config = value;
  }

  get config(): any {
    return this._config;
  }

  get total () {
    return this._total;
  }

  get presets () {
    return this._presets;
  }
}
