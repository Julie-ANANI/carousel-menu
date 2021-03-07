import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DataService} from '../../services/data.service';
import {Innovation} from '../../../../../../models/innovation';
import {Question} from '../../../../../../models/question';
import {Tag} from '../../../../../../models/tag';
import {environment} from '../../../../../../../environments/environment';
import {PieChart} from '../../../../../../models/pie-chart';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit {

  @Input() originAnswers: {[continent: string]: {count: any, countries: {[country: string]: {count: number}}}} = null;

  @Input() readonly = true;

  @Input() pieChart: PieChart = <PieChart>{};

  @Input() innovation: Innovation = <Innovation>{};

  @Input() question: Question = <Question>{};

  @Input() stats: { nbAnswers: number, percentage: number } = null;

  private _currentLang = this._translateService.currentLang;

  private _isMainDomain = environment.domain === 'umi' || false;

  constructor(private _translateService: TranslateService,
              private _dataService: DataService,
              private _innovationFrontService: InnovationFrontService) {}

  ngOnInit() {
    if (!!this.innovation && !this.innovation.marketReport) {
      this.innovation.marketReport = {};
    }
  }

  public keyupHandlerFunction(event: {content: string}) {
    this.innovation.marketReport[this.question.identifier] = { conclusion: event['content'] };
    this._innovationFrontService.setNotifyChanges({key: 'marketReport', state: true});
  }

  get tags(): Array<Tag> {
    return this._dataService.answersTagsLists[this.question._id];
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get isMainDomain(): boolean {
    return this._isMainDomain;
  }

}
