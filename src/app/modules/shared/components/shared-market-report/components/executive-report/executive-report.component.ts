import { Component, Input, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';
import { Answer } from '../../../../../../models/answer';
import { AnswerService } from '../../../../../../services/answer/answer.service';

@Component({
  selector: 'app-executive-report',
  templateUrl: './executive-report.component.html',
  styleUrls: ['./executive-report.component.scss']
})

export class ExecutiveReportComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._innovation = value;
    this._getAnswers();
  }

  private _innovation: Innovation = {};

  private _firstPageSections = [0, 1, 2, 3];

  private _secondPageSections = [4, 5, 6, 7];

  private _answers: Array<Answer> = [];

  constructor (private _answerService: AnswerService) { }

  ngOnInit(): void {
  }

  private _getAnswers() {
    if (this._innovation) {
      this._answerService.getInnovationValidAnswers(this._innovation._id).subscribe((response) => {
        this._answers = response.answers.sort((a, b) => {
          return b.profileQuality - a.profileQuality;
        });
      });
    }
  }

  get innovation(): Innovation {
    return this._innovation;
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

}
