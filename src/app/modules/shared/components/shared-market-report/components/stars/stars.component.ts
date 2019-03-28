import {Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Multiling } from '../../../../../../models/multiling';
import { Question } from '../../../../../../models/question';

@Component({
  selector: 'app-stars',
  templateUrl: 'stars.component.html',
  styleUrls: ['stars.component.scss']
})

export class StarsComponent implements OnInit {

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._updateAnswersData();
  }

  @Input() set executiveReport(value: boolean) {
    this._executiveReportView = value;
  }

  @Input() innovation: Innovation;

  @Input() question: Question;

  private _executiveReportView = false;

  private _answers: Array<Answer> = [];

  private _notesData: Array<{label: Multiling, sum: number, percentage: string}> = [];

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    this._updateAnswersData();
  }

  private _updateAnswersData(): void {
    if (this.question && this.question.identifier) {

      this._notesData = this.question.options.map((x: any) => {
        return {
          label: x.label,
          sum: 0,
          percentage: '0%'
        };
      });

      this._answers.forEach((answer) => {
        Object.keys(answer.answers[this.question.identifier]).forEach((k) => {
          const idx = parseInt(k, 10);
          const vote = parseInt(answer.answers[this.question.identifier][k], 10);
          if (Number.isInteger(idx) && Number.isInteger(vote) && idx < this._notesData.length) {
            // If user didn't vote this characteristic, default value will be 0.
            this._notesData[k].sum += vote;
          }
        });
      });

      this._notesData = this._notesData
        .map((noteData) => {
          if (this._answers.length > 0) {
            noteData.percentage = `${Math.round(((noteData.sum / this._answers.length) || 0) * 20)}%`;
          }
          return noteData;
        })
        .sort((noteA, noteB) => {
          return noteB.sum - noteA.sum;
        });

    }
  }

  get lang(): string {
    return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
  }

  get notesData(): Array<{ label: Multiling; sum: number; percentage: string }> {
    return this._notesData;
  }

  get executiveReportView(): boolean {
    return this._executiveReportView;
  }

}
