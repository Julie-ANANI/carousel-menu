import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-market-comment',
  templateUrl: 'professional-comment.component.html',
  styleUrls: ['professional-comment.component.scss']
})

export class SharedMarketCommentComponent {

  @Input() answer: Answer = <Answer>{};

  @Input() questionId = '';

  @Output() modalAnswerChange = new EventEmitter<any>();

  private _currentLang = this.translateService.currentLang;

  constructor(private translateService: TranslateService) { }

  public seeAnswer(answer: Answer) {
    this.modalAnswerChange.emit(answer);
  }

  get currentLang(): string {
    return this._currentLang;
  }

}
