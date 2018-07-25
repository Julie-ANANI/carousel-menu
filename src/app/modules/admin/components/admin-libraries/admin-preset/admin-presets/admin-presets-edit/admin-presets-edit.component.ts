import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../../../services/auth/auth.service';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import {PresetService} from '../../../../../../../services/preset/preset.service';

@Component({
  selector: 'app-admin-presets-edit',
  templateUrl: './admin-presets-edit.component.html',
  styleUrls: ['./admin-presets-edit.component.scss']
})
export class AdminPresetsEditComponent implements OnInit {

  private _state: Array<any> = [];
  private _preset: any;


  constructor(private _activatedRoute: ActivatedRoute,
              private _presetService: PresetService,
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

  public updateState(event: any, index: number) {
    this._state[index] = event;
  }

  public sectionUpdated(event: any, index: number) {
    this._preset.sections[index] = event;
    this._save();
  }


  public addQuestion(event: any, index: number) {
    this._state[index].quest.push(false);
    this._preset.sections[index].questions.push(event);
    this._save();
  }

  public addSection() {
    let name;
    if (this._preset && this._preset.sections) {
      name = 'Section' + this._preset.sections.length;
    } else {
      name = 'Section';
    }
    this._preset.sections.push({
      name: name,
      questions: [],
      label: {
        en: name,
        fr: name
      }
    });
    this._state.push({
      sec: false,
      quest: []
    });
    this._save();
  }

  public sectionRemoved(event: any, index: number) {
    this._preset.sections.splice(index, 1);
    this._save();
  }

  public getState(index: number) {
    return this._state[index];
  }



  public moveSection(event: any, index: number) {
    let k;
    if (event === 'down') {
      k = 1;
    } else {
      k = - 1;
    }
    if (index + k === this._preset.sections.length || index + k === 0) {
      console.log("Je ne peux pas faire ça");
    } else {
      const tempSec = JSON.parse(JSON.stringify(this._preset.sections[index]));
      this._preset.sections[index] = JSON.parse(JSON.stringify(this._preset.sections[index + k]));
      this._preset.sections[index + k] = tempSec;
      const tempState = JSON.parse(JSON.stringify(this._state[index]));
      this._state[index] = JSON.parse(JSON.stringify(this._state[index + k]));
      this._state[index + k] = tempState;
      this._save();
    }

  }

  public canimove($event: any, index: number) {
    const indexques = $event[0];
    const moove = $event[1];
    if (moove === 'up' && index !== 0) {
      const tempSec = this._preset.sections[index].questions[indexques];
      this._preset.sections[index].questions.splice(indexques, 1);
      this._preset.sections[index - 1].questions.push(tempSec);
      const tempState = this._state[index].quest[indexques];
      this._state[index].quest.splice(indexques, 1);
      this._state[index - 1].quest.push(tempState);
      this._save();
    }
    if (moove === 'down' && index !== (this._preset.sections.length - 1)) {
      const tempSec = this._preset.sections[index].questions[indexques];
      this._preset.sections[index].questions.splice(indexques, 1);
      this._preset.sections[index + 1].questions.splice(0, 0, tempSec);
      const tempState = this._state[index].quest[indexques];
      this._state[index].quest.splice(indexques, 1);
      this._state[index + 1].quest.splice(0, 0, tempState);
      this._save();
    }
  }



  private _save() {

    this._presetService.save(this._preset._id, this._preset).first().subscribe( result => {
      this._preset = result;
    });

  }


  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get preset() { return this._preset; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
