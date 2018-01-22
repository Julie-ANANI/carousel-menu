/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'shared-answer-question',
  templateUrl: 'shared-answer-question.component.html',
  styleUrls: ['shared-answer-question.component.scss']
})

export class SharedAnswerQuestionComponent implements OnInit {

  @Input() public question;
  @Input() public fullAnswer;
  @Output() ratingChange = new EventEmitter <any>();

  constructor(private _translateService: TranslateService,
              private _authService: AuthService) { }

  ngOnInit() {
  }

  updateQuality(object) {
    this.ratingChange.emit(object);
  }

  get lang (): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
