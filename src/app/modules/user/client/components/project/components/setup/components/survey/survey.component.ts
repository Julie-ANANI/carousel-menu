import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Innovation } from '../../../../../../../../../models/innovation';
import { environment } from '../../../../../../../../../../environments/environment';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})

export class SurveyComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  private _url = '';

  private _innovation: Innovation;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    if (this._innovation.quizId) {
      this._url = environment.quizUrl + '/quiz/' + this._innovation.quizId + '/preview?lang=' + this.translateService.currentLang;
    }
  }

  get url() {
    return this._url;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

}
