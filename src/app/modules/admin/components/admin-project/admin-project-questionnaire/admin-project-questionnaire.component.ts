import { Component, OnInit } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';
import {Section} from '../../../../../models/section';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
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
               private _innovationService: InnovationService
               ) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
    this._sections = this._project.preset.sections;
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




  public sectionUpdated(event: any) {
    this._project.preset.sections[this.indexSection(event)] = event;
    console.log(this._project.preset);
    this._innovationService.save(this._project._id, this._project).first().subscribe( result => {
      this._project = result;
      console.log("j'ai update tranquillou");
    });
  }



  get sections() {
    return this._sections;
  }

  get innovation() {
    return this._project;
  }
}
