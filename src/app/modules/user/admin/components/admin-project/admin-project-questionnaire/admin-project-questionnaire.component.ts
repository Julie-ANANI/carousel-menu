import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Preset } from '../../../../../../models/preset';
import { first } from 'rxjs/operators';

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

  public savePreset(preset: Preset): void {
    const project = { preset: this._project.preset };
    this._innovationService.save(this._project._id, project).pipe(first()).subscribe((result: any) => {
      this._project = result;
    });
  }

  get innovation() { return this._project; }

}
