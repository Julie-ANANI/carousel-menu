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
    this._mapConfiguration = value.settings.geography.continentTarget || {};
    this._professionalAbstract = value.executiveReport.professionalAbstract;
  }

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _answers: Array<Answer> = [];

  private _professionalsAnswer: Array<Answer> = [];

  private _mapConfiguration: any = {};

  private _professionalAbstract = '';

  constructor(private responseService: ResponseService) { }

  ngOnInit() {
    this.getAnswers();
  }

  private getAnswers() {
    this.responseService.getExecutiveAnswers().takeUntil(this._ngUnsubscribe).subscribe((response) => {
      if (response) {
        this._answers = response;
        this.topProfessionalsAnswer();
      }
    })
  }

  private topProfessionalsAnswer() {

    this._answers.forEach((items) => {
      if (items.profileQuality === 2) {
        this._professionalsAnswer.push(items);
      }
    });

    if (this._professionalsAnswer.length === 0 || this._professionalsAnswer.length < 4) {
      this._answers.forEach((items) => {
        const find = this._professionalsAnswer.find((professional) => professional._id === items._id);
        if (!find) {
          this._professionalsAnswer.push(items);
        }
      });
    }

  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get professionalsAnswer(): Array<Answer> {
    return this._professionalsAnswer;
  }

  get mapConfiguration(): any {
    return this._mapConfiguration;
  }

  get professionalAbstract(): string {
    return this._professionalAbstract;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.unsubscribe();
  }

}
