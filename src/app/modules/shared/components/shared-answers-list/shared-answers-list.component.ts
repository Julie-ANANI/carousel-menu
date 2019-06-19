import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../models/answer';
import { Table } from '../../../table/models/table';
import { AnswerService } from "../../../../services/answer/answer.service";

@Component({
  selector: 'app-shared-answers-list',
  templateUrl: './shared-answers-list.component.html',
  styleUrls: ['./shared-answers-list.component.scss']
})

export class SharedAnswersListComponent {

  private _config: any = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  @Input() set config(value: any) {
    this._config = value;
    this.loadAnswers();
  }

  @Output() modalAnswerChange = new EventEmitter<any>();

  @Output() validateAnswers = new EventEmitter<Answer[]>();

  @Output() rejectAnswers = new EventEmitter<Answer[]>();

  private _answers: Array<Answer> = [];

  private _tableInfos: Table = null;

  private _actions: string[] = [];

  constructor( private _answerService: AnswerService ) { }

  loadAnswers() {

    this._answerService.getAll(this._config).subscribe((answers: any) => {
      this._answers = answers.result || [];
      this._actions = ['ANSWER.VALID_ANSWER', 'ANSWER.REJECT_ANSWER'];
      this._tableInfos = {
        _selector: 'admin-answers',
        _content: this._answers,
        _total: this._answers.length,
        _isSearchable: true,
        _isSelectable: true,
        _isEditable: true,
        _actions: this._actions,
        _columns: [
          {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'COMMON.NAME', _type: 'TEXT'},
          {_attrs: ['country'], _name: 'COMMON.COUNTRY', _type: 'COUNTRY', _isSortable: false},
          {_attrs: ['professional.email'], _name: 'COMMON.EMAIL', _type: 'TEXT'},
          {_attrs: ['professional.jobTitle'], _name: 'COMMON.JOBTITLE', _type: 'TEXT'},
          {_attrs: ['status'], _name: 'PROJECT_LIST.STATUS', _type: 'MULTI-CHOICES', _choices: [
              {_name: 'VALIDATED', _alias: 'ANSWER.STATUS.VALIDATED', _class: 'label label-success'},
              {_name: 'VALIDATED_NO_MAIL', _alias: 'ANSWER.STATUS.VALIDATED_NO_MAIL', _class: 'label label-success'},
              {_name: 'SUBMITTED', _alias: 'ANSWER.STATUS.SUBMITTED', _class: 'label label-progress'},
              {_name: 'REJECTED', _alias: 'ANSWER.STATUS.REJECTED', _class: 'label label-alert'},
              {_name: 'REJECTED_GMAIL', _alias: 'ANSWER.STATUS.REJECTED_GMAIL', _class: 'label label-alert'}
            ]},
        ]
      };
    }, err=>{
      console.error(err);
    });
  }





  seeAnswer(answer: Answer) {
    this.modalAnswerChange.emit(answer);
  }

  performActions(action: any) {
    switch (this._actions.findIndex(value => action._action === value)) {
      case 0: {
        this.validateAnswers.emit(action._rows);
        break;
      } case 1: {
        this.rejectAnswers.emit(action._rows);
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
