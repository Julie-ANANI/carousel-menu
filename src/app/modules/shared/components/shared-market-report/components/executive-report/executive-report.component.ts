import {Component, Input, OnInit} from '@angular/core';
import {Answer} from '../../../../../../models/answer';
import {Question} from '../../../../../../models/question';
import {User} from '../../../../../../models/user.model';

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

  @Input() set report(value: number) {
    this.reportReceived = value;
  }

  @Input() set mapInitialConfiguration(value: any) {
    this.initialConfigurationReceived = value;
  }

  @Input() set operatorContact(value: User) {
    this.opContactReceived = value;
  }

  @Input() set conclusion(value: string) {
    this.conclusionReceived = value;
  }

  answerReceived: Array<Answer>;

  professionals: Array<any> = [];

  questionReceived: Question;

  reportReceived: any;

  initialConfigurationReceived: any;

  opContactReceived: User;

  conclusionReceived: string;

  constructor() { }

  ngOnInit() {
  }

}
