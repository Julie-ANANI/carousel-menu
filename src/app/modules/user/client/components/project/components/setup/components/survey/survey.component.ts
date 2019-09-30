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

  @Input() innovation: Innovation;

  private _url = '';

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    if (this.innovation && this.innovation.quizId) {
      this._url = environment.quizUrl + '/quiz/' + this.innovation.quizId + '/preview?lang=' + this._translateService.currentLang;
    }
  }

  get url() {
    return this._url;
  }

}
