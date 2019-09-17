import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Multiling } from '../../../../../../models/multiling';
import { Question } from '../../../../../../models/question';
import { DataService } from '../../services/data.service';
import { ResponseService } from '../../services/response.service';

@Component({
  selector: 'app-stars',
  templateUrl: 'stars.component.html',
  styleUrls: ['stars.component.scss']
})

export class StarsComponent implements OnInit {

  @Input() question: Question;

  private _notesData: Array<{label: Multiling, sum: number, percentage: string}> = [];

  constructor(private _translateService: TranslateService,
              private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getAnswers(this.question).subscribe((answers: Array<Answer>) => {
      this._notesData = ResponseService.getStarsAnswers(this.question, answers);
    });
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get notesData(): Array<{ label: Multiling; sum: number; percentage: string }> {
    return this._notesData;
  }

}
