import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Tag } from '../../../../../../models/tag';
import { environment } from "../../../../../../../environments/environment";
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { PieChart } from '../../../../../../models/pie-chart';

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit {

  @Input() set tags(value: Array<Tag>) {
    this._receivedTags = value;
  }

  @Input() set originAnswers(value: any) {
    this._answersOrigin = value;
  }

  @Input() readonly = true;

  @Input() pieChart: PieChart;

  @Input() innovation: Innovation;

  @Input() question: Question;

  @Input() stats: { nbAnswers: number, percentage: number };

  private _receivedTags: Array<Tag> = [];

  private _answersOrigin: {[c: string]: number} = null;

  constructor(private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    if (!!this.innovation && !this.innovation.marketReport) {
      this.innovation.marketReport = {};
    }
  }


  public keyupHandlerFunction(event: {content: string}) {
    const innoChanges: Innovation = {marketReport: {[this.question.identifier]: { conclusion: event['content'] }}};
    this._innovationService.save(this.innovation._id, innoChanges).subscribe(() => {
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get lang() {
    return this._translateService.currentLang;
  }

  get receivedTags(): Array<Tag> {
    return this._receivedTags;
  }

  get answersOrigin(): { [p: string]: number } {
    return this._answersOrigin;
  }

}
