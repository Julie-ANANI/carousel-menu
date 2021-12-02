import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../models/answer';
import { AnswerService } from '../../../../services/answer/answer.service';
import { Table } from '@umius/umi-common-component/models';

@Component({
  selector: 'app-shared-answers-list',
  templateUrl: './shared-answers-list.component.html',
})

export class SharedAnswersListComponent {

  @Input() set config(value: any) {
    this._config = value;
    this.loadAnswers();
  }

  @Output() modalAnswerChange = new EventEmitter<any>();

  @Output() validateAnswers = new EventEmitter<Answer[]>();

  @Output() rejectAnswers = new EventEmitter<Answer[]>();
  private _config: any = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created": "-1"}'
  };

  private _answers: Array<Answer> = [];

  private _tableInfos: Table;

  constructor( private _answerService: AnswerService ) { }

  loadAnswers() {

    this._answerService.getAll(this._config).subscribe((answers: any) => {
      this._answers = answers.result || [];
      this._tableInfos = {
        _selector: 'admin-answers',
        _content: this._answers,
        _total: this._answers.length,
        _isSearchable: true,
        _isSelectable: true,
        _isEditable: true,
        _clickIndex: 1,
        _buttons: [{_label: 'ANSWER.VALID_ANSWER'}, {_label: 'ANSWER.REJECT_ANSWER'}],
        _columns: [
          {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'COMMON.NAME', _type: 'TEXT'},
          {_attrs: ['country'], _name: 'COMMON.COUNTRY', _type: 'COUNTRY'},
          {_attrs: ['professional.email'], _name: 'COMMON.EMAIL', _type: 'TEXT'},
          {_attrs: ['professional.jobTitle'], _name: 'COMMON.JOBTITLE', _type: 'TEXT'},
          {_attrs: ['status'], _name: 'COMMON.STATUS', _type: 'MULTI-CHOICES', _choices: [
              {_name: 'VALIDATED', _alias: 'ANSWER.STATUS.VALIDATED', _class: 'label is-success'},
              {_name: 'SUBMITTED', _alias: 'ANSWER.STATUS.SUBMITTED', _class: 'label is-progress'},
              {_name: 'REJECTED', _alias: 'ANSWER.STATUS.REJECTED', _class: 'label is-danger'},
              {_name: 'REJECTED_GMAIL', _alias: 'ANSWER.STATUS.REJECTED_GMAIL', _class: 'label is-danger'}
            ]},
        ]
      };
    }, err => {
      console.error(err);
    });
  }

  seeAnswer(answer: Answer) {
    this.modalAnswerChange.emit(answer);
  }

  performActions(action: any) {
    switch (action._label) {
      case 'ANSWER.VALID_ANSWER': {
        this.validateAnswers.emit(action._rows);
        break;
      } case 'ANSWER.REJECT_ANSWER': {
        this.rejectAnswers.emit(action._rows);
        break;
      }
    }
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get config(): any {
    return this._config;
  }

}
