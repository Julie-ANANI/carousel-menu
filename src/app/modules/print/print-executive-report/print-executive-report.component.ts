import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../models/innovation';
import { ExecutiveReport } from '../../../models/executive-report';
import { InnovationFrontService } from '../../../services/innovation/innovation-front.service';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../models/user.model';
import { ResponseService } from '../../shared/components/shared-market-report/services/response.service';
import { Question } from '../../../models/question';

@Component({
  selector: 'app-print-executive-report',
  templateUrl: './print-executive-report.component.html',
  styleUrls: ['./print-executive-report.component.scss']
})

export class PrintExecutiveReportComponent implements OnInit {

  private _data: Innovation | ExecutiveReport = <Innovation | ExecutiveReport>{};

  private _title = '';

  private _media = '';

  private _userLang = this._translateService.currentLang;

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService) { }

  ngOnInit() {

    if (this._activatedRoute.snapshot.data.report && this._activatedRoute.snapshot.data.report._id) {
      this._data = <ExecutiveReport>this._activatedRoute.snapshot.data.report;
      this._userLang = this.data['lang'];
      this._initData();
    } else if (this._activatedRoute.snapshot.parent.data.innovation && this._activatedRoute.snapshot.parent.data.innovation.executiveReport) {
      this._data = <Innovation>this._activatedRoute.snapshot.parent.data.innovation;
      this._data.executiveReport.lang = InnovationFrontService.currentLangInnovationCard(<Innovation>this.data, this._userLang, 'LANG');
      this._data.executiveReport.operator = this._data.operator || <User>{};
      this._data.executiveReport.conclusion = this._data.marketReport && this._data.marketReport.finalConclusion
        && this._data.marketReport.finalConclusion.conclusion || '';
      this._data.executiveReport.questions = this._initInnoQuestions(this._data);
    }

  }

  /***
   * if we have executive report we need to get other data for that report from the innovation like,
   * Title, Media.
   * object.
   * @private
   */
  private _initData() {
    const innovation: Innovation = this._activatedRoute.snapshot.parent.data && this._activatedRoute.snapshot.parent.data.innovation
      && <Innovation>this._activatedRoute.snapshot.parent.data.innovation;
    this._title = InnovationFrontService.currentLangInnovationCard(innovation, this._userLang, 'TITLE');
    this._media = InnovationFrontService.principalMedia(innovation, this._userLang, '173', '110');
  }

  /***
   * getting the questions for the old ER from the innovation object.
   * @param innovation
   * @private
   */
  private _initInnoQuestions(innovation: Innovation): Array<Question> {
    const _questions: Array<Question> = [];

    if (innovation.preset && innovation.preset.sections) {
      ResponseService.presets(innovation).forEach((questions) => {
        const index = _questions.findIndex((question) => question._id === questions._id);
        if (index === -1) {
          _questions.push(questions);
        }
      });
    }

    return _questions;
  }

  /***
   * This function is to return the src of the UMI intro image.
   * @returns {string}
   */
  public get introSrc(): string {
    return this._userLang === 'fr' ? 'https://res.cloudinary.com/umi/image/upload/app/default-images/intro/UMI-fr.png'
      : 'https://res.cloudinary.com/umi/image/upload/app/default-images/intro/UMI-en.png'
  }

  get isUMI(): boolean {
    return environment.domain === 'umi';
  }

  get data(): Innovation | ExecutiveReport {
    return this._data;
  }

  get title(): string {
    return this._title;
  }

  get media(): string {
    return this._media;
  }

  get userLang(): string {
    return this._userLang;
  }

}
