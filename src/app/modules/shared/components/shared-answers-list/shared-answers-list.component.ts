import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../models/answer';
import {Table} from '../../../table/models/table';

@Component({
  selector: 'app-answers-list',
  templateUrl: './shared-answers-list.component.html',
  styleUrls: ['./shared-answers-list.component.scss']
})
export class SharedAnswersListComponent {

  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this.loadAnswers();
  };
  @Output() modalAnswerChange = new EventEmitter<any>();

  private _answers: Array<Answer> = [];
  private _tableInfos: Table = null;

  constructor() {
  }

  loadAnswers() {
    this._tableInfos = {
      _selector: 'admin-answers',
      _content: this._answers,
      _total: this._answers.length,
      _isHeadable: true,
      _isLocal: true,
      _isFiltrable: true,
      _isEditable: true,
      _reloadColumns: true,
      _columns: [
        {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'COMMON.NAME', _type: 'TEXT'},
        {_attrs: ['country'], _name: 'COMMON.COUNTRY', _type: 'COUNTRY', _isSortable: false},
        {_attrs: ['professional.email'], _name: 'COMMON.EMAIL', _type: 'TEXT'},
        {_attrs: ['professional.jobTitle'], _name: 'COMMON.JOBTITLE', _type: 'TEXT'},
        {_attrs: ['status'], _name: 'PROJECT_LIST.STATUS', _type: 'MULTI-CHOICES', _choices: [
            {_name: 'VALIDATED', _alias: 'ANSWER.STATUS.VALIDATED', _class: 'label-validate'},
            {_name: 'VALIDATED_NO_MAIL', _alias: 'ANSWER.STATUS.VALIDATED', _class: 'label-validate'},
            {_name: 'SUBMITTED', _alias: 'ANSWER.STATUS.SUBMITTED', _class: 'label-progress'},
            {_name: 'REJECTED', _alias: 'ANSWER.STATUS.REJECTED', _class: 'label-alert'},
          ]},
      ]
    };
  }

  public seeAnswer(answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get config(): any { return this._config; }
}
