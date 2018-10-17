import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Answer } from '../../../../../../../models/answer';
import { ResponseService } from '../../../services/response.service';
import { Subject } from 'rxjs/Subject';
import { Innovation } from '../../../../../../../models/innovation';

@Component({
  selector: 'app-executive-professional',
  templateUrl: './executive-professional.component.html',
  styleUrls: ['./executive-professional.component.scss']
})

export class ExecutiveProfessionalComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this.mapConfiguration = value.settings.geography.continentTarget || {};
    this.professionalAbstract = value.executiveReport.professionalAbstract;
  }

  ngUnsubscribe: Subject<any> = new Subject();

  answers: Array<Answer> = [];

  professionalsAnswer: Array<Answer> = [];

  mapConfiguration: any = {};

  professionalAbstract = '';

  constructor(private responseService: ResponseService) { }

  ngOnInit() {
    this.getAnswers();
  }

  private getAnswers() {
    this.responseService.getExecutiveAnswers().takeUntil(this.ngUnsubscribe).subscribe((response) => {
      if (response !== null) {
        this.answers = response;
        this.topProfessionalsAnswer();
      }
    })
  }

  private topProfessionalsAnswer() {

    this.answers.forEach((items) => {
      if (items.profileQuality === 2) {
        this.professionalsAnswer.push(items);
      }
    });

    if (this.professionalsAnswer.length === 0 || this.professionalsAnswer.length < 4) {
      this.answers.forEach((items) => {
        const find = this.professionalsAnswer.find((professional) => professional._id === items._id);
        if (!find) {
          this.professionalsAnswer.push(items);
        }
      });
    }

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.unsubscribe();
  }

}
