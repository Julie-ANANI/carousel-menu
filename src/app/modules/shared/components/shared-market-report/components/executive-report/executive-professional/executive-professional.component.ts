import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Answer } from '../../../../../../../models/answer';
import { ResponseService } from '../../../services/response.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-executive-professional',
  templateUrl: './executive-professional.component.html',
  styleUrls: ['./executive-professional.component.scss']
})

export class ExecutiveProfessionalComponent implements OnInit, OnDestroy {

  @Input() set mapInitialConfiguration(value: any) {
    this.initialConfigurationReceived = value;
  }

  @Input() set professionalAbstract(value: string) {
    this.profAbstractReceived = value;
  }

  ngUnsubscribe: Subject<any> = new Subject();

  answerReceived: Array<Answer> = [];

  professionals: Array<any> = [];

  initialConfigurationReceived: any;

  profAbstractReceived: string;

  constructor(private responseService: ResponseService) { }

  ngOnInit() {
    this.getAnswers();
  }

  private getAnswers() {
    this.responseService.getExecutiveAnswers().takeUntil(this.ngUnsubscribe).subscribe((response) => {
      if (response !== null) {
        this.answerReceived = response;
        this.topProfessionals();
      }
    })
  }

  private topProfessionals() {
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

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
