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
  public removePreset(event: Event, presetId: string) {
    event.preventDefault();
    this._presetService
      .remove(presetId)
      .first()
      .subscribe(_ => {
        this._presets.splice(this._getPresetIndex(presetId), 1);
        this.selectedPresetIdToBeDeleted = null;
      });
  }

  public clonePreset(event: Event, clonedPreset: Preset) {
    event.preventDefault();
    delete clonedPreset._id;
    this._presetService.create(clonedPreset).first().subscribe(preset => {
      this._router.navigate(['/admin/presets/presets/' + preset._id])
    });
  }




/*

  public goToEditionMode() {
    this.modalquestionnaire = true;
    this.editionMode = !this.editionMode;
  }

  public goToListMode() {
    this.editionMode = !this.editionMode;
  }



  public indexSection(sec: any) {
    let k = 0;
    for (const section of this._newPreset.sections) {
      if (section.name === sec.name) {
        return k;
      }
      k++;
    }
  }





  public moveSection(event: any, index: number) {
    console.log(this._newPreset);
    if (event === 'down') {
      if (index + 1 === this._newPreset.sections.length) {
        console.log('on ne peut pas descendre plus');
      } else {
        const tempSec = JSON.parse(JSON.stringify(this._newPreset.sections[index]));
        this._newPreset.sections[index] = JSON.parse(JSON.stringify(this._newPreset.sections[index + 1]));
        this._newPreset.sections[index + 1] = tempSec;
        const tempState = JSON.parse(JSON.stringify(this._state[index]));
        this._state[index] = JSON.parse(JSON.stringify(this._state[index + 1]));
        this._state[index + 1] = tempState;
        this._presetService.save(this._newPreset._id, this._newPreset).first().subscribe( result => {
          this._newPreset.__v = result.__v;
          console.log(result);
        });
      }
    }
    if (event === 'up') {
      if (index === 0) {
        console.log('on ne peut pas monter plus');
      } else {

        const tempSec = JSON.parse(JSON.stringify(this._newPreset.sections[index]));
        this._newPreset.sections[index] = JSON.parse(JSON.stringify(this._newPreset.sections[index - 1]));
        this._newPreset.sections[index - 1] = tempSec;
        const tempState = JSON.parse(JSON.stringify(this._state[index]));
        this._state[index] = JSON.parse(JSON.stringify(this._state[index - 1]));
        this._state[index - 1] = tempState;

        this._presetService.save(this._newPreset._id, this._newPreset).first().subscribe( result => {
          this._newPreset.__v = result.__v;
          console.log(result);
        });
      }
    }
  }*/



  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total () { return this._total; }
  get presets () { return this._presets; }
}
