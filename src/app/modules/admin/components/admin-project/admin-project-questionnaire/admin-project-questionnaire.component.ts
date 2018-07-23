import { Component, OnInit } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';
// import {Section} from '../../../../../models/section';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
// import {InnovationService} from '../../../../../services/innovation/innovation.service';

@Component({
  selector: 'app-admin-project-questionnaire',
  templateUrl: './admin-project-questionnaire.component.html',
  styleUrls: ['./admin-project-questionnaire.component.scss']
})
export class AdminProjectQuestionnaireComponent implements OnInit {

  private _project: Innovation;
  private _sections: any;
  private _state: Array<any> = [];


  constructor( private _activatedRoute: ActivatedRoute,
               private _innovationService: InnovationService,
               ) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
    this._sections = this._project.preset.sections;

    this._sections.forEach((sec: any, index: number) => {
      const tab: Array<boolean> = [];
      sec.questions.forEach((quest: any) => {
        tab.push(false);
      });
      this._state.push({
        sec: false,
        quest: tab
      })
    });
    console.log(this._state);
  }


  public indexSection(sec: any) {
    let k = 0;
    for (const section of this._project.preset.sections) {
      if (section.name === sec.name) {
        return k;
      }
      k++;
    }
  }

  public updateState(event: any,index: number) {
    this._state[index] = event;
  }
  public sectionUpdated(event: any) {
    this._project.preset.sections[this.indexSection(event)] = event;
    console.log('UPDATE:');
    console.log(this._project.preset);
    this._innovationService.save(this._project._id, this._project).first().subscribe( result => {
      this._project = result;
      this._sections = this._project.preset.sections;
    });
  }

  public addSection() {
    let name;
    if (this._project.preset && this._project.preset.sections) {
      name = 'Section' + this._project.preset.sections.length;
    } else {
      name = 'Section';
    }
    this._project.preset.sections.push({
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
    this._innovationService.save(this._project._id, this._project).first().subscribe( result => {
      this._project = result;
      this._sections = this._project.preset.sections;
    });
  }

  public sectionRemoved(event: any) {
    this._project.preset.sections.splice(this.indexSection(event), 1);
    this._innovationService.save(this._project._id, this._project).first().subscribe( result => {
      this._project = result;
      this._sections = this._project.preset.sections;
    });
  }

  public getState(index: number) {
    return this._state[index];
  }

  get sections() {
    return this._sections;
  }

  get innovation() {
    return this._project;
  }

  public moveSection(event: any, index: number) {
    if (event === 'down') {
      if (index + 1 === this._sections.length) {
        console.log("on ne peut pas descendre plus");
      } else {
        const tempSec = JSON.parse(JSON.stringify(this._sections[index]));
        this._sections[index] = JSON.parse(JSON.stringify(this._sections[index + 1]));
        this._sections[index + 1] = tempSec;
        const tempState = JSON.parse(JSON.stringify(this._state[index]));
        this._state[index] = JSON.parse(JSON.stringify(this._state[index + 1]));
        this._state[index + 1] = tempState;
        this._project.preset.sections = this._sections;
        this._innovationService.save(this._project._id, this._project).first().subscribe( result => {
          this._project = result;
          this._sections = this._project.preset.sections;
        });
      }
    }
    if (event === 'up') {
      if (index === 0) {
        console.log("on ne peut pas monter plus");
      } else {
        const tempSec = JSON.parse(JSON.stringify(this._sections[index]));
        this._sections[index] = JSON.parse(JSON.stringify(this._sections[index - 1]));
        this._sections[index - 1] = tempSec;
        const tempState = JSON.parse(JSON.stringify(this._state[index]));
        this._state[index] = JSON.parse(JSON.stringify(this._state[index - 1]));
        this._state[index - 1] = tempState;
        this._project.preset.sections = this._sections;
        this._innovationService.save(this._project._id, this._project).first().subscribe( result => {
          this._project = result;
          this._sections = this._project.preset.sections;
        });
      }
    }

  }

}
