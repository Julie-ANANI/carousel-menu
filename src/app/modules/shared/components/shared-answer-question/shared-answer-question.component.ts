/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../models/answer';
import { Question } from '../../../../models/question';
import * as _ from 'lodash';

@Component({
  selector: 'shared-answer-question',
  templateUrl: 'shared-answer-question.component.html',
  styleUrls: ['shared-answer-question.component.scss']
})

export class SharedAnswerQuestionComponent  {

  @Input() public question: Question;
  @Input() public fullAnswer: Answer;
  @Input() public adminMode = false;
  @Output() fullAnswerChange = new EventEmitter <any>();

  constructor(private _translateService: TranslateService) { }

  updateQuality(object: {key: string, value: 0 | 1 | 2}) {
    this.fullAnswer.answers[object.key + 'Quality'] = object.value;
    this.fullAnswerChange.emit(this.fullAnswer);
  }

  link(domain: string): string {
    return 'http://www.' + domain;
  }

  optionLabel(identifier: string) {
    const option = _.find(this.question.options, (o: any) => o.identifier === identifier);
    if (option && option.label) {
      return option.label[this.lang];
    } else {
      return undefined;
    }
  }

  checkOption(option: any) {
    this.fullAnswer.answers[this.question.identifier][option.identifier] = !this.fullAnswer.answers[this.question.identifier][option.identifier];
    this.fullAnswerChange.emit(this.fullAnswer);
  }

  selectOption(event: Event, option: any) {
    event.preventDefault();
    this.fullAnswer.answers[this.question.identifier] = option.identifier;
    this.fullAnswerChange.emit(this.fullAnswer);
  }

  setAnswer(event: any) {
    this.fullAnswer.answers[this.question.identifier] = event.value;
  }

  addComment(event: Event) {
    event.preventDefault();
    this.fullAnswer.answers[this.question.identifier + 'Comment'] = '';
    this.fullAnswerChange.emit(this.fullAnswer);
  }

  deleteComment(event: Event) {
    event.preventDefault();
    delete this.fullAnswer.answers[this.question.identifier + 'Comment'];
    this.fullAnswerChange.emit(this.fullAnswer);
  }

  get lang (): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
