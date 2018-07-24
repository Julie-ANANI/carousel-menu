import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../../services/auth/auth.service';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-admin-presets-edit',
  templateUrl: './admin-presets-edit.component.html',
  styleUrls: ['./admin-presets-edit.component.scss']
})
export class AdminPresetsEditComponent implements OnInit {

  private _state: Array<any> = [];
  private _preset: any;


  constructor(private _activatedRoute: ActivatedRoute,
             // private _presetService: PresetService,
              private _authService: AuthService,
              private _translateService: TranslateService) {}

  ngOnInit() {
   this._preset = this._activatedRoute.snapshot.data['preset'];
   console.log(this._preset);
   this._preset.sections.forEach( (sec: any) => {
     const tab: Array<any> = [];
     sec.questions.forEach(( q: any) => {
        tab.push(false);
     });
     this._state.push({
       sec: false,
       quest: tab
     });
   });
  }

  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get preset() { return this._preset; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
