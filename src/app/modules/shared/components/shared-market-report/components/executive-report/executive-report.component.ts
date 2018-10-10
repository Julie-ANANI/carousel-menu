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
    this.topProfessionals();
    console.log(this.answerReceived);
  }

  @Input() set questions(value: Question) {
    this.questionReceived = value;
    console.log(value);
  }

  @Input() set report(value: number) {
    this.reportReceived = value;
    console.log(value);
  }

  @Input() set mapInitialConfiguration(value: any) {
    this.initialConfigurationReceived = value;
  }

  answerReceived: Array<Answer>;

  professionals: Array<any> = [];

  questionReceived: Question;

  reportReceived: any;

  initialConfigurationReceived: any;

  constructor() { }

  ngOnInit() {
  }

  topProfessionals() {
    this.answerReceived.forEach((items) => {
      if (items.profileQuality === 2) {
        this.professionals.push(items);
      }
    });

    if (this.professionals.length === 0) {
      this.answerReceived.forEach((items) => {
        this.professionals.push(items);
      });
    }

    console.log(this.professionals);
  }

}
