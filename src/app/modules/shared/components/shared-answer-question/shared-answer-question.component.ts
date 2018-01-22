/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'shared-answer-question',
  templateUrl: 'shared-answer-question.component.html',
  styleUrls: ['shared-answer-question.component.scss']
})

export class SharedAnswerQuestionComponent implements OnInit {

  @Input() public question;
  @Input() public fullAnswer;
  @Input() public adminMode: boolean;
  @Output() fullAnswerChange = new EventEmitter <any>(); 

  constructor(private _translateService: TranslateService,
              private _authService: AuthService) { }

  ngOnInit() {
  }

  updateQuality(object) {
    this.fullAnswer.answers[object.key + 'Quality'] = object.value;
    this.fullAnswerChange.emit(this.fullAnswer);
  }

  link(domain){
    return "http://www." + domain;
  } 

  optionLabel(identifier) {
    const option = _.find(this.question.options, (o: any) => o.identifier === identifier);
    if (option && option.label) return option.label[this.lang];
  }

  checkOption(option) {
    this.fullAnswer.answers[this.question.identifier][option.identifier] = !this.fullAnswer.answers[this.question.identifier][option.identifier]
    this.fullAnswerChange.emit(this.fullAnswer);
  }
  
  selectOption(index) {
    this.fullAnswer.answers[this.question.identifier] = index + 1;
    this.fullAnswerChange.emit(this.fullAnswer);
  }

  get lang (): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
