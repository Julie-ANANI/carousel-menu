import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { Answer } from '../../../../../../models/answer';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../../../services/auth/auth.service';

@Component({
  selector: 'app-user-answer',
  templateUrl: './user-answer.component.html',
  styleUrls: ['./user-answer.component.scss']
})

export class UserAnswerComponent implements OnInit {

  @Input() innovationId: string;
  @Input() questions: Array<Question>;
  @Input() adminMode: boolean;

  @Input() set userAnswer(value: Answer) {
    this.modalAnswer = value;
    console.log(this.modalAnswer);
    if (this.modalAnswer && !this.modalAnswer.company) {
      this.modalAnswer.company = {};
    }
  }

  modalAnswer: Answer;
  editMode = false;
  floor: any;

  constructor(private translateService: TranslateService,
              private authService: AuthService) {}

  ngOnInit() {
    this.adminMode = this.adminMode && this.authService.adminLevel > 2;

    this.floor = Math.floor;

  }

  get lang(): string {
    return this.translateService.currentLang || this.translateService.getBrowserLang() || 'en';
  }

}
