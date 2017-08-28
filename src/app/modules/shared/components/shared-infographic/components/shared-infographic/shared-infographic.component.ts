import {Component, OnInit} from '@angular/core';
import { infographic, questions } from '../../../../../../data/infographic.data';
import { TranslateService, initTranslation } from './i18n/i18n';


@Component({
  selector: 'app-shared-infographic',
  templateUrl: './shared-infographic.component.html',
  styleUrls: ['./shared-infographic.component.styl']
})
export class SharedInfographicComponent implements OnInit {

  private _showList: boolean;

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    initTranslation(this._translateService);
    this._showList = true;
  }

  getStatTitle (question) {
    for (const q of questions) {
      if (q.id === question.id) {
        return question.statTitle;
      }
    }
  }

  get showList (): boolean {
    return this._showList;
  }
  set showList (bool: boolean) {
    this._showList = bool;
  }

  get infographic (): any {
    return infographic;
  }
  get questions (): any {
    return questions;
  }


}
