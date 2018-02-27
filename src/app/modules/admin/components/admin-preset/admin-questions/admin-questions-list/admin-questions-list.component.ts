import { Component, OnInit } from '@angular/core';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { Router } from '@angular/router';
import { Question } from '../../../../../../models/question';

@Component({
  templateUrl: './admin-questions-list.component.html',
  styleUrls: ['./admin-questions-list.component.scss']
})
export class AdminQuestionsListComponent implements OnInit {

  private _questions: Array<Question>;
  public qFilter = '';
  public selectedQuestionIdToBeDeleted: string = null;
  public selectedQuestionToBeCloned: Question = null;
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

  constructor(private _presetService: PresetService,
              private _router: Router) {}

  ngOnInit(): void {
    this.loadQuestions(this._config);
  }

  loadQuestions(config: any): void {
    this._config = config;
    this._presetService.getAllQuestions(this._config)
      .first()
      .subscribe(questions => {
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
  public removeQuestion(event: Event, questionId: string) {
    event.preventDefault();
    this._presetService
      .removeQuestion(questionId)
      .first()
      .subscribe(_ => {
        this._questions.splice(this._getQuestionIndex(questionId), 1);
        this.selectedQuestionIdToBeDeleted = null;
      });
  }

  public cloneQuestion(event: Event, clonedQuestion: Question) {
    event.preventDefault();
    delete clonedQuestion._id;
    this._presetService.createQuestion(clonedQuestion)
      .first()
      .subscribe(question => {
        this._router.navigate(['/admin/questions/' + question._id])
      });
  }

  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total () { return this._total; }
  get questions () {
    if (this.qFilter) {
      return this._questions.filter((q) => q.identifier.indexOf(this.qFilter) !== -1);
    } else {
      return this._questions;
    }
  }
}
