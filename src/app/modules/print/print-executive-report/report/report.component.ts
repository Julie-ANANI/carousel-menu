import { Component, Input, OnChanges } from '@angular/core';
import { Innovation, OldExecutiveReport } from '../../../../models/innovation';
import { Answer } from '../../../../models/answer';
import { AnswerService } from '../../../../services/answer/answer.service';
import { ExecutiveReport} from '../../../../models/executive-report';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { AnswerFrontService } from '../../../../services/answer/answer-front.service';

@Component({
  selector: 'client-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent implements OnChanges {

  @Input() data: Innovation | ExecutiveReport = <Innovation | ExecutiveReport>{}

  private _firstPageSections = [0, 1, 2, 3];

  private _secondPageSections = [4, 5, 6, 7];

  private _answers: Array<Answer> = [];

  private _totalSection = 8;

  private _report: OldExecutiveReport | ExecutiveReport = <OldExecutiveReport | ExecutiveReport>{};

  constructor (private _answerService: AnswerService) { }

  ngOnChanges(): void {
    if (this.data && this.data['executiveReport'] && this.data['executiveReport']['totalSections']) {
      this._typeInnovation();
    } else if (this.data && !this.data['executiveReport'] && this.data['sections']) {
      this._typeExecutive();
    }
  }

  /***
   * it the object type is Innovation.
   * @private
   */
  private _typeInnovation() {
    const innovation: Innovation = <Innovation>this.data;
    this._report = innovation.executiveReport;
    this._totalSection = this._report && this._report.totalSections;
    const anonymous = !!(innovation._metadata && innovation._metadata.campaign && innovation._metadata.campaign.anonymous_answers);
    this._getAnswers(innovation, anonymous);
  }

  /***
   * if the object type is Executive report
   * @private
   */
  private _typeExecutive() {
    this._report = <ExecutiveReport>this.data;
    this._totalSection = this._report && this._report.sections && this._report.sections.length;
  }

  /***
   * getting the valid answers from the back for the type Innovation.
   * @param innovation
   * @param anonymous
   * @private
   */
  private _getAnswers(innovation: Innovation, anonymous = false) {
    if (innovation && innovation._id) {
      this._answerService.getInnovationValidAnswers(innovation._id).pipe(first()).subscribe((response) => {
        this._answers = AnswerFrontService.qualitySort(response.answers);

        if(anonymous) {
          this._answers = AnswerFrontService.anonymous(this._answers);
        }

      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  get firstPageSections(): number[] {
    return this._firstPageSections;
  }

  get secondPageSections(): number[] {
    return this._secondPageSections;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get totalSection(): number {
    return this._totalSection;
  }

  get report(): OldExecutiveReport | ExecutiveReport {
    return this._report;
  }

}
