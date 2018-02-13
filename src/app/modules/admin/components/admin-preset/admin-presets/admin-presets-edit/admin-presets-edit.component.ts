import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { Preset } from '../../../../../../models/preset';
import { Section } from '../../../../../../models/section';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-admin-presets-edit',
  templateUrl: './admin-presets-edit.component.html',
  styleUrls: ['./admin-presets-edit.component.scss']
})
export class AdminPresetsEditComponent implements OnInit {

  private _preset: Preset;
  public formData: FormGroup;
  private _addSectionConfig: {
    placeholder: string,
    canOrder: boolean,
    initialData: Array<Section>,
    type: string
  } = {
    placeholder: 'PRESETS.PRESET.EDIT.SECTION_PLACEHOLDER',
    canOrder: true,
    initialData: [],
    type: 'sections'
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _presetService: PresetService,
              private _authService: AuthService,
              private _translateService: TranslateService,
              private _notificationsService: TranslateNotificationsService,
              private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      const presetId = params['presetId'];
      this._presetService.get(presetId)
        .first()
        .subscribe(preset => {
          this._preset = preset;
          this._addSectionConfig.initialData = preset.sections || [];
          this.formData = this._formBuilder.group({
            sections: []
          });
      });
    });
  }

  /**
   * Sauvegarde
   * @param callback
   */
  public save() {
    this._presetService
      .save(this._preset._id, this.formData.value)
      .first()
      .subscribe(data => {
        this._preset = data;
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.PRESET.UPDATED');
      }, err => {
        this._notificationsService.error('ERROR.PRESET.UNFORBIDDEN', err);
      });
  }

  public addSection(event: any): void {
    this.formData.get('sections').setValue(event.value);
  }

  get addSectionConfig() { return this._addSectionConfig; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get preset() { return this._preset; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
