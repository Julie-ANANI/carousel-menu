import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { Answer } from '../../../../../../models/answer';
import { Multiling } from '../../../../../../models/multiling';
import { TranslateService } from '@ngx-translate/core';
import { ResponseService } from '../../../shared-market-report/services/response.service';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})

export class StarsComponent implements OnInit {

  @Input() set question(value: Question) {
    this._question = value;
  }

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._updateAnswersData();
  }

  private _question: Question;

  private _answers: Array<Answer> = [];

  private _notesData: Array<{label: Multiling, sum: number, percentage: string}> = [];

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
  }

  private _updateAnswersData(): void {
    if (this._question && this._question.identifier) {
      this._notesData = ResponseService.getStarsAnswers(this._question, this._answers);
    }
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get question(): Question {
    return this._question;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get notesData(): Array<{ label: Multiling; sum: number; percentage: string }> {
    return this._notesData;
  }

}
