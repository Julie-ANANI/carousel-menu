import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PresetService } from '../../../../../../../services/preset/preset.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { Preset } from '../../../../../../../models/preset';

@Component({
  selector: 'app-admin-presets-edit',
  templateUrl: './admin-presets-edit.component.html',
  styleUrls: ['./admin-presets-edit.component.scss']
})
export class AdminPresetsEditComponent implements OnInit {

  private _preset: Preset;

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationService: TranslateNotificationsService,
              private _presetService: PresetService) {}

  ngOnInit(): void {
    this._preset = this._activatedRoute.snapshot.data['preset'];
  }

  public savePreset(preset: Preset): void {
    this._presetService.save(this._preset._id, preset).subscribe((result: any) => {
      this._notificationService.success('ERROR.SUCCESS', 'ERROR.PRESET.UPDATED');
      this._preset = result;
    });
  }

  get preset() { return this._preset; }
}
