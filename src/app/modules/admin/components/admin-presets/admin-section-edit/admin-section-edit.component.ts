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
  selector: 'app-admin-section-edit',
  templateUrl: './admin-section-edit.component.html',
  styleUrls: ['./admin-section-edit.component.scss']
})
export class AdminSectionEditComponent implements OnInit, OnDestroy {

  private _section: any;
  public formData: FormGroup;

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
      const sectionId = params['sectionId'];
      const subs = this._presetService.getSection(sectionId).subscribe(section => {
        this._section = section;
        this.formData = this._formBuilder.group({
          title: this._formBuilder.group({
            fr: [section.title ? section.title.fr || '' : '', Validators.required],
            en: [section.title ? section.title.en || '' : '', Validators.required]
          })
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
      .saveSection(this._section.id, this.formData.value)
      .subscribe(data => {
        this._section = data;
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.SECTION.UPDATED');
      }, err => {
        this._notificationsService.error('ERROR.SECTION.UNFORBIDDEN', err);
      });
  }

  get domSanitizer() { return this._domSanitizer; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get section(): any { return this._section; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
