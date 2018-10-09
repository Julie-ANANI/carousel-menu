import {Component, Input, OnInit} from '@angular/core';
import {Answer} from '../../../../../../models/answer';
import {Question} from '../../../../../../models/question';

@Component({
  selector: 'app-executive-report',
  templateUrl: './executive-report.component.html',
  styleUrls: ['./executive-report.component.scss']
})

export class ExecutiveReportComponent implements OnInit {

  @Input() set answers(value: Array<Answer>) {
    this.answerReceived = value;
  }

  @Input() set questions(value: Question) {
    this.questionReceived = value;
  }

  @Input() set sections(value: number) {
    this.totalSections = value;
  }

  answerReceived: Array<Answer>;

  questionReceived: Question;

  totalSections: number;

  constructor() { }

  ngOnInit() {
  }

}
