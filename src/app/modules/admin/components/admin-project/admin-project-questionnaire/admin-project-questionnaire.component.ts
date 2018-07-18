import { Component, OnInit } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';
import {Section} from '../../../../../models/section';
// import {InnovationService} from '../../../../../services/innovation/innovation.service';

@Component({
  selector: 'app-admin-project-questionnaire',
  templateUrl: './admin-project-questionnaire.component.html',
  styleUrls: ['./admin-project-questionnaire.component.scss']
})
export class AdminProjectQuestionnaireComponent implements OnInit {

  private _project: Innovation;
  private _sections: Section;

  constructor( private _activatedRoute: ActivatedRoute,
               ) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
    this._sections = this._project.preset.sections;
  }



  public sectionUpdated(event: any) {
    console.log("youlou");
    console.log(event);
  }



  get sections() {
    return this._sections;
  }

  get innovation() {
    return this._project;
  }
}
