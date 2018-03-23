import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit, OnDestroy {

  @Input() public info: any;
  @Input() public readonly = true;
  @Input() public innovationId: string;

  private ngUnsubscribe: Subject<any> = new Subject();
  private _chartValues: any;
  private _lang: string;
  private _conclusionId: string;

  constructor(private innovationService: InnovationService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this._conclusionId = `${this.info.id}Conclusion`;
    this._lang = this.translateService.currentLang || 'en';
    this.translateService.onLangChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((e: LangChangeEvent) => {
        this._lang = e.lang || 'en';
      });
    switch (this.info.controlType) {
      case 'radio':
        this._chartValues = {
          data: [{
            data: [],
            backgroundColor: []
          }],
          labels: {
            fr: [],
            en: []
          },
          colors: []
        };
        this.info.options.forEach((option: {identifier: string, label: {[lang: string]: string}}) => {
          this._chartValues.data[0].data.push(this.info.pieChart[option.identifier].count);
          if (option.label) {
            this._chartValues.labels.fr.push(option.label.fr);
            this._chartValues.labels.en.push(option.label.en);
          }
          this._chartValues.data[0].backgroundColor.push(this.info.pieChart[option.identifier].color);
        });
        break;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public keyupHandlerFunction(event: any) {
    let savedObject = {};
    savedObject[this.info.id] = {
      conclusion: event['content']
    };
    this.innovationService.updateSynthesis(this.innovationId, savedObject)
      .first()
      .subscribe(data => {
        if (this.info.id === 'professionals') {
          this.info.conclusion = data.infographics.professionals.conclusion;
        } else {
          const questionIndex = data.infographics.questions.find((q: any) => q.id === this.info.id);
          if (questionIndex > -1) {
            this.info.conclusion = data.infographics.questions[questionIndex].conclusion;
          }
        }
      });
  }

  public get conclusionId() { return this._conclusionId; }
  public get lang() { return this._lang; }
  public get chartValues() { return this._chartValues; }

}
