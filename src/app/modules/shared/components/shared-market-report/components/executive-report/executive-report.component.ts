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
    this._innovation = value;
    this._executiveReport = value.executiveReport;
  }

  private _executiveReport: any = {};

  private _innovation: Innovation = {};

  private _question: Question = null;

  private _firstPageSections = [0, 1, 2, 3];

  private _secondPageSections = [4, 5, 6, 7];

  constructor() { }

  ngOnInit() {
  }

  get executiveReport(): any {
    return this._executiveReport;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get question(): Question {
    return this._question;
  }

  get firstPageSections(): number[] {
    return this._firstPageSections;
  }

  get secondPageSections(): number[] {
    return this._secondPageSections;
  }

}
