import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Innovation } from '../../../../../../../../models/innovation';
import { environment } from '../../../../../../../../../environments/environment';

@Component({
  selector: 'app-project-survey',
  templateUrl: 'survey.component.html',
  styleUrls: ['survey.component.scss']
})

export class SurveyComponent implements OnInit {

  @Input() project: Innovation;

  private _url: string;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    if (this.project.quizId) {
      this._url = environment.quizUrl + '/quiz/' + this.project.quizId + '/preview?lang=' + this.translateService.currentLang;
    }
  }

  get url() {
    return this._url;
  }

}
