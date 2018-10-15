import { Component, Input, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';

@Component({
  selector: 'app-executive-report',
  templateUrl: './executive-report.component.html',
  styleUrls: ['./executive-report.component.scss']
})

export class ExecutiveReportComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this.innovation = value;
    this.executiveReport = value.executiveReport;
  }

  executiveReport: any = {};

  innovation: Innovation = {};

  question: Question = null;

  sectionNumbers = [0, 1, 2, 3, 4, 5, 6, 7];

  constructor() { }

  ngOnInit() {
  }

}
