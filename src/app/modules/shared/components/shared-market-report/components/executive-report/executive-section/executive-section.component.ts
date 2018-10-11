import { Component, OnDestroy, OnInit } from '@angular/core';
import { Answer } from '../../../../../../../models/answer';
import { Question } from '../../../../../../../models/question';
import { Multiling } from '../../../../../../../models/multiling';
import { Subject } from 'rxjs/Subject';
import { ResponseService } from '../../../services/response.service';
import {Innovation} from '../../../../../../../models/innovation';

@Component({
  selector: 'app-executive-section',
  templateUrl: './executive-section.component.html',
  styleUrls: ['./executive-section.component.scss']
})

export class ExecutiveSectionComponent implements OnInit, OnDestroy {

  ngUnsubscribe: Subject<any> = new Subject();

  answerReceived: Array<Answer>;

  questionReceived: Array<Question>;

  reportReceived: any;

  quesTitleArray: Array<{title: Multiling, _id: string}> = [];

  constructor(private responseService: ResponseService) { }

  ngOnInit() {
    this.getAnswers();
    this.getQuestions();
    this.getReport();
  }

  private getAnswers() {
    this.responseService.getExecutiveAnswers().takeUntil(this.ngUnsubscribe).subscribe((response) => {
      if (response !== null) {
        this.answerReceived = response;
      }
    });
  }

  private getQuestions() {
    this.responseService.getQuestions().takeUntil(this.ngUnsubscribe).subscribe((response) => {
      if (response !== null) {
        this.questionReceived = response;
      }
    });
  }

  private getReport() {
    this.responseService.getProject().takeUntil(this.ngUnsubscribe).subscribe((response: Innovation) => {
      if (response !== null) {
        this.reportReceived = response.executiveReport;
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
