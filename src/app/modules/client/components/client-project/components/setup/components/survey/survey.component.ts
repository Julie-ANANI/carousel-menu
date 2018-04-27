import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../../../../../models/innovation';

@Component({
  selector: 'app-project-survey',
  templateUrl: 'survey.component.html',
  styleUrls: ['survey.component.scss']
})
export class SurveyComponent {

  @Input() project: Innovation;

  constructor() {}

}
