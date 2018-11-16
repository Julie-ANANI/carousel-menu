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
    this.updateAnswersData();
  }

  @Input() set executiveReport(value: boolean) {
    this.executiveReportView = value;
  }

  @Input() public innovation: Innovation;
  @Input() public question: Question;

  executiveReportView = false;



  private _answers: Array<Answer> = [];
  private _notesData: Array<{label: Multiling, sum: number, percentage: string, count: number}> = [];
  private _starsOptions: Array<{identifier: number, label: Multiling}> = [];

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    // add list of benefits in stars questions
    const maxLength = this.innovation.innovationCards.reduce((acc, val) => {
      const length = val.advantages.length;
      return length > acc ? length : acc;
    }, 0);
    for (let i = 0; i < maxLength; i++) {
      const option = {identifier: i, label: {}};
      this.innovation.innovationCards.forEach((innovCard) => {
        if (Array.isArray(innovCard.advantages) && i < innovCard.advantages.length) {
          option.label[innovCard.lang] = innovCard.advantages[i].text;
        }
      });
      this._starsOptions.push(option);
    }

    this.updateAnswersData();
  }

  private updateAnswersData(): void {
    if (this.question && this.question.identifier) {

      this._notesData = this._starsOptions.map((x: any) => {
        return {
          label: x.label,
          sum: 0,
          count: 0,
          percentage: '0%'
        };
      });

      this._answers.forEach((answer) => {
        Object.keys(answer.answers[this.question.identifier]).forEach((k) => {
          const idx = parseInt(k, 10);
          const vote = parseInt(answer.answers[this.question.identifier][k], 10);
          if (Number.isInteger(idx) && Number.isInteger(vote) && idx < this._notesData.length && this._notesData[k]) {
            this._notesData[k].sum += vote;
            this._notesData[k].count += 1;
          } else {
            this._notesData[k].sum += 2; // give a default note to increase differences between differents answers
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
          return noteA.sum - noteB.sum;
        });

    }
  }

  get lang(): string { return this.translateService.currentLang; }
  get notesData() { return this._notesData; }
}
