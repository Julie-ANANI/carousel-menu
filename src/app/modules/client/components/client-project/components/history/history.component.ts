import { Component, Input, OnInit } from '@angular/core';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import {Question} from '../../../../../../models/question';
import {Section} from '../../../../../../models/section';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-client-history-project',
  templateUrl: 'history.component.html',
  styleUrls: ['history.component.scss']
})

export class HistoryProjectComponent implements OnInit {

  @Input() project: Innovation;

  private _events: Array<{type: string, date: Date, data?: Answer}>;
  private _modalAnswer: Answer;
  private _questions: Array<Question>;

  constructor(private answers: AnswerService, private authService: AuthService) {}

  ngOnInit() {
    this._events = this.sortEvents(this.getBaseEvents());
    this._questions = this.project.preset.sections.reduce((acc: Array<Question>, section: Section) => { return acc.concat(section.questions); }, []);
    this.answers
      .getInnovationValidAnswers(this.project._id)
      .pipe(first())
      .subscribe((answers: any) => {
        const events = this.getBaseEvents();
        answers.answers.forEach((a: Answer) => {
          events.push({type: 'NEWANSWER', date: a.created, data: a});
      });
      this._events = this.sortEvents(events);
    });
  }

  private getBaseEvents(): Array<{type: string, date: Date, data?: Answer}> {
    const events: Array<{type: string, date: Date}> = [];
    events.push({type: 'STARTED', date: this.project.created});
    if (this.project.launched) {
      events.push({type: 'LAUNCHED', date: this.project.launched})
    }
    return events;
  }

  private sortEvents(evnts: Array<{type: string, date: Date, data?: Answer}>): Array<{type: string, date: Date, data?: Answer}> {
    return evnts.sort(function(a, b) {
      if (a.date > b.date) {
        return 1;
      } else if (a.date < b.date) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  get events() { return this._events; }
  get isAdmin(): boolean { return (this.authService.adminLevel & 3) === 3; }
  get modalAnswer() { return this._modalAnswer; }
  set modalAnswer(value: Answer) { this._modalAnswer = value; }
  get questions() { return this._questions; }

}
