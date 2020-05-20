import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../services/data.service';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Tag } from '../../../../../../models/tag';
import { environment } from '../../../../../../../environments/environment';
import { PieChart } from '../../../../../../models/pie-chart';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit {

  @Input() set originAnswers(value: any) {
    this._answersOrigin = value;
  }

  @Input() readonly = true;

  @Input() pieChart: PieChart;

  @Input() innovation: Innovation;

  @Input() question: Question;

  @Input() stats: { nbAnswers: number, percentage: number };

  private _answersOrigin: {[c: string]: number} = null;

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
    this._innovationFrontService.setNotifyChanges(true);
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get lang() {
    return this._translateService.currentLang;
  }

  get tags(): Array<Tag> {
    return this._dataService.answersTagsLists[this.question._id];
  }

  get answersOrigin(): { [p: string]: number } {
    return this._answersOrigin;
  }

}
