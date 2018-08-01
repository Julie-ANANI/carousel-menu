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
  private _presetState: 'TO_BE_SAVED' | 'SAVED';

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
    this._presetState = 'SAVED';
  }

  public saveInno(event: Event): void {
    event.preventDefault();
    const project = { preset: this._project.preset };
    this._innovationService.save(this._project._id, project).first().subscribe( result => {
      this._project = result;
      this._presetState = 'SAVED';
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
    this._presetState = 'TO_BE_SAVED';
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
    this._presetState = 'TO_BE_SAVED';
  }

  public moveSection(move: number, index: number) {
    const new_place = index + move;
    const sections = this._project.preset.sections;
    if (new_place >= 0 && new_place < sections.length) {
      sections[new_place] = sections.splice(index, 1, sections[new_place])[0];
      this._presetState = 'TO_BE_SAVED';
    }
  }

  get innovation() { return this._project; }
  get presetState() { return this._presetState; }

}
