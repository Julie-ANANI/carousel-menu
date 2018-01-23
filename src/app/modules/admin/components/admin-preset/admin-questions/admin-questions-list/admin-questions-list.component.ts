import { Component, OnInit } from '@angular/core';
import { PresetService } from '../../../../../../services/preset/preset.service';

@Component({
  templateUrl: './admin-questions-list.component.html',
  styleUrls: ['./admin-questions-list.component.scss']
})
export class AdminQuestionsListComponent implements OnInit {

  private _questions: [any];
  public selectedQuestionIdToBeDeleted: any = null;
  private _total: number;
  private _config = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private _presetService: PresetService) {}

  ngOnInit(): void {
    this.loadQuestions(this._config);
  }

  loadQuestions(config: any): void {
    this._config = config;
    this._presetService.getAllQuestions(this._config).subscribe(questions => {
      this._questions = questions.result;
      this._total = questions._metadata.totalCount;
    });
  }

  private _getQuestionIndex(questionId: string): number {
    for (const question of this._questions) {
      if (questionId === question._id) {
        return this._questions.indexOf(question);
      }
    }
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeQuestion(questionId) {
    this._presetService
      .removeQuestion(questionId)
      .subscribe(questionRemoved => {
        this._questions.splice(this._getQuestionIndex(questionId), 1);
        this.selectedQuestionIdToBeDeleted = null;
      });
  }

  set config(value: any) {
    this._config = value;
  }

  get config(): any {
    return this._config;
  }

  get total () {
    return this._total;
  }

  get questions () {
    return this._questions;
  }
}
