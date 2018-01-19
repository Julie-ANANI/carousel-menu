import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';
import {PresetService} from '../../../../../services/preset/preset.service';
import {AuthService} from '../../../../../services/auth/auth.service';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-admin-preset-edit',
  templateUrl: './admin-preset-edit.component.html',
  styleUrls: ['./admin-preset-edit.component.scss']
})
export class AdminPresetEditComponent implements OnInit, OnDestroy {

  private _preset: any;
  public formData: FormGroup;
  private _addSectionConfig = {
    placeholder: 'PRESETS.PRESET.EDIT.SECTION_PLACEHOLDER',
    initialData: [],
    type: 'sections'
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _presetService: PresetService,
              private _authService: AuthService,
              private _domSanitizer: DomSanitizer,
              private _translateService: TranslateService,
              private _router: Router,
              private _notificationsService: TranslateNotificationsService,
              private _formBuilder: FormBuilder) {}

  ngOnInit() {
    const subs = this._activatedRoute.params.subscribe(params => {
      const presetId = params['presetId'];
      const subs = this._presetService.get(presetId).subscribe(preset => {
        this._preset = preset;
        this._addSectionConfig.initialData = preset.sections || [];
        this.formData = this._formBuilder.group({
          sections: []
        });
      });
    });
  }

  ngOnDestroy() {
  }

  /**
   * Sauvegarde
   * @param callback
   */
  public save() {
    const saveSubs = this._presetService
      .save(this._preset.id, this.formData.value)
      .subscribe(data => {
        this._preset = data;
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.PRESET.UPDATED');
      }, err => {
        this._notificationsService.error('ERROR.PRESET.UNFORBIDDEN', err);
      });
  }
  
  public addSection(event): void {
    this.formData.get('sections').setValue(event.value);
  }

  get addSectionConfig() { return this._addSectionConfig; }
  get domSanitizer() { return this._domSanitizer; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get preset(): any { return this._preset; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
