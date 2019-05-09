import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Multiling } from '../../../../../../models/multiling';
import { Question } from '../../../../../../models/question';
import { ResponseService } from '../../services/response.service';

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

  @Input() innovation: Innovation;

  @Input() question: Question;

  private _answers: Array<Answer> = [];

  private _notesData: Array<{label: Multiling, sum: number, percentage: string}> = [];

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    this._updateAnswersData();
  }

  private _updateAnswersData(): void {
    if (this.question && this.question.identifier) {
      this._notesData = ResponseService.getStarsAnswers(this.question, this._answers);
    }
  }

  get lang(): string {
    return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
  }

  get notesData(): Array<{ label: Multiling; sum: number; percentage: string }> {
    return this._notesData;
  }

}
