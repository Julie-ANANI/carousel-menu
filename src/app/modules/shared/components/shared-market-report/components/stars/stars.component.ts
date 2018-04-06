/**
 * Created by bastien on 24/11/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Multiling } from '../../../../../../models/multiling';

@Component({
  selector: 'app-stars',
  templateUrl: 'stars.component.html',
  styleUrls: ['stars.component.scss']
})

export class StarsComponent implements OnInit {

  @Input() public answers: Array<Answer>;
  @Input() public question: any;

  private _notesData: Array<{label: Multiling, sum: number, count: number, percentage: string}>;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this._notesData = this.question.options.map((x: any) => {
      return {
        label: x.label,
        sum: 0,
        count: 0,
        percentage: '0%'
      };
    });

    this.answers.forEach((answer) => {
      Object.keys(answer.answers[this.question.id]).forEach((k) => {
        const idx = parseInt(k, 10);
        const vote = parseInt(answer.answers[this.question.id][k], 10);
        if (idx !== NaN && vote && idx < this._notesData.length && this._notesData[k]) {
          this._notesData[k].count += 1;
          this._notesData[k].sum += vote;
        }
      });
    });

    this._notesData.forEach(function(noteData) {
      if (noteData.count > 0) {
        noteData.percentage = `${Math.round(((noteData.sum / noteData.count) || 0) * 20)}%`;
      }
    });
  }

  get lang(): string { return this.translateService.currentLang; }
  get notesData() { return this._notesData; }
}
