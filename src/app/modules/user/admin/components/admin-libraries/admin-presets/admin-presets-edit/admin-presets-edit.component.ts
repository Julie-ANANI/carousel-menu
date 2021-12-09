import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PresetService } from '../../../../../../../services/preset/preset.service';
import { TranslateNotificationsService } from '../../../../../../../services/translate-notifications/translate-notifications.service';
import { Preset } from '../../../../../../../models/preset';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../../services/error/error-front.service';

@Component({
  selector: 'app-admin-presets-edit',
  templateUrl: './admin-presets-edit.component.html',
})
export class AdminPresetsEditComponent implements OnInit {

  private _preset: Preset = <Preset>{};

  private _toSave = false;

  private _updatedPreset: Preset = <Preset>{};

  private _isSaving = false;

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateNotificationsService: TranslateNotificationsService,
              private _presetService: PresetService) {}

  ngOnInit(): void {
    this._preset = this._activatedRoute.snapshot.data['preset'];
  }

  public savePreset(preset: Preset): void {
    this._updatedPreset = preset;
    this._toSave = true;
  }

  public onSave(event: Event) {
    event.preventDefault();
    this._updatePreset();
  }

  private _updatePreset() {
    if (this._toSave) {
      this._toSave = false;
      this._isSaving = true;

      this._presetService.save(this._preset._id, this._updatedPreset).pipe(first()).subscribe((result: any) => {
        this._isSaving = this._toSave = false;
        this._preset = result;
        this._updatedPreset = <Preset>{};
        this._translateNotificationsService.success('Success', 'ERROR.PRESET.UPDATED');
      }, (err: HttpErrorResponse) => {
        this._toSave = true;
        this._isSaving = false;
        this._translateNotificationsService.error('Oups...', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  get preset() {
    return this._preset;
  }

  get toSave(): boolean {
    return this._toSave;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

}
