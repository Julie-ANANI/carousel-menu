import { Component, Input, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';
import {Question} from '../../../../../../models/question';

@Component({
  selector: 'app-executive-report',
  templateUrl: './executive-report.component.html',
  styleUrls: ['./executive-report.component.scss']
})

export class ExecutiveReportComponent implements OnInit{

  @Input() set innovation(value: Innovation) {
    this.innovationReceived = value;
    this.executiveReport = value.executiveReport;
  }

  executiveReport: any = {};

  innovationReceived: Innovation = {};

  question: Question = null;

  dummyArray = [0, 1, 2, 3, 4, 5, 6, 7];

  constructor() { }

  ngOnInit() {
  }

}
