import {Component, Input, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Question} from '../../../../models/question';
import {Answer} from '../../../../models/answer';
import {TranslateService} from '@ngx-translate/core';
import {AnswerService} from '../../../../services/answer/answer.service';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {Tag} from '../../../../models/tag';

@Component({
  selector: 'app-user-answer',
  templateUrl: './user-answer.component.html',
  styleUrls: ['./user-answer.component.scss']
})

export class UserAnswerComponent implements OnInit {

  @Input() innovationId: string;
  @Input() questions: Array<Question>;
  @Input() adminMode: boolean;
  @Input() mode: Subject<boolean>;

  @Input() set userAnswer(value: Answer) {
    this.modalAnswer = value;
    if (this.modalAnswer && !this.modalAnswer.company) {
      this.modalAnswer.company = {};
    }
  }

  modalAnswer: Answer;
  floor: any;
  displayEmail = false;
  editJob = false;
  editCompany = false;
  editCountry = false;
  editMode = false;

  constructor(private translateService: TranslateService,
              private answerService: AnswerService,
              private translateNotificationsService: TranslateNotificationsService,
              private innovationService: InnovationService) {}

  ngOnInit() {
    // this.adminMode = this.adminMode && this.authService.adminLevel > 2;

    if (this.mode) {
      this.mode.subscribe((res) => {
        this.editMode = res;
      });
    }

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

  resetEdit() {
    this.editJob = false;
    this.editCompany = false;
    this.editCountry = false;
  }

  changeMode(event: Event) {
    if (event.target['checked']) {
      this.editMode = true;
    } else {
      this.editMode = false;
      this.resetEdit();
    }
  }

  save(event: Event) {
    event.preventDefault();
    this.resetEdit();

    if (this.modalAnswer.professional.email) {
      // Hack : les réponses anciennes n'ont pas de champ quizReference,
      // mais il faut forcément une valeur pour sauvegarder la réponse
      // TODO: remove this hack
      this.modalAnswer.originalAnswerReference = this.modalAnswer.originalAnswerReference || 'oldQuiz';
      this.modalAnswer.quizReference = this.modalAnswer.quizReference || 'oldQuiz';
      this.answerService.save(this.modalAnswer._id, this.modalAnswer).first()
        .subscribe(_ => {
          this.translateNotificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ANSWER.UPDATED');
        }, err => {
          this.translateNotificationsService.error('ERROR.ERROR', err);
        });
    }

  }

  updateProfileQuality(object: {value: number}) {
    this.modalAnswer.profileQuality = object.value;
  }

  updateCountry(event: {value: Array<any>}) {
    this.modalAnswer.country = event.value[0];
  }

  updateStatus(event: Event, status: any) {
    event.preventDefault();
    if (this.editMode) {
      this.modalAnswer.status = status;
      if (status === 'VALIDATED' || status === 'VALIDATED_NO_MAIL') {
        this.displayEmail = true;
      } else {
        this.displayEmail = false;
      }
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.NOT_MODIFIED.USER_ANSWER');
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
