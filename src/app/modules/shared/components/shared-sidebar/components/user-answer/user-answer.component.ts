import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { Answer } from '../../../../../../models/answer';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../../../services/auth/auth.service';
import {Tag} from '../../../../../../models/tag';
import {AnswerService} from '../../../../../../services/answer/answer.service';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {InnovationService} from '../../../../../../services/innovation/innovation.service';

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
    if (this.modalAnswer && !this.modalAnswer.company) {
      this.modalAnswer.company = {};
    }
  }

  modalAnswer: Answer;
  editMode = false;
  floor: any;
  saveChanges = false;
  displayEmail = false;
  editJob = false;
  editCompany = false;
  editCountry = false;

  constructor(private translateService: TranslateService,
              private authService: AuthService,
              private answerService: AnswerService,
              private translateNotificationsService: TranslateNotificationsService,
              private innovationService: InnovationService) {}

  ngOnInit() {
    this.adminMode = this.adminMode && this.authService.adminLevel > 2;

    this.floor = Math.floor;

    // On regarde si on a une question 'étoiles'
    const starQuestions = this.questions.filter(q => q && q.controlType === 'stars');

    if (starQuestions.length) {
      // Si question 'étoiles', on récupère les advantages
      // TODO: merge the 2 following subscribers in only one
      this.innovationService.getInnovationCardByLanguage(this.innovationId, 'en').first().subscribe(cardEn => {
        this.innovationService.getInnovationCardByLanguage(this.innovationId, 'fr').first().subscribe(cardFr => {
          // puis on les assigne aux questions stars
          starQuestions.forEach(question => {
            question.options = [];
            let i = 0;
            let advantagesLeft = true;
            while (advantagesLeft) {
              if ((cardFr && cardFr.advantages && cardFr.advantages[i] && cardFr.advantages[i].text)
                || (cardEn && cardEn.advantages && cardEn.advantages[i] && cardEn.advantages[i].text)) {
                question.options.push({
                  identifier: i.toString(),
                  label: {
                    fr: cardFr && cardFr.advantages && cardFr.advantages[i] ? cardFr.advantages[i].text : '',
                    en: cardEn && cardEn.advantages && cardEn.advantages[i] ? cardEn.advantages[i].text : ''
                  }
                });
                i++;
              } else {
                advantagesLeft = false;
              }
            }
          })
        });
      });
    }

  }

  notifyChanges() {
    this.saveChanges = true;
  }

  resetEdit() {
    this.editJob = false;
    this.editCompany = false;
    this.editCountry = false;
  }

  save(event: Event) {
    event.preventDefault();
    this.resetEdit();
    this.saveChanges = false;
  }

  updateProfileQuality(object: {value: number}) {
    this.modalAnswer.profileQuality = object.value;
    this.notifyChanges();
  }

  updateCountry(event: {value: Array<any>}) {
    this.modalAnswer.country = event.value[0];
  }

  updateStatus(event: Event, status: any) {
    this.notifyChanges();
    event.preventDefault();
    this.modalAnswer.status = status;
    if (status === 'VALIDATED' || status === 'VALIDATED_NO_MAIL') {
      this.displayEmail = true;
    } else {
      this.displayEmail = false;
    }
  }

  sendEmail(event: Event, status: any) {
    if (event.target['checked']) {
      this.updateStatus(event, status);
    } else {
      this.updateStatus(event, status = 'VALIDATED_NO_MAIL');
    }
  }

  addTag(tag: Tag): void {
    this.answerService.addTag(this.modalAnswer._id, tag._id).first()
      .subscribe((a) => {
        this.modalAnswer.tags.push(tag);
        this.translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.ADDED');
      }, err => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
      });
  }

  removeTag(tag: Tag): void {
    this.answerService.removeTag(this.modalAnswer._id, tag._id).first()
      .subscribe((a) => {
        this.modalAnswer.tags = this.modalAnswer.tags.filter(t => t._id !== tag._id);
        this.translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.REMOVED');
      }, err => {
        this.translateNotificationsService.error('ERROR.ERROR', err);
      });
  }

  get lang(): string {
    return this.translateService.currentLang || this.translateService.getBrowserLang() || 'en';
  }

}
