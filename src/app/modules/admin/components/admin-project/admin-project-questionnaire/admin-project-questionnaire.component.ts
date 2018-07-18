import { Component, OnInit } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';
// import {InnovationService} from '../../../../../services/innovation/innovation.service';

@Component({
  selector: 'app-admin-project-questionnaire',
  templateUrl: './admin-project-questionnaire.component.html',
  styleUrls: ['./admin-project-questionnaire.component.scss']
})
export class AdminProjectQuestionnaireComponent implements OnInit {

  private _project: Innovation;

  constructor(  private _activatedRoute: ActivatedRoute,
               ) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
  }

}
