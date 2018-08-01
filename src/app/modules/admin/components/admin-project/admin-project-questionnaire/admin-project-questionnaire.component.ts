import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../models/innovation';
import { Section } from '../../../../../models/section';

@Component({
  selector: 'app-admin-project-questionnaire',
  templateUrl: './admin-project-questionnaire.component.html',
  styleUrls: ['./admin-project-questionnaire.component.scss']
})
export class AdminProjectQuestionnaireComponent implements OnInit {

  private _project: Innovation;

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
  }

  private saveInno(): void {
    const project = { preset: this._project.preset };
    this._innovationService.save(this._project._id, project).first().subscribe( result => {
      this._project = result;
    });
  }

  public updateSection(event: Section, index: number) {
    if (event) {
      // Update section
      this._project.preset.sections[index] = event;
    } else {
      // delete section
      this._project.preset.sections.splice(index, 1);
    }
    this.saveInno();
  }

  public addSection() {
    let name = 'Section';
    if (this._project.preset && Array.isArray(this._project.preset.sections)) {
      name += this._project.preset.sections.length;
    }
    this._project.preset.sections.push({
      questions: [],
      description: 'nothing',
      label: {
        en: name,
        fr: name
      }
    });
    this.saveInno();
  }

  public moveSection(move: number, index: number) {
    const new_place = index + move;
    const sections = this._project.preset.sections;
    if (new_place >= 0 && new_place < sections.length) {
      sections[new_place] = sections.splice(index, 1, sections[new_place])[0];
      this.saveInno();
    }
  }

  get innovation() { return this._project; }

}
