import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Answer } from '../../../../../../../models/answer';
import { ResponseService } from '../../../services/response.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Innovation } from '../../../../../../../models/innovation';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-executive-professional',
  templateUrl: './executive-professional.component.html',
  styleUrls: ['./executive-professional.component.scss']
})

export class ExecutiveProfessionalComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this._professionalAbstract = value.executiveReport.professionalAbstract;
  }

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _answers: Array<Answer> = [];

  private _professionalsAnswer: Array<Answer> = [];

  private _professionalAbstract = '';

  private _targetCountries: Array<string> = [];

  constructor(private responseService: ResponseService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this.getAnswers();
  }

  private getAnswers() {
    this.responseService.getExecutiveAnswers().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      if (response) {
        this._answers = response;
        this.getTargetCountries();
        this.topProfessionalsAnswer();
      }
    });
  }


  private getTargetCountries() {
    this._targetCountries = this._answers.reduce((acc, answer) => {
      if (acc.indexOf(answer.country.flag) === -1) {
        acc.push(answer.country.flag);
      }
      return acc;
    }, []);
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

  get answers(): Array<Answer> {
    return this._answers;
  }

  get professionalsAnswer(): Array<Answer> {
    return this._professionalsAnswer;
  }

  get targetCountries(): Array<string> {
    return this._targetCountries;
  }

  get professionalAbstract(): string {
    return this._professionalAbstract;
  }

  get userLang() {
    return this.translateService.currentLang || this.translateService.getBrowserLang() || 'en';
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
