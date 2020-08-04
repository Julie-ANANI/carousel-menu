import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Tag } from '../../../../../../models/tag';
import { UserFrontService } from "../../../../../../services/user/user-front.service";

@Component({
  selector: 'app-pro-tag',
  templateUrl: 'pro-tag.component.html',
  styleUrls: ['pro-tag.component.scss']
})

export class ProfessionalTagComponent implements OnInit {

  @Input() answer: Answer = <Answer>{};

  @Input() questionId = '';

  @Input() sectorTag = false;

  @Output() modalAnswerChange = new EventEmitter<any>();

  private _tags: Array<Tag> = [];

  private _currentLang = this.translateService.currentLang;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    if (this.questionId) {
      this._tags = this.answer.answerTags[this.questionId] || [];
      if (this.sectorTag) this._tags = [...this._tags, ...this.answer.tags];
    } else {
      this._tags = this.answer.tags;
    }
  }

  public seeAnswer(event: Event, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

  get professionalName(): string {
    return UserFrontService.fullName(this.answer.professional)
  }

  get tags() {
    return this._tags;
  }

  get currentLang(): string {
    return this._currentLang;
  }

}
