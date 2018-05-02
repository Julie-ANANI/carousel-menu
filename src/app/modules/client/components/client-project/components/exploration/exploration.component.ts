import { Component, Input, OnInit } from '@angular/core';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Section } from '../../../../../../models/section';

@Component({
  selector: 'app-client-exploration-project',
  templateUrl: 'exploration.component.html',
  styleUrls: ['exploration.component.scss']
})
export class ExplorationProjectComponent implements OnInit {

  @Input() project: Innovation;

  private _contactUrl: string;
  private _answers: Array<Answer>;
  private _questions: Array<Question>;
  private _modalAnswer: Answer;

  constructor(private answerService: AnswerService, private notificationService: TranslateNotificationsService) {}

  ngOnInit() {
    this._contactUrl = encodeURI('mailto:contact@umi.us?subject=' + this.project.name);
    this.answerService
      .getInnovationValidAnswers(this.project._id)
      .first()
      .subscribe((results) => {
        this._answers = results.answers;
      }, (error) => {
        this.notificationService.error('ERROR.ERROR', error.message);
      });
    this._questions = [];
    if (this.project.preset && Array.isArray(this.project.preset.sections)) {
      this.project.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions || []);
      });
    }
  }

  public seeAnswer(answer: Answer) {
    this._modalAnswer = answer;
  }

  get answers() { return this._answers; }
  get contactUrl() { return this._contactUrl; }
  get modalAnswer() { return this._modalAnswer; }
  set modalAnswer(modalAnswer: Answer) { this._modalAnswer = modalAnswer; }
  get questions() { return this._questions; }

}
