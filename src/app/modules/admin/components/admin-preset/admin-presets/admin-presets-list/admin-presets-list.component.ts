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
  public editionMode = false;
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

  private _newPreset: any = {
    name: '',
    sections: []
  };
  public nameCreated = false;
  private _state: Array<any> = [];



  // MODALS
  public modalquestionnaire = false;
  public errorquestionnaire = false;

  public modalsection = false;
  public errorsection = false;


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






  public goToEditionMode() {
    this.modalquestionnaire = true;
    this.editionMode = !this.editionMode;
  }

  public goToListMode() {
    this.editionMode = !this.editionMode;
  }

  public createPreset(event: any) {
    this._presetService.create(this._newPreset).first().subscribe( (preset) => {
      console.log('OK questionnaire');
      this.nameCreated = true;
      console.log(preset);
      this._newPreset = preset;
      this.errorquestionnaire = false;
      this.modalquestionnaire = false;
    }, (error) => {
      console.log('error:')
      console.log(error);
      error = JSON.parse(error);
      this.errorquestionnaire = true;
    });
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

  public addQuestion(event: any, index: number){
    this._presetService.createQuestion(event).first().subscribe((result ) => {
      console.log("question added");
      console.log(result);
      this._state[index].quest.push(false);
      this._newPreset.sections[index].questions.push(result);
      this._presetService.saveSection(this._newPreset.sections[index]._id, this._newPreset.sections[index]).first().subscribe(sec => {
        this._newPreset.sections[index].__v = sec.__v;
        console.log('section updated')
        console.log(sec);
      })
    });
  }



  public sectionUpdated(event: any, index: number) {
    this._newPreset.sections[index] = event;
    this._presetService.saveSection(this._newPreset.sections[index]._id, this._newPreset.sections[index]).first().subscribe( result => {
      this._newPreset.sections[index] = result;
    });
  }

  public linkeditionMode(preset: any) {
    this._presetService.populatePreset(preset._id).first().subscribe(result => {
      this._newPreset = result;
      this._newPreset.sections.forEach( (sec: any) => {
        const tab: Array<boolean> = [];
        sec.questions.forEach((quest: any) => {
          tab.push(false);
        });
        this._state.push({
          sec: false,
          quest: tab
        })
      });
      this.editionMode = true;
      this.nameCreated = true ;
    });
  }

  public updateState(event: any, index: number) {
    this._state[index] = event;
  }

  public sectionRemoved(event: any, index: number) {
    const ID = this._newPreset.sections[index]._id;
    this._newPreset.sections.splice(index, 1);
    this._presetService.save(this._newPreset._id, this._newPreset).first().subscribe( result => {
      this._newPreset.__v = result.__v;
      this._presetService.removeSection(ID).first().subscribe(res => {

        console.log('supprimé')
      })
    });
  }

  private _findQuestionIndex(question: any, i: number): number {
    let k = 0;
    for (const q of this._newPreset.sections[i].questions) {
      if (q.identifier === question.identifier) {
        return k;
      }
      k++;
    }
    return k;
  }

  public questionUpdated(event: any, index: number) {
    console.log('kikoou');
    console.log(this._newPreset.sections[index].questions[this._findQuestionIndex(event, index)]);
    this._presetService.saveQuestion(event._id, event).first().subscribe(result => {
      console.log('hello u')
      console.log(result);
      this._newPreset.sections[index].questions[this._findQuestionIndex(result, index)] = result;
    });
  }

  public removeQuestion(event: any, index: number) {
    this._presetService.removeQuestion(event._id).first().subscribe(result => {
      console.log('supprimé');
    })
  }

  public getState(index: number) {
    return this._state[index];
  }

  get newPreset(): any {
    return this._newPreset;
  }

  public addSection(event: any) {
    console.log('event :');
    console.log(event);
    const name = event.target.value;
    const sec: {
      name: string,
      questions: Array<any>,
      label: {
        en: string,
        fr: string
      }
    } =  {
      name: name,
      questions: [],
      label: {
        en: name,
        fr: name
      }
    };
    this._presetService.createSection(sec).first().subscribe( result => {
      console.log('Section crée');
      this._newPreset.sections.push(result);
      this._state.push({
        sec: false,
        quest: []
      });
      this._presetService.save(this._newPreset._id, this._newPreset).first().subscribe(pres => {
        console.log('Preset save, la section est dedans');
        this.modalsection = false;
        this.errorsection = false;
        this._newPreset.__v = pres.__v;
      });
    }, error => {
      this.errorsection = true;
      console.log(error);
    });
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
  }



  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total () { return this._total; }
  get presets () { return this._presets; }
}
